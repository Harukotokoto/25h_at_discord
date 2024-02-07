import {
  APIRole,
  ChatInputCommandInteraction,
  Colors,
  Guild,
  Message,
  Role,
} from 'discord.js';
import { footer } from '../../utils/Embed';
import { reaction_roles_model } from '../../models/reaction_roles';
import { CommandError } from '../../utils/CommandError';

type RROptions = {
  title?: string | null;
  description?: string | null;
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
            color: Colors.Gold,
            footer: footer(),
          },
        ],
      });

      await interaction.followUp({
        embeds: [
          {
            title: 'パネルを新規作成しました',
            description: `識別ID: ${id}`,
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    }
  }

  public roles = {
    add: async (
      id: string,
      options: { role: Role | APIRole; label?: string | null }
    ) => {
      if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
        const interaction = this.InteractionOrMessage;

        const Error = new CommandError(interaction);

        const panel = await reaction_roles_model.findOne({
          GuildID: interaction.guild?.id,
          RRID: id,
        });

        if (!panel) {
          return await Error.create(
            '指定されたIDのパネルは見つかりませんでした'
          );
        }

        panel.Roles.push({
          RoleID: options.role.id,
          Label: options?.label || options.role.name,
        });

        await panel.save();

        await interaction.followUp({
          embeds: [
            {
              title: 'ロールを追加しました',
              description:
                `識別ID: ${id}\n\n` +
                `追加したロール: ${options.role.toString()}\n` +
                `表示名: ${options?.label || options.role.name}`,
              color: Colors.Green,
              footer: footer(),
            },
          ],
        });
      }
    },
  };
}
