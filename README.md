# Trivia Bot
*Not the [House Trivia Bot](https://github.com/TwilightZebby/HouseTriviaBot)*

---

## Information

This is just a small little Trivia Bot made by TwilightZebby for use on Dr1fterX's [Discord Server](https://discord.gg/URH5E34FZf). (He's a [twitch streamer](https://twitch.tv/Dr1fterX))

The Bot's Trivia Rounds works as so:

* Once a round starts (triggered using a command by that round's host), a series of random questions are given to the Users.
* Each question is given one at a time, with about 20 seconds given to try and answer it correctly.
* Users earn points for answering questions correctly.
* *However,* only the first ten (10) to answer correctly gets points. The quicker you are of those 10, the more points you earn!

---

### Can I invite this Bot to my own Server?
> Nope. Sorry!
> 
> I made this Bot for use in Dr1fterX's Discord only. Also, I won't be keeping this Bot online 24/7 - only while we require the use of it :)


### Why is there not a Help Command?
> Because Discord released their custom [Slash Command API](https://discord.com/developers/docs/interactions/slash-commands), and since you can also have command descriptions on those, I decided to use that instead


### What are the Register/Deregister Commands for?
> The `register` command is for registering this Bot's Slash Commands
> The `deregister` command does the reverse, it removes those registered Slash Commands
>
> I decided to use [Guild Slash Commands](https://discord.com/developers/docs/interactions/slash-commands#registering-a-command) instead of Global Slash Commands because then I could 'hide' the Bot when we are not using it for Speed-Trivia Rounds (since Guild Slash Commands update almost instantly; while Global Commands update within 1 hour)


### Can I see a list of all the Trivia Questions (and Answers) on this Bot?
> Nope.
> 
> I have hidden the JSON file used to store the Questions and Answers. This is so people can't have this GitHub Repro open while there are active Trivia Rounds :P
