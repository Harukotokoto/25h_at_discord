import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('messageCreate', async (message) => {
  if (
    message.author.id === '330416853971107840' &&
    message.content.includes('ようこそ！ゆっくりしていってね！')
  ) {
    await message.react('1204194769782317106');
  }
});
