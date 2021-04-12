// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

const COUNTDOWN = require('../hiddenJsonFiles/countdown.json');

// THIS COMMAND
module.exports = {
    name: 'setcountdown',
    description: 'Set the date/time for the countdown',

    // Usage(s)
    //     - Using an Array just in case there's multiple usages
    usage: [ `${PREFIX}setcountdown <timeDate> ` ],

    // Type of Command
    //     - Use 'general' if not in a sub-folder within .\commands\
    commandType: 'general',
    
    // Alterative command names
    //aliases: [''],

    // Are Arguments required for this command
    args: true,

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     'host' - Only the Round Hosts can use this command. Round Hosts are listed by USER IDs in the hidden .\config.js file
    //     If commented out, everyone can use this command
    limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 600,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      // MODULE IMPORTS
      const ErrorModule = require('../bot_modules/errorLogger.js');
      




      
      const newCountdownDate = args.shift();

      COUNTDOWN["countdown"] = newCountdownDate;

      fs.writeFile('./countdown.json', JSON.stringify(COUNTDOWN, null, 4), async (err) => {
        if (err) {
            return await ErrorModule.LogCustom(err, `ERROR while trying to SAVE COUNTDOWN to countdown.json`);
        }
      });


      return await message.channel.send(`Successfully set the new time & date of the countdown for the next Speed Trivia Round`);

      //END OF COMMAND
    },
};
