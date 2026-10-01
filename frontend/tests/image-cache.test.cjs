const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(file, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, URL, process, __dirname,
    require: name => mocks[name] ?? require(name),
  });
  return module.exports;
}

const imageUrl = load("src/utils/imageUrl.ts");
const source = "https://res.cloudinary.com/maqas/image/upload/v123/avatars/user.jpg";

test("сохраняются версия и имя файла, новый аватар получает отдельный URL", () => {
  const url = imageUrl.getImageUrl(source, "avatar");
  assert.equal(url, "https://res.cloudinary.com/maqas/image/upload/c_limit,w_256/f_auto/q_auto/v123/avatars/user.jpg");
  assert.notEqual(imageUrl.getImageUrl(source.replace("v123", "v124"), "avatar"), url);
  assert.equal(imageUrl.getImageUrl(url, "avatar"), url);
});

test("локальные, подписанные, приватные и сторонние изображения не изменяются", () => {
  for (const url of [
    "blob:https://maqas.ru/local-image", "data:image/png;base64,abc", "/photo.png",
    "https://example.com/image/upload/v123/photo.jpg",
    source + "?token=secret", source.replace("/v123/", "/s--signature--/v123/"),
    source.replace("/upload/", "/authenticated/"), source.replace("/v123", ""),
    source.replace("res.cloudinary.com", "res.cloudinary.com.evil.test"),
  ]) assert.equal(imageUrl.getImageUrl(url, "post"), url);
});

test("при ошибке оптимизации загружается оригинал, новая картинка снова оптимизируется", () => {
  let state = null;
  const Image = load("src/components/common/OptimizedImage.tsx", {
    "@/utils/imageUrl": imageUrl,
    react: { ...require("react"), useState: () => [state, value => { state = value; }] },
  }).default;
  const errors = [];
  const onLoad = () => {};
  const props = { src: source, variant: "avatar", onLoad, onError: error => errors.push(error) };
  const first = Image(props);
  assert.equal(first.props.crossOrigin, "anonymous");
  assert.equal(first.props.onLoad, onLoad);
  first.props.onError({ type: "error" });
  assert.equal(errors.length, 0);
  const fallback = Image(props);
  assert.equal(fallback.props.src, source);
  assert.equal(fallback.props.crossOrigin, undefined);
  fallback.props.onError({ type: "error" });
  assert.equal(errors.length, 1);
  const next = Image({ ...props, src: source.replace("v123", "v124") });
  assert.equal(next.props.crossOrigin, "anonymous");
  assert.match(next.props.src, /v124/);
});

test("правило service worker работает после сериализации и исключает API, ошибки и приватные URL", () => {
  const config = load("vite.config.ts", {
    vite: { defineConfig: value => value, loadEnv: () => ({}) },
    "@vitejs/plugin-react": () => ({}),
    "@tailwindcss/vite": () => ({}),
    "vite-plugin-pwa": { VitePWA: options => options },
  }).default({ mode: "production" });
  const route = config.plugins[2].workbox.runtimeCaching[0];
  // Workbox переносит callback в другой JS-файл без его окружения.
  const match = vm.runInNewContext(`(${route.urlPattern.toString()})`);
  const matches = (src, destination = "image", mode = "cors") =>
    match({ request: { destination, mode }, url: new URL(src) });
  for (const variant of ["avatar", "post", "message"]) {
    assert.equal(matches(imageUrl.getImageUrl(source, variant)), true);
  }
  const optimized = imageUrl.getImageUrl(source, "avatar");
  assert.equal(matches(optimized, "", "cors"), false);
  assert.equal(matches(optimized, "image", "no-cors"), false);
  assert.equal(matches(optimized + "?token=secret"), false);
  assert.equal(matches(optimized.replace("/upload/", "/authenticated/")), false);
  assert.equal(matches("https://maqas.ru/api/posts/feed"), false);
  assert.equal(route.options.cacheableResponse.statuses.includes(200), true);
  assert.equal(route.options.cacheableResponse.statuses.includes(0), false);
  assert.equal(route.options.cacheableResponse.statuses.includes(404), false);
});
