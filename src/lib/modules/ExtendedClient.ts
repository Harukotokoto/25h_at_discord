import {
  Client,
  ClientEvents,
  ClientOptions,
  Collection,
  Message,
  PartialMessage,
} from 'discord.js';
import { promisify } from 'util';
import glob from 'glob';
import { Event } from './Event';
import { CommandType } from '../interfaces/Command';
import { Logger } from '../utils';
import mongoose from 'mongoose';
import process from 'process';
import moment from 'moment';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  public snipes: Collection<string, Message<boolean> | PartialMessage> =
    new Collection<string, Message<boolean> | PartialMessage>();
  public edit_snipes: Collection<
    string,
    {
      oldMessage: Message<boolean> | PartialMessage;
      newMessage: Message<boolean> | PartialMessage;
    }
  > = new Collection<
    string,
    {
      oldMessage: Message<boolean> | PartialMessage;
      newMessage: Message<boolean> | PartialMessage;
    }
  >();

  public commands: Collection<string, CommandType> = new Collection<
    string,
    CommandType
  >();

  public start_time = moment();

  public Logger = new Logger();

  public constructor(options: ClientOptions) {
    super(options);
  }

  public start(): void {
    this.login(process.env.CLIENT_TOKEN).then(() => {
      this.Logger.info('Logged in successfully');
    });

    this.register_modules().then(() =>
      this.Logger.info('Modules loaded successfully')
    );

    mongoose
      .connect(process.env.DATABASE_CONNECTION_URI)
      .then(() => this.Logger.info('Successfully connected to database'));
  }

  public async importFile<T>(filePath: string): Promise<T> {
    return (await import(filePath))?.default;
  }

  public async loadEvents() {
    const eventFiles = await globPromise(
      `${__dirname}/../../events/**/*{.ts,.js}`
    );
    for (const filePath of eventFiles) {
      const event = await this.importFile<Event<keyof ClientEvents>>(filePath);
      if (event && 'event' in event) {
        this.on(event.event, event.run);
      }
    }
  }

  public async register_modules() {
    const commands: CommandType[] = [];
    const original_commands: CommandType[] = [];

    const commandFiles = await globPromise(
      __dirname + `/../../commands/*/*{.ts,.js}`
    );

    for (const filePath of commandFiles) {
      const command = await this.importFile<CommandType>(filePath);
      if (!command || !('name' in command)) continue;

      commands.push(command);
      this.commands.set(command.name, command);
    }

    this.on('ready', () => {
      this.application?.commands
        .set(commands)
        .then(() =>
          this.Logger.info(
            `Registered ${commands.length} slash commands on ${this.guilds.cache.size} servers`
          )
        )
        .catch((e) => {
          this.Logger.info(`Failed to register slash commands`);
          this.Logger.error(e);
        });
    });

    await this.loadEvents();
  }
}
