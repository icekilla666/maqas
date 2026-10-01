const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QueryClient, MutationObserver } = require("@tanstack/react-query");

function load(file, mocks = {}) {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, "../src", file), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => mocks[name] ?? require(name) });
  return module.exports;
}

const keys = load("utils/constants.ts");

test("пункт удаления виден только автору поста", () => {
  for (const id of ["author", "another-user", undefined]) {
    const { default: PostMenu } = load("components/common/Posts/PostMenu.tsx", {
      "../ItemMenu": { default: ({ actions }) => React.createElement("div", null, actions.map(action =>
        React.createElement("button", { key: action.text }, action.text))) },
      "@/components/ui/Modals/ModalActions": { default: () => null },
      "@/lib/usersQueries": { useMeQuery: () => ({ data: id ? { id } : undefined }) },
      "@/lib/postsQueries": { useDeletePostMutation: () => ({ isPending: false }) },
    });
    const html = renderToStaticMarkup(React.createElement(PostMenu, { postId: "post", authorId: "author" }));
    assert.equal(html.includes("Удалить пост"), id === "author");
  }
});

function setup(deletePost) {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity }, mutations: { gcTime: Infinity } } });
  const errors = [];
  const { useDeletePostMutation } = load("lib/postsQueries.ts", {
    "@/utils/apiError": { showApiError: error => errors.push(error) },
    "@/services/posts.api": { postsApi: { deletePost } },
    "@/utils/constants": keys,
    "@tanstack/react-query": { useMutation: options => options },
    "./queryClient": { queryClient: client },
    "@/store/draft.store": {},
    "@/utils/requestOutcome": {},
  });
  const listKeys = [keys.postsKeys.myPosts(), keys.postsKeys.userPosts("author"), keys.postsKeys.postFeed({ feed_type: "all" }), keys.likesKeys.myLiked()];
  for (const key of listKeys) client.setQueryData(key, [{ id: "deleted" }, { id: "kept" }]);
  client.setQueryData(keys.postsKeys.post("deleted"), { id: "deleted", content: "text" });
  client.setQueryData(keys.userKeys.me(), { id: "author", posts_count: 2 });
  client.setQueryData(keys.userKeys.detail("author"), { id: "author", posts_count: 2 });
  const observer = new MutationObserver(client, useDeletePostMutation());
  return { client, observer, errors, listKeys };
}

test("после подтверждённого удаления очищаются списки и обновляются профиль и карточка поста", async () => {
  let finish;
  let calls = 0;
  const env = setup(() => { calls++; return new Promise(resolve => { finish = resolve; }); });
  const pending = env.observer.mutate({ postId: "deleted", authorId: "author" });
  await new Promise(setImmediate);
  assert.equal(env.client.getQueryData(env.listKeys[0]).length, 2);
  finish();
  await pending;
  for (const key of env.listKeys) {
    assert.equal(env.client.getQueryData(key).length, 1);
    assert.equal(env.client.getQueryData(key)[0].id, "kept");
  }
  for (const key of [keys.postsKeys.post("deleted"), keys.userKeys.me(), keys.userKeys.detail("author")]) {
    assert.equal(env.client.getQueryState(key).isInvalidated, true);
  }
  assert.equal(calls, 1);
  env.client.clear();
});

test("отказ сервера сохраняет пост и не запускает автоматический повтор", async () => {
  let calls = 0;
  const error = new Error("Нет прав на действие");
  const env = setup(async () => { calls++; throw error; });
  await assert.rejects(env.observer.mutate({ postId: "deleted", authorId: "author" }), error);
  for (const key of env.listKeys) assert.equal(env.client.getQueryData(key).length, 2);
  assert.equal(env.errors[0], error);
  assert.equal(calls, 1);
  env.client.clear();
});

test("API удаления вызывает DELETE с идентификатором поста", async () => {
  const calls = [];
  const { postsApi } = load("services/posts.api.ts", {
    "@/mocks/posts.mock": {},
    "@/utils/settingsMock": {},
    "./api": { api: { delete: async url => { calls.push(url); } } },
  });
  await postsApi.deletePost("post-id");
  assert.deepEqual(calls, ["/api/posts/post-id"]);
});
