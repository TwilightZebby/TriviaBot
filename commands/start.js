// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// THIS COMMAND
module.exports = {
    name: 'start',
    description: 'Starts a Trivia Round!',

    // Usage(s)
    //     - Using an Array just in case there's multiple usages
    usage: [ `${PREFIX}start ` ],

    // Type of Command
    //     - Use 'general' if not in a sub-folder within .\commands\
    commandType: 'general',
    
    // Alterative command names
    //aliases: [''],

    // Are Arguments required for this command
    //args: true,

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     'hosts' - Only the Round Hosts can use this command. Round Hosts are listed by USER IDs in the hidden .\hiddenJsonFiles\hosts.js file
    //     If commented out, everyone can use this command
    limitation: 'host',

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
      const Trivia = require('../bot_modules/triviaModule.js');
      
      
      return await Trivia.Main(message);

      //END OF COMMAND
    },
};
