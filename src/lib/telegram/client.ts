import "server-only";

import { getTelegramBotToken } from "@/lib/telegram/config";

const TELEGRAM_API_BASE = "https://api.telegram.org";

async function callTelegramApi<T>(
  method: string,
  init?: RequestInit,
): Promise<T> {
  const token = getTelegramBotToken();
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/${method}`, init);

  const payload = (await response.json().catch(() => null)) as
    | { ok: true; result: T }
    | { ok: false; description?: string }
    | null;

  if (!response.ok || !payload || !("ok" in payload) || !payload.ok) {
    const description =
      payload && "description" in payload && payload.description
        ? payload.description
        : `Telegram API ${method} failed (${response.status})`;

    throw new Error(description);
  }

  return payload.result;
}

type TelegramFile = {
  file_id: string;
  file_path?: string;
};

export async function getTelegramFile(fileId: string): Promise<TelegramFile> {
  return callTelegramApi<TelegramFile>(
    `getFile?file_id=${encodeURIComponent(fileId)}`,
  );
}

export async function downloadTelegramFile(filePath: string): Promise<Buffer> {
  const token = getTelegramBotToken();
  const response = await fetch(
    `${TELEGRAM_API_BASE}/file/bot${token}/${filePath}`,
  );

  if (!response.ok) {
    throw new Error(`Telegram file download failed (${response.status})`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function sendTelegramMessage(input: {
  chatId: string;
  text: string;
  replyToMessageId?: number;
}): Promise<void> {
  await callTelegramApi("sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: input.chatId,
      text: input.text,
      ...(input.replyToMessageId
        ? { reply_to_message_id: input.replyToMessageId }
        : {}),
    }),
  });
}
