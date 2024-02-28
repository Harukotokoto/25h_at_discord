import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  Colors,
  ComponentType,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'poll',
  description: '投票を作成します',
  options: [
    {
      name: 'topic',
      description: '投票のタイトル',
      type: ApplicationCommandOptionType.String,
      required: true,
      maxLength: 2000,
      minLength: 1,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const vote_model = client.models.vote;

      const topic = interaction.options.getString('topic', true);

      await interaction.deleteReply();

      const msg = await interaction.channel?.send({
        embeds: [
          {
            title: '📌 投票が開始されました',
            description: '> ' + topic,
            fields: [
              {
                name: '✅ 賛成',
                value: '> **投票なし**',
                inline: true,
              },
              {
                name: '❌ 反対',
                value: '> **投票なし**',
                inline: true,
              },
              {
                name: '投票作成者',
                value: `> ${interaction.user}`,
                inline: true,
              },
            ],
            footer: footer(),
            color: Colors.Gold,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: '✅',
                customId: 'up',
                style: ButtonStyle.Secondary,
              },
              {
                type: ComponentType.Button,
                label: '❌',
                customId: 'down',
                style: ButtonStyle.Secondary,
              },
              {
                type: ComponentType.Button,
                label: '投票数',
                customId: 'votes',
                style: ButtonStyle.Secondary,
              },
            ],
          },
        ],
      });

      msg?.createMessageComponentCollector();

      await vote_model.create({
        MessageID: msg?.id,
        Upvote: 0,
        Downvote: 0,
        UpMembers: [],
        DownMembers: [],
        GuildID: interaction.guild?.id,
        Owner: interaction.user.id,
      });
    },
  },
});
