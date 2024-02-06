import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { client } from '../../index';
import { Event } from '../../lib/modules/Event';
import { CommandError, ErrorTypes } from '../../lib/utils/CommandError';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    const Error = new CommandError(interaction);

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;

    const allowedCommands = ['snipe'];
    if (
      interaction.guild?.id === '1176812762110885908' &&
      !command?.ephemeral &&
      (!command?.type || command?.type === ApplicationCommandType.ChatInput) &&
      interaction.channel?.id !== '1176828166287921212' &&
      !member.permissions.has(['ManageGuild']) &&
      !allowedCommands.includes(command?.name as string)
    ) {
      await interaction.deferReply({ ephemeral: true });
      return await Error.create('コマンドチャンネルで実行してください');
    }

    await interaction.deferReply({
      ephemeral: command?.ephemeral || false,
    });

    if (!command) return await Error.create('コマンドが存在しません');

    if (!command.execute.interaction)
      return await Error.create(
        'コマンドがスラッシュコマンドに対応していません',
        ErrorTypes.Warn
      );

    const admins = ['1004365048887660655', '1176812229631430660', '790021463293165588'];

    if (command.isOwnerCommand && !admins.includes(interaction.user.id))
      return await Error.create(
        'このコマンドはBot関係者のみ実行可能です',
        ErrorTypes.Warn
      );

    if (!member.permissions.has(command.requiredPermissions || []))
      return await Error.create('このコマンドを使用する権限が不足しています');

    if (!command.type || command.type === ApplicationCommandType.ChatInput) {
      await command.execute.interaction({
        client,
        interaction: interaction as ChatInputCommandInteraction,
      });
    }

    if (command.type === ApplicationCommandType.Message) {
      await command.execute.interaction({
        client,
        interaction: interaction as MessageContextMenuCommandInteraction,
      });
    }

    if (command.type === ApplicationCommandType.User) {
      await command.execute.interaction({
        client,
        interaction: interaction as UserContextMenuCommandInteraction,
      });
    }
  }
});
