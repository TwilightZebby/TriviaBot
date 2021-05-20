// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'top',
    description: 'Shows a leaderboard of the top 10 peeps',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // If the Slash Command can only be used in Guilds
    //     Comment out if this Slash Command can also be used in DMs
    guildOnly: true,

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {*} guildID 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guildID, data, commandData, member) {

      // Bring in JSON store of points
      const PLAYERSCORES = require('../hiddenJsonFiles/playerScores.json');
      let playerPoints = Object.values(PLAYERSCORES);

      // bubble sort Points
      let playerSorted;

      do {

          playerSorted = false;

          for ( let i = 0; i < playerPoints.length - 1; i++ ) {

              if ( playerPoints[i].score < playerPoints[i + 1].score ) {
                  let temp = playerPoints[i];
                  playerPoints[i] = playerPoints[i + 1];
                  playerPoints[i + 1] = temp;

                  playerSorted = true;
              }

          }

      } while (playerSorted === true);







      // Fetch first ten of Player's Scores
      let playerArray = [];
      if ( playerPoints.length < 10 ) {

        for ( let i = 0; i < playerPoints.length; i++ ) {
          playerArray.push(`${i + 1}) **${playerPoints[i].username}** - ${playerPoints[i].score} points`);
        }

      }
      else {

        for ( let i = 0; i < 10; i++ ) {
          playerArray.push(`${i + 1}) **${playerPoints[i].username}** - ${playerPoints[i].score} points`);
        }

      }







      const embed = new Discord.MessageEmbed().setColor('GOLD')
      .setTitle(`Trivia Leaderboard`);









      // Also fetch the Author's ranking
      let arrayIndex = 0;
      let authorScore;

      for ( arrayIndex; arrayIndex < playerPoints.length; arrayIndex++ )
      {
        if ( playerPoints[arrayIndex].id === member["user"]["id"] )
        {
          authorScore = playerPoints[arrayIndex].score;
          break;
        }
        else
        {
          continue;
        }
      }

      embed.setDescription(`${member["nick"] !== null ? member["nick"] : member["user"]["username"]} - Rank \#${arrayIndex + 1} - ${authorScore} Points`);



      // Add leaderboard to Embed and send
      embed.addFields(
        {
          name: `Top 10 Members`,
          value: playerArray.join(`\n`)
        }
      );




      await SlashCommands.Callback(data, ``, embed);
      delete embed;
      return;

      // END OF SLASH COMMAND
    },















    /**
     * Registers the Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
     async register(isGlobal, guildID) {

      // Data
      const data = {};
      data.name = "top";
      data.description = "See a Top 10 of who has the most correct answers";
      data.options = new Array();

      

      if ( isGlobal ) {
          client.api.applications(client.user.id).commands().post({data});
      }
      else {
          client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;

    }
};
