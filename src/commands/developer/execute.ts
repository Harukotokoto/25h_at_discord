import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { exec } from 'child_process';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'execute',
  description: 'シェルコマンドを実行します',
  isOwnerCommand: true,
  options: [
    {
      name: 'command',
      description: 'Bash command',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const command = interaction.options.getString('command') || '';

      exec(command, (err, res) => {
        if (err) return console.log(err);

        interaction.followUp({
          embeds: [
            {
              title: 'Bash scriptを実行しました',
              description:
                '実行したコマンド\n```\n$ ' +
                command +
                '\n```\n結果\n' +
                '```\n' +
                res.slice(0, 2000) +
                '\n```',
              color: Colors.Aqua,
              footer: footer(),
            },
          ],
        });
      });
    },
    message: async ({ client, message, args }) => {
      if (!args[0]) return;

      const command = args.join(' ');

      exec(command, (err, res) => {
        if (err) return console.log(err);

        message.reply({
          embeds: [
            {
              title: 'Bash scriptを実行しました',
              description:
                '実行したコマンド\n```\n$ ' +
                command +
                '\n```\n結果\n' +
                '```\n' +
                res.slice(0, 2000) +
                '\n```',
              color: Colors.Aqua,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });
      });
    },
  },
});
