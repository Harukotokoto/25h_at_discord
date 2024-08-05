function escDiscordFormat(text: string) {
  return text.replace(/[*_`~|]/g, '\\$&');
}

export { escDiscordFormat };
