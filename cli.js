#!/usr/bin/env node
const commander = require('commander');
const chalk = require('chalk');
const { parseRank } = require('./utils');
const { Errors, Color } = require('hypixel-api-reborn');
commander
  .version(require('./package.json').version)
  .description('hypixel-api-reborn but CLI');

commander
  .command('player <query>')
  .option('-r, --raw', 'Raw data', false)
  .option('-g, --guild', 'Request for player\'s guild', false)
  .requiredOption('-k, --key <key>', 'API key', null)
  .action((query, options) => {
    if (!options.key) return console.log(chalk.red(Errors.NO_API_KEY));
    const hypixel = require('./hypixel')(options.key);
    console.log(chalk.yellow(`Sending request using ${options.key.slice(0, 8) + options.key.slice(8).replace(/[^-]/g, '*')}\n`));
    hypixel.getPlayer(query, { guild: options.guild }).then((player) => {
      if (options.raw) {
        console.log(player);
        process.exit(0);
      }
      let profile = '';
      profile += `${parseRank(player.rank, player.nickname, player.plusColor, player.prefixColor)}\n`;
      profile += `Level: ${chalk.hex(new Color('GOLD').toHex())(Math.floor(player.level))}\n`;
      profile += `Achievement Points: ${chalk.hex(new Color('YELLOW').toHex())(player.achievementPoints.toLocaleString('en-US'))}\n`;
      if (player.guild) profile += `Guild: ${chalk.hex(new Color('AQUA').toHex())(player.guild.name)}`;
      console.log(profile);
      process.exit(0);
    }).catch((e) => {
      console.log(chalk.redBright(e));
      process.exit(0);
    });
  });

commander.parse(process.argv);