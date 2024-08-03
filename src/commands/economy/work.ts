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

        if (minutesDifference < 15) {
          await Error.create('このコマンドは15分に1回のみ実行できます');
          return;
        }
      }

      const amount = Math.floor(Math.random() * 1000) + 300;
      await economy.addToWallet(amount);

      await cooltime.setCooltime(await uuid.getUUID(), 'work');

      await interaction.followUp({
        embeds: [
          {
            title: 'コインを獲得しました',
            description: `+${amount}コイン`,
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    },
  },
});
