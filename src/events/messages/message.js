const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

const guildCommandPrefixes = new Map();

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
    this.connection = StateManager.connection;
  }

  async run(client, message) {
    if (message.author.bot) return;
    const prefix = guildCommandPrefixes.get(message.guild.id);
    if (message.content.toLowerCase().startsWith(prefix + "help")) {
      message.channel.send(`You triggerd prefix: ${prefix}`);
    } else if (
      message.content.toLowerCase().startsWith(prefix + "changeprefix")
    ) {
      if (message.member.id === message.guild.ownerID) {
        const [cmdName, newPrefix] = message.content.split(" ");
        if (newPrefix) {
          try {
            await this.connection.query(
              `UPDATE GuildConfigurable SET cmdPrefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
            );
            guildCommandPrefixes.set(message.guild.id, newPrefix);
            message.channel.send(`Updated the prefix to ${newPrefix}`);
          } catch (err) {
            console.log(err);
            message.channel.send("Failed to update the prefix.");
          }
        } else {
          message.channel.send("te weinig argumenten.");
        }
      } else {
        message.channel.send("you do not have perms.");
      }
    }
  }
};

StateManager.on("prefixFetched", (guildId, prefix) => {
  guildCommandPrefixes.set(guildId, prefix);
});
