import chalk from 'chalk'

import Util from '@common/util'

import Player from '@domains/player'
import Clan from '@domains/clan'
import Guild from '@domains/guild'
import Taoist from '@classes/taoist'
import Arbalist from '@classes/arbalist'

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
        class: Util.randomInstanceClass()
      })
    )
  )
)

// get clan and players
const lastClan = guild.getClan('ForWin 9')

// remove two players
lastClan.removePlayerByIndex(0)
lastClan.removePlayerByIndex(1)

// add two players
lastClan.add(new Player({
  name: 'vContinuous',
  class: new Taoist(),
  level: 83,
  power: 119557
}))
lastClan.add(new Player({
  name: 'Lu L4',
  class: new Arbalist(),
  level: 91,
  power: 131557
}))

console.log(chalk.yellow('BEFORE RELOCATION'))
Util.printPlayersFromClans(guild)

// relocation players
guild.relocation()

console.log(chalk.blue('AFTER RELOCATION'))
Util.printPlayersFromClans(guild)
console.log('> done')
