import { Colors, CommandInteraction, Message } from 'discord.js';
import { footer } from './Embed';

export enum ErrorTypes {
  Warn = Colors.Yellow,
  Error = Colors.Red,
}

export class CommandError {
  private readonly parent: CommandInteraction | Message;

  public constructor(parent: CommandInteraction | Message) {
    this.parent = parent;
  }

  public async create(message: string, ErrorType?: ErrorTypes) {
    if (this.parent instanceof CommandInteraction) {
      await this.parent.followUp({
        embeds: [
          {
            title:
              ErrorType === ErrorTypes.Error
                ? 'エラーが発生しました'
                : undefined,
            description: message,
            color: ErrorType || Colors.Red,
            footer: footer(),
          },
        ],
      });
    } else {
      await this.parent.reply({
        embeds: [
          {
            title:
              ErrorType === ErrorTypes.Error
                ? 'エラーが発生しました'
                : undefined,
            description: message,
            color: ErrorType || Colors.Red,
            footer: footer(),
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    }
  }
}
