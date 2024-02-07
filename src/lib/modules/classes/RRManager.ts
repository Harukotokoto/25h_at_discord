import {
  APIRole,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  Guild,
  Message,
  Role,
} from 'discord.js';
import { footer } from '../../utils/Embed';
import { reaction_roles_model } from '../../models/reaction_roles';
import { CommandError } from '../../utils/CommandError';
import { Promise } from 'mongoose';

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

      const msg = await interaction.channel.send({
        embeds: [
          {
            title: options?.title || 'リアクションロール',
            description:
              options?.description?.replace(/\/\//g, '\n') ||
              'メニューから取得したいロールを選択し、決定してください',
            color: Colors.Gold,
            footer: footer(),
          },
        ],
      });

      await reaction_roles_model.create({
        MessageID: msg.id,
        RRID: id,
        GuildID: interaction.guild?.id,
        ChannelID: interaction.channel.id,
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

        if (panel.Roles.find((role) => role.RoleID === role.id)) {
          return await Error.create('指定されたロールは既に登録されています');
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
    delete: async (
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

        if (!panel.Roles.find((role) => role.RoleID === role.id)) {
          return await Error.create('指定されたロールは登録されていません');
        }

        panel.Roles.filter((role) => role.RoleID !== role.id);

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

  public async refresh(id: string) {
    if (this.InteractionOrMessage instanceof ChatInputCommandInteraction) {
      const interaction = this.InteractionOrMessage;

      const panel = await reaction_roles_model.findOne({
        GuildID: interaction.guild?.id,
        RRID: id,
      });

      if (!panel) return;

      const channel = interaction.guild?.channels.cache.get(panel.ChannelID);
      if (!channel || !channel.isTextBased()) {
        panel.deleteOne();
        await panel.save();
        return;
      }

      const message = await channel.messages.fetch(panel.MessageID);
      if (!message) {
        panel.deleteOne();
        await panel.save();
        return;
      }

      await message.edit({
        embeds: message.embeds,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.StringSelect,
                options: panel.Roles.map((role) => {
                  return {
                    label: role.Label,
                    value: role.RoleID,
                  };
                }),
                placeholder: 'ロールを選択',
                customId: 'reaction_role',
              },
            ],
          },
        ],
      });
    }
  }
}
