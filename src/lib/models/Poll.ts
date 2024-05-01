import { ChatInputCommandInteraction } from 'discord.js';

export class Poll {
  private interaction: ChatInputCommandInteraction;

  public constructor(handleInteraction: ChatInputCommandInteraction) {
    this.interaction = handleInteraction;
  }

  public start(topic: string, description: string) {}
}
