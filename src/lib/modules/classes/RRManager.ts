import { ChatInputCommandInteraction, Colors, Message } from 'discord.js';
import { footer } from '../../utils/Embed';
import { reaction_roles_model } from '../../models/reaction_roles';
import { CommandError } from '../../utils/CommandError';

type RROptions = {
  title?: string;
  description?: string;
  color?: number;
};

export class RRManager {
  protected InteractionOrMessage:
    | ChatInputCommandInteraction
    | Message<boolean>;

  public constructor(
    InteractionOrMessage: ChatInputCommandInteraction | Message<boolean>
  ) {
    this.InteractionOrMessage = InteractionOrMessage;
  }

  public async create(id: string, options?: RROptions) {
    if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
      const interaction = this.InteractionOrMessage;
      if (!interaction || !interaction.channel) return;

      const Error = new CommandError(interaction);

      const rr = await reaction_roles_model.findOne({
        GuildID: interaction.guild?.id,
        RRID: id,
      });

      if (rr) return await Error.create('既に指定されたIDは使用されています');

      await reaction_roles_model.create({
        MessageID: (await interaction.fetchReply()).id,
        RRID: id,
        GuildID: interaction.guild?.id,
      });

      await interaction.channel.send({
        embeds: [
          {
            title: options?.title || 'リアクションロール',
            description:
              options?.description ||
              'メニューから取得したいロールを選択し、決定してください',
            color: options?.color || Colors.Gold,
            footer: footer(),
          },
        ],
      });
    }
  }
}
