import { Event } from '../../lib/modules/Event';
import {
  StatusUpdater,
  UpdateType,
} from '../../lib/modules/classes/StatusUpdater';
import ms from 'ms';
import { client } from '../../index';

export default new Event('ready', async () => {
  const status = '1197050561376296991';
  const ws_status = '1198538046769987624';
  const uptime_status = '1198538870510338118';
  const ram_status = '1198538953381392414';
  const cpu_status = '1198538987938263061';
  const version_status = '1198539042208354374';

  const Updater = new StatusUpdater('🔹：[state]');

  await Updater.setUpdater(status, UpdateType.Status);
  await Updater.setUpdater(ws_status, UpdateType.WebSocket);
  await Updater.setUpdater(uptime_status, UpdateType.Uptime);
  await Updater.setUpdater(ram_status, UpdateType.RAM);
  await Updater.setUpdater(cpu_status, UpdateType.CPU);
  await Updater.setUpdater(version_status, UpdateType.Version);

  await Updater.update();
  client.Logger.debug('チャンネルステータスをアップデートしました');

  setInterval(async () => {
    await Updater.update();
    client.Logger.debug('チャンネルステータスをアップデートしました');
  }, ms('1m'));
});
