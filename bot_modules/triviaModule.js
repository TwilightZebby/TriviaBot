// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const CONFIG = require('../config.js');

// OTHER IMPORTS
const QSTORE = require('../triviaQuestions/christmas2020.json'); // Bringing in the Questions & Answers (change if need be)
const EMPTYSCORES = require('../templates/templateJSON.json');

const ErrorModule = require('./errorLogger.js');

let questionInterval;
let delay = 50000;
let askedQuestions = [ 0 ];
let correctUserIDs = [];
let wrongUserIDs = [];

// THIS MODULE
module.exports = {
    /**
     * Handles the main functions of Trivia Rounds
     * 
     * @param {Discord.Message} message 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Main(message) {

        // Fetch stuff needed
        const triviaChannel = message.channel;
        


        // Send starting message
        let embed = new Discord.MessageEmbed().setColor('#008bb5')
        .setTitle(`Trivia Night!`)
        .setDescription(`A new Trivia Round is about to start!
        
        You will have 20 seconds per question to answer them correctly.
        The first 10 correct answers score points, the quicker you are, the more points you earn!
        
        Answers are case-insensitive, so don't worry about UPPERCASE letters!
        Furthermore, only your first answer/guess for each question will be checked.`)
        .addFields(
            {
                name: `Round Host`,
                value: message.member.displayName,
                inline: true
            },
            {
                name: `Total Questions`,
                value: CONFIG.QUESTION_AMOUNT,
                inline: true
            }
        );

        await triviaChannel.send(embed);

        delete embed; // Free up cache



        // QUESTIONS!
        let currentQuestion = 1;
        delay = 50000;


        // First question
        setTimeout(async () => {
            await this.AskQuestion(triviaChannel, currentQuestion);
            currentQuestion += 1;
        }, 20000);


        // Rest of the questions
        questionInterval = setTimeout(async function QuestionLoop() {

            // DO NOT REMOVE - otherwise everything breaks!
            // Yes, I know importing something inside of itself shouldn't be, but it doesn't work otherwise without this!
            const Trivia = require('./triviaModule.js');

            if ( currentQuestion >= ( CONFIG.QUESTION_AMOUNT + 1 ) ) {
    
                await Trivia.Results(triviaChannel);
                clearTimeout(questionInterval);
                return;
    
            }
            else if ( currentQuestion === 2 ) {
    
                delay = 30000;
                await Trivia.AskQuestion(triviaChannel, currentQuestion);
                currentQuestion += 1;
                questionInterval = setTimeout(QuestionLoop, delay);
    
            }
            else {
    
                await Trivia.AskQuestion(triviaChannel, currentQuestion);
                currentQuestion += 1;
                questionInterval = setTimeout(QuestionLoop, delay);
    
            }
    
        }, delay);

    },
    



























    /**
     * Posts Results of that Round
     * 
     * @param {Discord.TextChannel} channel 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Results(channel) {

        let TEMPSCORES = require('../hiddenJsonFiles/roundScores.json');






        // Collect results
        let tempScoresObject = Object.values(TEMPSCORES);
        
        // bubble-sort scores from that round
        let sorted;

        do {

            sorted = false;

            for ( let i = 0; i < tempScoresObject.length - 1; i++ ) {
                
                if ( tempScoresObject[i].score < tempScoresObject[i + 1].score ) {
                    let temp = tempScoresObject[i];
                    tempScoresObject[i] = tempScoresObject[i + 1];
                    tempScoresObject[i + 1] = temp;

                    sorted = true;
                }

            }

        } while (sorted === true);



        let roundResultsArray = [];

        if ( tempScoresObject.length < 10 ) {

            for ( let i = 0; i < tempScoresObject.length; i++ ) {
                roundResultsArray.push(`${i + 1}) **${tempScoresObject[i].username}**  -  ${tempScoresObject[i].score} points earnt`);
            }

        }
        else {

            for ( let i = 0; i < 10; i++ ) {
                roundResultsArray.push(`${i + 1}) **${tempScoresObject[i].username}**  -  ${tempScoresObject[i].score} points earnt`);
            }

        }










        // SEND
        let playerEmbed = new Discord.MessageEmbed().setColor('GOLD')
        .setTitle(`Results of this Round`)
        .setDescription(`${roundResultsArray.join(`\n`)}`);


        await channel.send(playerEmbed);


        // free up cache
        delete playerEmbed;
        //askedQuestions = [ 0 ]; // Empty Array, comment out to have unique questions across the *whole* thing and not just a single round




        // Clear roundScores.json so that it is ready for the next round
        fs.writeFile('./hiddenJsonFiles/roundScores.json', JSON.stringify(EMPTYSCORES, null, 4), async (err) => {
            if (err) {
                await ErrorModule.LogCustom(err, `ERROR while trying to SAVE EMPTYSCORES to roundScores.json`);
            }
        });


        return;

    },




























    /**
     * Handles asking of and listening for Answers
     * 
     * @param {Discord.TextChannel} channel 
     */
    async AskQuestion(channel, currentNumber) {

        let TEMPSCORES = require('../hiddenJsonFiles/roundScores.json');
        const PLAYERSCORES = require('../hiddenJsonFiles/playerScores.json');










        let userAnswers = [];

        // Temp copy QUESTIONS into this Object so I can fetch its size
        let qtemp = Object.values(QSTORE);


        // Select a random question
        let questionNumber = Math.floor( ( Math.random() * qtemp.length ) + 1 );

        // Ensure we don't get repeated questions
        while ( askedQuestions.includes(questionNumber) ) {
            questionNumber = Math.floor( ( Math.random() * qtemp.length ) + 1 );
        }

        let chosenQuestion = QSTORE[`${questionNumber}`].question;
        let questionAnswers = QSTORE[`${questionNumber}`].answers;
        let questionTag = QSTORE[`${questionNumber}`].tag || "Misc.";

        

        // Send Question
        let embed = new Discord.MessageEmbed().setColor('#75ebeb')
        .setTitle(`Question ${currentNumber} - [${questionTag}]`)
        .setDescription(`${chosenQuestion}`);


        // If there's an image attached
        if ( QSTORE[`${questionNumber}`].image ) {
            embed.setImage(QSTORE[`${questionNumber}`].image);
        }

        await channel.send(embed);
        delete embed; // free up cache
        askedQuestions.push(questionNumber);


        // Filter for Message Collector
        const filter = m => {
            let isAnswerCorrect = false;

            for ( let i = 0; i < questionAnswers.length; i++ ) {
                let tempRegEx = new RegExp(questionAnswers[i], "i");

                if ( tempRegEx.test(m.content.toLowerCase()) )
                {
                    // They got the correct answer
                    isAnswerCorrect = true;
                    break;
                }
            }

            if ( !isAnswerCorrect )
            {
                // They got the answer wrong
                wrongUserIDs.push(m.member.user.id);
            }

            return isAnswerCorrect && m.member.user.id !== "156482326887530498" && m.member.user.id !== "259073082277363713" && !correctUserIDs.includes(m.member.user.id) && !wrongUserIDs.includes(m.member.user.id);
            //return isAnswerCorrect && !correctUserIDs.includes(m.member.user.id) && !wrongUserIDs.includes(m.member.user.id);
        }



        // Begin listening for the correct answer

        const collector = channel.createMessageCollector(filter, { time: 20000, max: 10 });
        collector.on('collect', async (message) => {

            correctUserIDs.push(message.author.id); // Prevent peeps cheating by answering twice

            if ( userAnswers.length === 10 ) {
                return;
            }
            else {
                userAnswers.push(message.author.id);
                return;
            }

        });

        collector.on('end', async (collected, reason) => {

            correctUserIDs = [];
            wrongUserIDs = [];

            // Time is up! Check Array
            let embed = new Discord.MessageEmbed().setColor('#008bb5')
            .setTitle(`⌛ Time's up!`);

            let messageArray = [];

            for ( let i = 0; i < userAnswers.length; i++ ) {

                let tempMember = await channel.guild.members.fetch(userAnswers[i]);
                
                // Add to scores stores
                if ( !TEMPSCORES[tempMember.user.id] ) {
                    TEMPSCORES[tempMember.user.id] = {
                        username: tempMember.user.username,
                        id: tempMember.user.id,
                        score: 0
                    }
                }


                if ( !PLAYERSCORES[tempMember.user.id] ) {
                    PLAYERSCORES[tempMember.user.id] = {
                        username: tempMember.user.username,
                        id: tempMember.user.id,
                        score: 0
                    }
                }






                TEMPSCORES[tempMember.user.id].score += CONFIG.POINTS_AWARDED[i];
                PLAYERSCORES[tempMember.user.id].score += CONFIG.POINTS_AWARDED[i];




                // Save new rankings to JSONs
                fs.writeFile('./hiddenJsonFiles/playerScores.json', JSON.stringify(PLAYERSCORES, null, 4), async (err) => {
                    if (err) {
                        await ErrorModule.LogCustom(err, `ERROR while trying to SAVE PLAYERSCORES to playerScores.json`);
                    }
                });

                fs.writeFile('./hiddenJsonFiles/roundScores.json', JSON.stringify(TEMPSCORES, null, 4), async (err) => {
                    if (err) {
                        await ErrorModule.LogCustom(err, `ERROR while trying to SAVE TEMPSCORES to roundScores.json`);
                    }
                });


                messageArray.push(`${i + 1})  ${tempMember.user.username}`);

            }


            // Embed
            embed.addFields(
                {
                    name: `Correct Answer(s)`,
                    value: `\u200B ${questionAnswers.join(`, `)}`
                },
                {
                    name: `Quickest 10 peeps to answer Question ${currentNumber}`,
                    value: `\u200B ${messageArray.join(`\n`)}`
                },
                {
                    name: `\u200B`,
                    value: `\u200B ${currentNumber + 1 === CONFIG.QUESTION_AMOUNT ? "Last Question in 10 seconds..." : currentNumber === CONFIG.QUESTION_AMOUNT ? "Round is over! Results in 10 seconds..." : "Next Question in 10 seconds..."}`
                }
            );

            await channel.send(embed);
            delete embed; // free up cache
            

        });

    }

};
