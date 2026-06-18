export function isAllowedTelegramChat(
  chatId: string | number,
  allowedChatIds: Set<string>,
): boolean {
  if (allowedChatIds.size === 0) {
    return false;
  }

  return allowedChatIds.has(String(chatId));
}
