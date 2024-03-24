import { GuildMember } from 'discord.js';

export class User {
  public member: GuildMember;

  public constructor(member: GuildMember) {
    this.member = member;
  }
}
