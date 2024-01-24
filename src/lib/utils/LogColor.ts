export enum C {
  Black = '\u001b[30m',
  Red = '\u001b[31m',
  Green = '\u001b[32m',
  Yellow = '\u001b[33m',
  Blue = '\u001b[34m',
  Magenta = '\u001b[35m',
  Cyan = '\u001b[36m',
  White = '\u001b[37m',
  Default = '\x1b[39m',
}

export enum BC {
  Black = '\x1b[40m',
  Red = '\x1b[41m',
  Green = '\x1b[42m',
  Yellow = '\x1b[43m',
  Blue = '\x1b[44m',
  Magenta = '\x1b[45m',
  Cyan = '\x1b[46m',
  White = '\x1b[47m',
  Default = '\x1b[49m',
}

export const Reset = '\u001b[0m';
