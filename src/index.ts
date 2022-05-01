import chalk from 'chalk'

import Util from '@common/util'

import Player from '@domains/player'
import Clan from '@domains/clan'
import Guild from '@domains/guild'

const guild = new Guild()

// add random clans for guild
Array.from(
  Array(10).keys(),
  clanIndex => guild.add(new Clan({
  name: `ForWin ${clanIndex}`
})))

// add random players for the clans
Array.from(
  guild.getClans(),
  clan => Array.from(
    Array(50).keys(),
    _ =>
      clan.add(new Player({
        name: Util.randomUUID(),
        level: Util.randomNumber(10, 80),
        power: Util.randomNumber(0, 100000),
        classe: Util.randomClass()
      })
    )
  )
)

console.log(chalk.yellow('BEFORE RELOCATION'))
//printPlayersFromClans(guild)

// get clan and players
const clan = guild.getClan('ForWin 0')
//console.log('clan founded', clan)

// remove two players
clan.removePlayerByIndex(0)
clan.removePlayerByIndex(1)

// relocation players
//guild.relocation()

console.log(chalk.blue('AFTER RELOCATION'))
//printPlayersFromClans(guild)
console.log('> done')