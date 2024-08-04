import { Command } from '../../lib/modules/Command';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { CoolTime } from '../../lib/modules/classes/CoolTime';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'work',
  description: '15分に1回コインを獲得できます',
  execute: {
    interaction: async ({ client, interaction }) => {
      const uuid = new UUID(interaction.user.id);
      const economy = new Economy(await uuid.getUUID());
      const cooltime = new CoolTime(await uuid.getUUID());

      const last_used = await cooltime.getCooltime('work');

      const Error = new CommandError(interaction);

      if (last_used) {
        const now = new Date();
        const timeDifference = now.getTime() - last_used.getTime();
        const minutesDifference = timeDifference / (1000 * 60);

        const next_available_date = new Date(
          last_used.getTime() + 15 * 60 * 1000
        );
        const next_available_timestamp = Math.floor(
          next_available_date.getTime() / 1000
        );

        if (minutesDifference < 15) {
          await Error.create(
            'このコマンドは<t:${next_available_timestamp}:R>に実行できます'
          );
          return;
        }
      }

      const amount = Math.floor(Math.random() * 1000) + 500;
      await economy.addToWallet(amount);

      await cooltime.setCooltime(await uuid.getUUID(), 'work');

      await interaction.followUp({
        embeds: [
          {
            title: 'コインを獲得しました',
            description: `+${amount}コイン\n残高: ${await economy.getWallet()}コイン`,
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    },
  },
});
