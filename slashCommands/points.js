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
    name: 'points',
    description: 'See how many points you have',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // If the Slash Command can only be used in Guilds
    //     Comment out if this Slash Command can also be used in DMs
    //guildOnly: true,

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      // JSON IMPORTS
      const PLAYERSCORES = require('../hiddenJsonFiles/playerScores.json');
      const playerPoints = Object.values(PLAYERSCORES);


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






      const embed = new Discord.MessageEmbed();












      
      // Check if there was any arguments passed
      if ( !commandData.options ) {
        
        // No Arguments, fetch author's points
        const authorMember = await guild.members.fetch(data.member.user.id);






        // Check Scores Store
        if ( !PLAYERSCORES[authorMember.user.id] ) {
          return await SlashCommands.Callback(data, `You haven't earnt any points yet!`);
        }




        let arrayIndex = 0;
        let authorScore;


        for ( arrayIndex; arrayIndex < playerPoints.length; arrayIndex++ ) {
        
          if ( playerPoints[arrayIndex].id === authorMember.user.id ) {
            authorScore = playerPoints[arrayIndex].score;
            break;
          }
          else {
            continue;
          }

        }


        embed.setColor('RANDOM')
        .addFields(
          {
            name: `${authorMember.displayName}`,
            value: `\* ${authorScore} Points\n\* Ranked #${arrayIndex + 1}`
          }
        );

        await SlashCommands.Callback(data, ``, embed);
        delete embed; // free up cache
        return;

      }
      else {













        // Argument was passed, fetch points for given User instead
        const member = await guild.members.fetch(commandData.options[0].value);





        // Check Scores Stores
        if ( !PLAYERSCORES[member.user.id] ) {
          return await SlashCommands.Callback(data, `${member.displayName} has yet to earn any points!`);
        }





        let arrayIndex = 0;
        let memberScore;


        for ( arrayIndex; arrayIndex < playerPoints.length; arrayIndex++ ) {
        
          if ( playerPoints[arrayIndex].id === member.user.id ) {
            memberScore = playerPoints[arrayIndex].score;
            break;
          }
          else {
            continue;
          }

        }


        embed.setColor('RANDOM')
        .addFields(
          {
            name: `${member.displayName}`,
            value: `\* ${memberScore} Points\n\* Ranked #${arrayIndex + 1}`
          }
        );

        await SlashCommands.Callback(data, ``, embed);
        delete embed; // free up cache
        return;

      }

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
      data.name = "points";
      data.description = "See how many points you have";
      data.options = new Array();

      const option = {};
      option.name = "user";
      option.description = "See someone else's points";
      option.type = 6; // User
      option.required = false;

      data.options.push(option);

      

      if ( isGlobal ) {
          client.api.applications(client.user.id).commands().post({data});
      }
      else {
          client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;

    }
};
