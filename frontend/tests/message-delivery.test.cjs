const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const axios = require("axios");

function load(file, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, FormData,
    URL: { createObjectURL: () => "blob:local-image", revokeObjectURL() {} },
    require: (name) => mocks[name] ?? require(name),
  });
  return module.exports;
}

const delivery = load("utils/requestOutcome.ts");
const failure = (status) => new axios.AxiosError(
  "Request failed", status ? "ERR_BAD_RESPONSE" : "ECONNABORTED",
  undefined, undefined, status ? { status } : undefined,
);

// Минимальный исполнитель состояния для проверки веток обработчиков хуков.
// DOM и сеть в этих тестах не запускаются.
function hooks() {
  const slots = [];
  let index = 0;
  return {
    react: {
      useState(initial) {
        const i = index++;
        if (!(i in slots)) slots[i] = typeof initial === "function" ? initial() : initial;
        return [slots[i], (next) => { slots[i] = typeof next === "function" ? next(slots[i]) : next; }];
      },
      useRef(initial) {
        const i = index++;
        if (!(i in slots)) slots[i] = { current: initial };
        return slots[i];
      },
      useMemo: (fn) => fn(),
      useEffect() {},
      useLayoutEffect() {},
    },
    render(fn) { index = 0; return fn(); },
  };
}

function setupSend() {
  let resolve;
  let reject;
  let sends = 0;
  let refetches = 0;
  const request = new Promise((yes, no) => { resolve = yes; reject = no; });
  const conversation = hooks();
  const composer = hooks();
  const unusedMutation = () => ({ isPending: false, isError: false, mutate() {} });
  const { useChatConversation } = load("hooks/useChatConversation.ts", {
    react: conversation.react,
    "react-router-dom": { useLocation: () => ({ state: null }), useNavigate: () => () => {} },
    "@/lib/chatsQueries": {
      useMyChatsQuery: () => ({ data: [] }),
      useChatMessagesQuery: () => ({ data: [], isSuccess: true, refetch: async () => { refetches++; } }),
      useCreateMessageMutation: () => ({ isPending: false, mutateAsync: () => { sends++; return request; } }),
      useDeleteChatMutation: unusedMutation,
      useDeleteMessageMutation: unusedMutation,
      useMarkMessagesAsReadMutation: unusedMutation,
      useUpdateMessageMutation: unusedMutation,
    },
    "@/lib/usersQueries": { useMeQuery: () => ({ data: { id: "me", name: "Me" } }) },
    "@/utils/constants": { CHATS_PAGE: "/chats" },
    "@/store/chatsRealtime.store": { useChatsRealtimeStore: () => false },
    "@/utils/requestOutcome": delivery,
  });
  const { useChatComposer } = load("hooks/useChatComposer.ts", {
    react: composer.react,
    sonner: { toast: { error() {} } },
    "./useChatTyping": { useChatTyping: () => ({ handleTyping() {}, stopTyping() {} }) },
  });
  const renderConversation = () => conversation.render(() => useChatConversation("chat-1"));
  const renderComposer = () => {
    const chat = renderConversation();
    return composer.render(() => useChatComposer({
      chatId: "chat-1", onSend: chat.handleSend, isPending: chat.isSending,
      disabled: chat.isComposerDisabled,
    }));
  };
  const image = new File(["image"], "image.png", { type: "image/png" });
  renderComposer().handleChange({ target: { value: "Подпись" } });
  renderComposer().handleFileChange({ target: { files: [image], value: "image.png" } });
  return { renderConversation, renderComposer, resolve, reject, get sends() { return sends; }, get refetches() { return refetches; } };
}

test("таймаут, отсутствие ответа и 5xx имеют неопределённый результат", () => {
  for (const status of [undefined, 408, 500, 502, 504]) {
    assert.equal(delivery.isRequestOutcomeUncertain(failure(status)), true);
  }
  for (const status of [400, 401, 403, 413, 422, 429]) {
    assert.equal(delivery.isRequestOutcomeUncertain(failure(status)), false);
  }
});

test("фото ждёт до двух минут; обычные запросы сохраняют общий таймаут", async () => {
  const calls = [];
  const send = async (...args) => { calls.push(args); return { data: { data: {} } }; };
  const { chatsApi } = load("services/chats.api.ts", { "./api": { api: { post: send, patch: send } } });
  const image = new File(["image"], "image.png", { type: "image/png" });
  await chatsApi.createMessage({ chat_id: "chat", image });
  assert.equal(calls[0][2].timeout, 120_000);
  assert.equal(calls[0][1].get("image").name, "image.png");
  await chatsApi.createMessage({ chat_id: "chat", content: "Текст" });
  assert.equal(calls[1][2].timeout, undefined);
  await chatsApi.updateMessage({ message_id: "message", image, image_removed: false });
  assert.equal(calls[2][2].timeout, 120_000);
});

test("при таймауте карточка остаётся, файл не возвращается в форму и повтор не отправляется", async () => {
  const env = setupSend();
  const sending = env.renderComposer().handleSubmit({ preventDefault() {} });
  assert.equal(env.renderComposer().attachment, null);
  assert.equal(env.renderConversation().messages.length, 1);
  env.reject(failure());
  await sending;
  const chat = env.renderConversation();
  assert.equal(chat.isDeliveryUnconfirmed, true);
  assert.equal(chat.messages[0].image_url, "blob:local-image");
  assert.equal(chat.isComposerDisabled, true);
  assert.equal(env.refetches, 1);
  assert.equal(env.renderComposer().attachment, null);
  assert.equal(env.renderComposer().content, "");
  await env.renderComposer().handleSubmit({ preventDefault() {} });
  assert.equal(env.sends, 1);
  chat.dismissUnconfirmedMessage();
  assert.equal(env.renderConversation().messages.length, 0);
  assert.equal(env.renderConversation().isDeliveryUnconfirmed, false);
  assert.equal(env.renderComposer().isDisabled, false);
  assert.equal(env.renderComposer().attachment, null);
});

test("при явном отказе сервера черновик и файл возвращаются в форму", async () => {
  const env = setupSend();
  const sending = env.renderComposer().handleSubmit({ preventDefault() {} });
  env.reject(failure(413));
  await sending;
  assert.equal(env.renderConversation().messages.length, 0);
  assert.equal(env.renderConversation().isDeliveryUnconfirmed, false);
  assert.equal(env.renderComposer().attachment.file.name, "image.png");
  assert.equal(env.renderComposer().content, "Подпись");
});

test("успех удаляет только карточку ожидания и оставляет форму пустой", async () => {
  const env = setupSend();
  const sending = env.renderComposer().handleSubmit({ preventDefault() {} });
  env.resolve({ id: "server-message" });
  await sending;
  assert.equal(env.renderConversation().pendingMessageId, undefined);
  assert.equal(env.renderConversation().isDeliveryUnconfirmed, false);
  assert.equal(env.renderComposer().attachment, null);
  assert.equal(env.renderComposer().content, "");
});
