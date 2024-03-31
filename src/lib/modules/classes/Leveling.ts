import { level_model } from '../../models/level_model';
import { Rank } from 'canvacord';
import { User } from './User';

export class Leveling extends User {
  private getRandomExperience(): number {
    return Math.floor(Math.random() * 10) + 15;
  }

  public getExperienceByLevel(level: number): number {
    return (
      250 * level +
      Math.pow(level, 2) * 0.5 +
      (123 * level + Math.pow(level, 2) * 0.5)
    );
  }

  public getLevelByExperience(experience: number): number {
    let level = 0;
    while (experience >= this.getExperienceByLevel(level)) {
      experience -= this.getExperienceByLevel(level);
      level++;
    }
    return level;
  }

  public async addExperience(): Promise<boolean> {
    const level_data = await level_model.findOne({
      UserID: this.member.id,
      GuildID: this.member.guild.id,
    });

    if (level_data) {
      if (level_data.updatedAt) {
        const now = new Date();
        const updatedAt = new Date(level_data.updatedAt);
        const difference = (now.getTime() - updatedAt.getTime()) / 1000;

        if (difference > 15) {
          level_data.Experience += this.getRandomExperience();

          if (
            level_data.Experience >= this.getExperienceByLevel(level_data.Level)
          ) {
            level_data.Level++;
            level_data.Experience = 0;
          }

          await level_data.save().catch(() => {
            return false;
          });
        }
      } else {
        level_data.Experience += this.getRandomExperience();

        if (
          level_data.Experience >= this.getExperienceByLevel(level_data.Level)
        ) {
          level_data.Level++;
          level_data.Experience = 0;
        }

        await level_data.save().catch(() => {
          return false;
        });
      }
    } else {
      const newLevel = new level_model({
        UserID: this.member.id,
        GuildID: this.member.guild.id,
        Experience: this.getRandomExperience(),
        Level: 0,
      });

      await newLevel.save().catch(() => {
        return false;
      });
    }

    return true;
  }

  public async getCurrentLevel() {
    return level_model.findOne({
      UserID: this.member.id,
      GuildID: this.member.guild.id,
    });
  }

  public async createCard() {
    const fetchedLevel = await this.getCurrentLevel();
    let allLevels = await level_model
      .find({ GuildID: this.member.guild.id })
      .select('-_id UserID Level Experience');

    allLevels.sort((a, b) => {
      if (a.Level === b.Level) {
        return b.Experience - a.Experience;
      } else {
        return b.Level - a.Level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.UserID === this.member.id) + 1;

    const user = new User(this.member);

    const rank = new Rank()
      .setAvatar(this.member.user.displayAvatarURL())
      .setRank(currentRank)
      .setLevel(fetchedLevel?.Level ?? 0)
      .setCurrentXP(fetchedLevel?.Experience ?? 0)
      .setRequiredXP(this.getExperienceByLevel(fetchedLevel?.Level ?? 0))
      .setStatus('online')
      .registerFonts([
        {
          path: `${__dirname}/../../../../assets/fonts/MPLUSRounded1c-Regular.ttf`,
          name: 'MPLUSRounded1c-Regular',
        },
      ])
      .setUsername(`${this.member.user.displayName}(${this.member.user.tag})`);

    return rank.build({
      fontX: 'MPLUSRounded1c-Regular',
      fontY: 'MPLUSRounded1c-Regular',
    });
  }

  public static async getTop10(guildID: string) {
    const allLevels = await level_model
      .find({ GuildID: guildID })
      .select('-_id UserID Level Experience');

    return allLevels
      .sort((a, b) => {
        if (a.Level === b.Level) {
          return b.Experience - a.Experience;
        } else {
          return b.Level - a.Level;
        }
      })
      .slice(0, 10);
  }

  public async resetLevel() {
    const allLevels = await level_model.find({ UserID: this.member.id });
  }

  public async resetAll(guildId: string) {
    await level_model.deleteMany({ GuildID: guildId });
  }
}
