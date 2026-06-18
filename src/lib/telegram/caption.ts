export function getTelegramCaptionKeyword(): string {
  return process.env.TELEGRAM_CAPTION_KEYWORD?.trim() || "#박스";
}

export function matchesTelegramCaption(
  caption: string | undefined | null,
): boolean {
  const keyword = getTelegramCaptionKeyword();
  const text = caption?.trim() ?? "";

  if (!text) {
    return false;
  }

  return text.toLowerCase().includes(keyword.toLowerCase());
}

export function buildTelegramCaptionHint(): string {
  const keyword = getTelegramCaptionKeyword();
  return `사진과 함께 캡션에 ${keyword} 를 포함해 주세요. (예: ${keyword} 1번 박스)`;
}
