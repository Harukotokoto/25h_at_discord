import { Event } from '../../lib/modules/Event';
import { vote_model } from '../../lib/models/vote';
import { ButtonStyle, Colors, ComponentType, EmbedBuilder } from 'discord.js';
import { Types } from 'mongoose';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.guild) return;
  if (!interaction.isButton()) return;
  if (!interaction.message) return;

  let data = await vote_model.findOne({ GuildID: interaction.guild.id });
  if (!data) return;
  const msg = interaction.channel?.messages.cache.get(data.MessageID as string);

  if (!msg) return;

  if (interaction.customId === 'up') {
    if (data.UpMembers.includes(interaction.user.id)) {
      return await interaction.reply({
        content:
          'あなたは既に投票しているため、重複して投票することができません',
        ephemeral: true,
      });
    }

    if (!data.Downvote || !data.Upvote) return;
    if (data.DownMembers.includes(interaction.user.id)) {
      data.Downvote = data.Downvote - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields([
      {
        name: '賛成',
        value: `> ${data.Upvote + 1}票`,
        inline: true,
      },
      {
        name: '反対',
        value: `> ${data.Downvote}票`,
        inline: true,
      },
      {
        name: '投票作成者',
        value: `> ${interaction.user}`,
        inline: true,
      },
    ]);

    interaction.update({
      embeds: [newEmbed],
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

    data.Upvote++;

    if (data.DownMembers.includes(interaction.user.id)) {
      data.Downvote = data.Downvote - 1;
    }

    data.UpMembers.push(interaction.user.id);
    data.DownMembers = data.DownMembers.filter(
      (user) => user !== interaction.user.id
    );
    data.save();
  }

  if (interaction.customId === 'down') {
    if (data.UpMembers.includes(interaction.user.id)) {
      return await interaction.reply({
        content:
          'あなたは既に投票しているため、重複して投票することができません',
        ephemeral: true,
      });
    }

    if (!data.Downvote || !data.Upvote) return;
    if (data.UpMembers.includes(interaction.user.id)) {
      data.Upvote = data.Upvote - 1;
    }

    const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields([
      {
        name: '✅ 賛成',
        value: `> ${data.Upvote}票`,
        inline: true,
      },
      {
        name: '❌ 反対',
        value: `> ${data.Downvote + 1}票`,
        inline: true,
      },
      {
        name: '投票作成者',
        value: `> ${interaction.user}`,
        inline: true,
      },
    ]);

    interaction.update({
      embeds: [newEmbed],
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

    data.Downvote++;

    if (data.UpMembers.includes(interaction.user.id)) {
      data.Upvote = data.Upvote - 1;
    }

    data.DownMembers.push(interaction.user.id);
    data.UpMembers = data.UpMembers.filter(
      (user) => user !== interaction.user.id
    );
    data.save();
  }

  if (interaction.customId === 'votes') {
    let upvoters = [];
    for (const member of data.DownMembers) {
      upvoters.push(`<@!${member}>`);
    }

    let downvoters = [];
    for (const member of data.DownMembers) {
      downvoters.push(`<@!${member}>`);
    }

    interaction.reply({
      embeds: [
        {
          title: '📌 投票数一覧',
          fields: [
            {
              name: `✅ 賛成(${upvoters.length})`,
              value: `> ${upvoters.join(' ').slice(0, 1020) || '**投票なし**'}`,
              inline: true,
            },
            {
              name: `❌ 反対(${downvoters.length})`,
              value: `> ${downvoters.join(' ').slice(0, 1020) || '**投票なし**'}`,
              inline: true,
            },
          ],
          footer: footer(),
          color: Colors.Gold,
        },
      ],
      ephemeral: true,
    });
  }
});
