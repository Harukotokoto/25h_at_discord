import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
} from 'discord.js';
import { ticket } from '../../../lib/models/ticket';
import { CommandError } from '../../../lib/utils/CommandError';

export const add_member = async ({
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
}) => {
  const Error = new CommandError(interaction);
  const member = interaction.options.getUser('member');
  if (!member) return;

  let ticket_data = await ticket.findOne({
    GuildID: interaction.guild?.id,
    TicketChannelID: interaction.channel?.id,
    Closed: false,
  });

  if (!ticket_data) {
    return await Error.create('ここはチケットチャンネルではありません');
  }

  const member_exists_in_server = interaction.guild?.members.cache.find(
    (mbr) => mbr.user.id === member.id
  );

  if (!member_exists_in_server) {
    return await Error.create('指定したユーザーがサーバー内に存在しません');
  }

  if (interaction.channel?.type === ChannelType.PrivateThread) {
    const thread_member = await interaction.channel.members.fetch(member.id);

    if (thread_member) {
      return await Error.create(
        '指定したユーザーは既にチケットに追加されています'
      );
    }

    ticket_data.MembersAdded.push(member.id);
    ticket_data.save()

    await interaction.channel.members.add(member.id)

    return await interaction.followUp({
      content: '正常にメンバーを追加しました',
      ephemeral: true,
    })
  }
};
