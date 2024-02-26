import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { CommandError, ErrorTypes } from '../../lib/modules/classes/CommandError';
import { Events } from 'discord.js';

export default new Event('messageCreate', async (message) => {
  const prefix = '.';

  const Error = new CommandError(message);

  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  ) {
    return;
  }

  const [cmd, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command || !command.execute.message) return;

  const member = message.guild?.members.cache.get(message.author.id);
  if (!member) return;

  const allowedCommands = ['snipe'];
  if (
    message.guild?.id === '1176812762110885908' &&
    message.channel?.id !== '1207564615320608798' &&
    !member.permissions.has(['ManageGuild']) &&
    !allowedCommands.includes(command.name)
  ) {
    return;
  }

  const admins = [
    '1004365048887660655',
    '1176812229631430660',
    '790021463293165588',
  ];

  if (command.isOwnerCommand && !admins.includes(message.author.id))
    return await Error.create(
      'このコマンドはBot関係者のみ実行可能です',
      ErrorTypes.Warn
    );

  if (!member.permissions.has(command.requiredPermissions || []))
    return await Error.create('このコマンドを使用する権限が不足しています');

  await command.execute.message({ client, message, args });
});
