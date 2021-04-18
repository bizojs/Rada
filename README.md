# Multi purpose discord bot made by br4d#0040

This bot is the first proper bot that I have open sourced. I prefer to keep bots closed source due to the fact that I'm not a huge fan of people self hosting their own version of my bot that I spent alot of time and effort on. That changes today with Rada! If you're interested in self hosting Rada, there's information below on how to do so!

**Dependencies**
- __NodeJS__: You will need NodeJS v12 or above. You can get that [here](https://nodejs.org/en/download/).
- __Git__: You will need Git. You can get that [here](https://git-scm.com/download/).
- __MongoDB__: You will need a MongoBD instance. You can follow the guide [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) to install it.

**Installation**
- Open command prompt and type `git clone https://github.com/Iskawo/Rada.git`
- In command prompt, type `cd Rada` to enter the directory. Once in the directory, type `npm i`. This will install all required packages
- Edit `example.env` (main directory) with your own information then rename it to `.env`
- Edit `example-config.js` (src folder) again with your own information then rename it to `config.js`

**Running**
- Simply type `node .` or `node rada.js` in the command prompt to start the bot

**Running with sharding**
- Navigate to `lib\ws\ShardManager.js` and then change the `totalShards` to your desired number (`auto` works too.)
- Simply type `npm start` in the command prompt to start the bot with shards.

# ATTENTION
This branch contains the RADA api which is not finished or stable!