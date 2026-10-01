const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const axios = require("axios");
const { QueryClient, MutationObserver } = require("@tanstack/react-query");
const { persist, createJSONStorage } = require("zustand/middleware");

function load(file, mocks = {}, globals = {}) {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, "../src", file), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, FormData,
    require: name => mocks[name] ?? require(name), ...globals,
  });
  return module.exports;
}

function setup() {
  const values = new Map();
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  const makeStore = () => load("store/draft.store.ts", {
    "zustand/middleware": {
      persist: (initializer, options) => persist(initializer, {
        ...options, storage: createJSONStorage(() => storage),
      }),
    },
  }).useDraftStore;
  const store = makeStore();
  const errors = [];
  const invalidated = [];
  let resolve;
  let reject;
  let calls = 0;
  const response = new Promise((yes, no) => { resolve = yes; reject = no; });
  const { useCreatePostMutation } = load("lib/postsQueries.ts", {
    "@/utils/apiError": { showApiError: error => errors.push(error) },
    "@/services/posts.api": { postsApi: { createPost: () => { calls++; return response; } } },
    "@/utils/constants": { postsKeys: { all: ["posts"], createPost: () => ["posts", "create"] }, userKeys: { me: () => ["users", "me"] } },
    "@tanstack/react-query": { useMutation: options => options },
    "./queryClient": { queryClient: { invalidateQueries: options => invalidated.push(options.queryKey) } },
    "@/store/draft.store": { useDraftStore: store },
    "@/utils/requestOutcome": load("utils/requestOutcome.ts"),
  });
  const client = new QueryClient({ defaultOptions: { mutations: { gcTime: Infinity } } });
  const observer = new MutationObserver(client, useCreatePostMutation());
  return { store, makeStore, observer, resolve, reject, errors, invalidated, get calls() { return calls; } };
}

const draft = () => ({ title: "Заголовок", content: "Текст", tags: ["спорт"], image: new File(["image"], "photo.png", { type: "image/png" }) });

test("таймаут сохраняет текст и запрет повторной публикации после перезагрузки", async () => {
  const env = setup();
  const pending = env.observer.mutate(draft());
  const rejected = assert.rejects(pending);
  await new Promise(setImmediate);
  assert.equal(env.store.getState().publicationUnconfirmed, true);
  env.reject(new axios.AxiosError("Timeout", "ECONNABORTED"));
  await rejected;
  const restored = env.makeStore().getState();
  assert.equal(restored.publicationUnconfirmed, true);
  assert.equal(restored.title, "Заголовок");
  assert.equal(restored.content, "Текст");
  assert.equal("image" in restored, false);
  assert.equal(env.errors.length, 0);
  assert.equal(env.calls, 1);
  assert.equal(env.invalidated.length, 2);
});

test("явный отказ возвращает возможность отправки и сохраняет черновик", async () => {
  const env = setup();
  const rejected = assert.rejects(env.observer.mutate(draft()));
  await new Promise(setImmediate);
  env.reject(new axios.AxiosError("Too large", "ERR_BAD_REQUEST", undefined, undefined, { status: 413 }));
  await rejected;
  assert.equal(env.store.getState().publicationUnconfirmed, false);
  assert.equal(env.store.getState().title, "Заголовок");
  assert.equal(env.errors.length, 1);
});

test("успех очищает черновик даже после ухода со страницы", async () => {
  const env = setup();
  const unsubscribe = env.observer.subscribe(() => {});
  const pending = env.observer.mutate(draft());
  await new Promise(setImmediate);
  unsubscribe();
  env.resolve({ id: "created-post" });
  await pending;
  assert.equal(env.store.getState().publicationUnconfirmed, false);
  assert.equal(env.makeStore().getState().title, "");
  assert.equal(env.store.getState().content, "");
});

test("разрешение повтора само по себе не отправляет POST", () => {
  const env = setup();
  env.store.getState().beginPublication(draft());
  env.store.getState().setPublicationUnconfirmed(false);
  assert.equal(env.calls, 0);
  assert.equal(env.store.getState().content, "Текст");
});

test("создание поста с изображением использует увеличенный таймаут", async () => {
  const calls = [];
  const { postsApi } = load("services/posts.api.ts", {
    "@/mocks/posts.mock": {},
    "@/utils/settingsMock": {},
    "./api": { api: { post: async (...args) => { calls.push(args); return { data: { data: { id: "post" } } }; } } },
  });
  await postsApi.createPost(draft());
  assert.equal(calls[0][2].timeout, 120_000);
  assert.equal(calls[0][1].get("title"), "Заголовок");
  assert.equal(calls[0][1].get("image").name, "photo.png");
  await postsApi.createPost({ ...draft(), image: null });
  assert.equal(calls[1][2].timeout, undefined);
});

test("отложенное сохранение отменяется перед отправкой и при закрытии редактора", () => {
  const env = setup();
  const timers = new Map();
  let cleanup;
  const { useDraft } = load("hooks/useDraft.ts", {
    "@/store/draft.store": { useDraftStore: () => env.store.getState() },
    react: { useRef: () => ({ current: null }), useCallback: fn => fn, useEffect: fn => { cleanup = fn(); } },
    sonner: { toast() {} },
  }, { setTimeout: fn => { const id = {}; timers.set(id, fn); return id; }, clearTimeout: id => timers.delete(id) });
  const hook = useDraft(draft());
  hook.saveDraftWithDebounce();
  assert.equal(timers.size, 1);
  hook.cancelDraftSave();
  env.store.getState().resetDraft();
  for (const fn of timers.values()) fn();
  assert.equal(env.store.getState().title, "");
  hook.saveDraftWithDebounce();
  cleanup();
  assert.equal(timers.size, 0);
});
