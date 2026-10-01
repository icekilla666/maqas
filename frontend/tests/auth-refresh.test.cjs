const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const axios = require("axios");

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, "../src", file), "utf8")
    .replace("import.meta.env.VITE_API_URL", "undefined");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, URL, FormData,
    require: (name) => mocks[name] ?? require(name),
  });
  return module.exports;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function respond(config, status, data = {}) {
  const response = { config, status, data, statusText: String(status), headers: {} };
  if (status >= 400) throw new axios.AxiosError("Request failed", "ERR_BAD_RESPONSE", config, null, response);
  return response;
}

function setup(handler, token = "old-token") {
  const { useAuthStore: store } = load("store/auth.store.ts", {
    "zustand/middleware": { persist: (initializer) => initializer },
  });
  if (token) store.getState().setUser(true, token);
  const calls = [];
  const adapter = async (config) => {
    calls.push(config);
    return handler(config);
  };
  const client = { ...axios, create: (options) => axios.create({ ...options, adapter }) };
  const services = load("services/api.ts", {
    axios: { default: client },
    "../store/auth.store": { useAuthStore: store },
  });
  return { ...services, store, calls };
}

const isRefresh = (config) => config.url === "/api/auth/refresh-access";
const refreshed = (config) => respond(config, 201, {
  success: true, data: { access_token: "new-token", token_type: "bearer" },
});

test("401 обновляет токен и повторяет исходный POST с тем же телом", async () => {
  const { api, store, calls } = setup((config) => {
    if (isRefresh(config)) {
      assert.equal(config.withCredentials, true);
      assert.equal(config.headers.Authorization, undefined);
      return refreshed(config);
    }
    if (config.headers.Authorization === "Bearer old-token") return respond(config, 401);
    return respond(config, 200, { saved: true });
  });
  const result = await api.post("/api/comments/post/1", { content: "Привет" });
  assert.equal(result.data.saved, true);
  assert.equal(store.getState().accessToken, "new-token");
  assert.equal(store.getState().sessionVersion, 1);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].data, calls[2].data);
  assert.equal(calls[2].headers.Authorization, "Bearer new-token");
});

test("несколько 401 и старт приложения используют один refresh", async () => {
  const gate = deferred();
  const { api, refreshAccessToken, calls } = setup(async (config) => {
    if (isRefresh(config)) { await gate.promise; return refreshed(config); }
    return respond(config, config.headers.Authorization === "Bearer old-token" ? 401 : 200);
  });
  const first = refreshAccessToken();
  assert.equal(first, refreshAccessToken());
  const requests = Promise.all([api.get("/api/users/me"), api.get("/api/chats/me"), first]);
  await new Promise(setImmediate);
  assert.equal(calls.filter(isRefresh).length, 1);
  gate.resolve();
  await requests;
  assert.equal(calls.filter(isRefresh).length, 1);
  assert.equal(calls.filter((config) => config.headers.Authorization === "Bearer new-token").length, 2);
});

test("поздний 401 со старым токеном не запускает ещё один refresh", async () => {
  const gate = deferred();
  const started = deferred();
  const { api, calls } = setup(async (config) => {
    if (isRefresh(config)) return refreshed(config);
    if (config.url === "/api/slow" && config.headers.Authorization === "Bearer old-token") {
      started.resolve();
      await gate.promise;
    }
    return respond(config, config.headers.Authorization === "Bearer old-token" ? 401 : 200);
  });
  const slow = api.get("/api/slow");
  await started.promise;
  await api.get("/api/fast");
  gate.resolve();
  await slow;
  assert.equal(calls.filter(isRefresh).length, 1);
});

test("повторный 401 не вызывает бесконечные повторы", async () => {
  const { api, calls } = setup((config) => isRefresh(config) ? refreshed(config) : respond(config, 401));
  await assert.rejects(api.get("/api/users/me"));
  assert.equal(calls.length, 3);
});

test("отказ refresh завершает сессию без повторов исходных запросов", async () => {
  const { api, store, calls } = setup((config) => respond(config, 401));
  const results = await Promise.allSettled([api.get("/api/users/me"), api.get("/api/chats/me")]);
  assert(results.every((result) => result.status === "rejected"));
  assert.equal(calls.filter(isRefresh).length, 1);
  assert.equal(store.getState().isAuth, false);
  assert.equal(store.getState().accessToken, null);
});

test("500 и потеря сети при refresh сохраняют сессию и допускают следующую попытку", async () => {
  for (const failure of ["server", "network"]) {
    let fail = true;
    const { api, store, calls } = setup((config) => {
      if (isRefresh(config)) {
        if (!fail) return refreshed(config);
        if (failure === "network") throw new axios.AxiosError("Network Error", "ERR_NETWORK", config);
        return respond(config, 500);
      }
      return respond(config, config.headers.Authorization === "Bearer old-token" ? 401 : 200);
    });
    await assert.rejects(api.get("/api/users/me"));
    assert.equal(store.getState().isAuth, true);
    assert.equal(store.getState().accessToken, "old-token");
    fail = false;
    await api.get("/api/users/me");
    assert.equal(calls.filter(isRefresh).length, 2);
  }
});

test("ошибка логина, обычный 403 и запрос гостя не запускают refresh", async () => {
  for (const [url, status, token] of [
    ["/api/auth/login", 401, "old-token"],
    ["/api/auth/refresh-access", 401, "old-token"],
    ["/api/posts/1", 403, "old-token"],
    ["/api/users/me", 401, null],
  ]) {
    const { api, calls } = setup((config) => respond(config, status), token);
    await assert.rejects(api.get(url));
    assert.equal(calls.length, 1);
  }
});

test("выход или новый вход во время refresh не позволяет восстановить старую сессию", async () => {
  for (const newToken of [null, "another-user-token"]) {
    const started = deferred();
    const gate = deferred();
    const { api, store, calls } = setup(async (config) => {
      if (isRefresh(config)) { started.resolve(); await gate.promise; return refreshed(config); }
      return respond(config, 401);
    });
    const request = api.post("/api/chats/1/messages/create", { content: "Текст" });
    const rejected = assert.rejects(request, axios.isCancel);
    await started.promise;
    store.getState().setUser(!!newToken, newToken);
    gate.resolve();
    await rejected;
    assert.equal(store.getState().accessToken, newToken);
    assert.equal(calls.length, 2);
  }
});

test("запоздалый отказ refresh не сбрасывает новую сессию", async () => {
  const started = deferred();
  const gate = deferred();
  const { api, store } = setup(async (config) => {
    if (isRefresh(config)) { started.resolve(); await gate.promise; }
    return respond(config, 401);
  });
  const rejected = assert.rejects(api.get("/api/users/me"));
  await started.promise;
  store.getState().setUser(true, "another-user-token");
  gate.resolve();
  await rejected;
  assert.equal(store.getState().isAuth, true);
  assert.equal(store.getState().accessToken, "another-user-token");
});

test("FormData сохраняется при повторной отправке", async () => {
  const { api, calls } = setup((config) => {
    if (isRefresh(config)) return refreshed(config);
    return respond(config, config.headers.Authorization === "Bearer old-token" ? 401 : 200);
  });
  const form = new FormData();
  form.append("message", "Привет");
  form.append("image", new Blob(["image bytes"], { type: "image/png" }), "image.png");
  await api.post("/api/chats/1/messages/create", form);
  const retry = calls.at(-1);
  assert.equal(retry.data, form);
  assert.equal(retry.data.get("message"), "Привет");
  assert.equal(retry.data.get("image").name, "image.png");
});
