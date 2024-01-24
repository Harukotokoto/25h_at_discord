import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import { ApplicationCommandOptionType } from 'discord.js';

const createBuffer = async (Buffer: string) => {
  const base64Data = `data:image/png;base64,${Buffer}`;
  const image = await loadImage(base64Data);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return canvas.toBuffer('image/png');
};

export default new Command({
  name: 'degawa',
  description: 'めっちゃ出川',
  aliases: ['d'],
  options: [
    {
      name: 'text',
      description: 'text',
      type: ApplicationCommandOptionType.String,
      max_length: 10,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const text = interaction.options.getString('text');

      if (!text) {
        const imageBuffer = (
          await axios.get('https://degawa.ktrnds.com/random')
        ).data.data;

        await interaction.followUp({
          files: [
            {
              attachment: await createBuffer(imageBuffer),
              name: 'degawa.png',
            },
          ],
        });
      } else {
        const imageBuffer = (
          await axios.post('https://api.ktrnds.com/degawa/generator', {
            text: text,
          })
        ).data.data;

        await interaction.followUp({
          files: [
            {
              attachment: await createBuffer(imageBuffer),
              name: 'degawa.png',
            },
          ],
        });
      }
    },
    message: async ({ client, message, args }) => {
      const imageBuffer = (await axios.get('http://degawa.ktrnds.com/random'))
        .data.data;

      await message.reply({
        files: [
          {
            attachment: await createBuffer(imageBuffer),
            name: 'degawa.png',
          },
        ],
        allowedMentions: {
          parse: [],
        },
      });
    },
  },
});
