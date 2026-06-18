import "server-only";

export function isTelegramEnabled(): boolean {
  return process.env.TELEGRAM_ENABLED === "true";
}

export function getTelegramBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN이 설정되지 않았습니다.");
  }

  return token;
}

export function getTelegramAllowedChatIds(): Set<string> {
  const raw = process.env.TELEGRAM_ALLOWED_CHAT_IDS?.trim() ?? "";

  return new Set(
    raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function getTelegramWebhookSecret(): string | null {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  return secret || null;
}
