import { Command } from '../../lib/modules/Command';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'move',
  description: '',
  ephemeral: false,
  execute: {
    interaction: async ({ client, interaction }) => {
      interaction.followUp({
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'ロールを移行',
                customId: 'move',
                style: ButtonStyle.Secondary
              }
            ]
          }
        ]
      })
    },
  },
});
