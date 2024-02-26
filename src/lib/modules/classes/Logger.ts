import moment from 'moment';
import { BC, C, Reset } from '../../utils/logColor';

export class Logger {
  public info(message: any) {
    const now = moment().format('YYYY/MM/DD hh:mm:ss');

    console.log(
      `${C.Yellow}[${Reset}${now}${C.Yellow}] ${BC.Cyan}${
        C.Default
      }INFO${Reset}   | ${C.Green}${message.toString()}${Reset}`
    );
  }

  public error(message: any) {
    const now = moment().format('YYYY/MM/DD hh:mm:ss');

    console.log(
      `${C.Yellow}[${Reset}${now}${C.Yellow}] ${BC.Red}${
        C.Default
      }ERROR${Reset}  | ${C.Red}${message.toString()}${Reset}`
    );
  }

  public debug(message: any) {
    const now = moment().format('YYYY/MM/DD hh:mm:ss');

    console.log(
      `${C.Yellow}[${Reset}${now}${C.Yellow}] ${BC.Magenta}${
        C.Default
      }DEBUG${Reset}  | ${C.Green}${message.toString()}${Reset}`
    );
  }
}
