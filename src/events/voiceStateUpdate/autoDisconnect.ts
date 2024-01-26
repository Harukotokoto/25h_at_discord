import { Event } from '../../lib/modules/Event';

export default new Event('voiceStateUpdate', async (oldState, newState) => {
  const channel = newState.member?.voice.channel;
  if (!channel) return;

  if (channel) {
    if (channel.id === '1199280550087757864') {
      const allowedMembers = [
        '1004365048887660655',
        '1081819299594915840',
        '411916947773587456',
        '412347257233604609',
        '412347553141751808',
        '412347780841865216',
      ];
      if (!allowedMembers.includes(newState.member?.id)) {
        await newState.disconnect()
      }
    }
  }
});
