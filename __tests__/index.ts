import chalk from 'chalk'
import assert from 'assert/strict'
import factories from './factories'

import Util from '@common/util'

import Taoist from '@classes/taoist'
import Arbalist from '@classes/arbalist'

import Player from '@domains/player'
import Clan from '@domains/clan'
import Guild from '@domains/guild'

function matchObject(obj1: any, obj2: any): boolean {
  const valuesMatching: boolean[] = []

  for (const key in obj1) {
    valuesMatching.push(key in obj2)
    valuesMatching.push(obj1[key] === obj2[key])
  }

  const isFail = valuesMatching.find(v => v === false)
  const isMatched = isFail === false ? false : true

  return isMatched
}

// must be added the player in order of highest power
{
  const vContinuous = new Player({
    name: 'vContinuous',
    power: 117031,
    level: 82,
    classe: new Taoist()
  })
  const LuL4 = new Player({
    name: 'Lu L4',
    power: 131025,
    level: 90,
    classe: new Arbalist()
  })
  const Arriety = new Player({
    name: 'Arriety ツ',
    power: 42000,
    level: 48,
    classe: new Arbalist()
  })

  const forwin = new Clan({
    name: 'ForWin'
  })

  forwin.add(Arriety)
  forwin.add(LuL4)
  forwin.add(vContinuous)

  function findPlayer(name: string) {
    return (player: Player) => {
      return player.name === name 
    }
  }
  const firstPlayer = forwin.getPlayers()
    .find(findPlayer('Lu L4'))

  assert.deepEqual(
    matchObject(firstPlayer, LuL4),
    true
  )
}

// must be throw error if try add more 50 players to a guild
{
  // no-spread
  {
    const forwin = new Clan({
      name: 'ForWin 1'
    })

    assert.throws(() =>{
      for (let index = 1; index <= 51; index++)
        forwin.add({
          name: `Player ${index}`,
          power: 0,
          level: 0,
          classe: Util.randomClass()
        })
    })
  }
  // with spread
  {
    const forwin = new Clan({
      name: 'ForWin 1'
    })

    assert.throws(() =>{
      const clans = []
      for (let index = 1; index <= 80; index++)
        clans.push({
          name: `Player ${index}`,
          power: 0,
          level: 0,
          classe: Util.randomClass()
        })

      forwin.add(...clans)
    })

  }
}

// must be get all players from clans
{
  const SCOPE_MESSAGE = 'must be get all players from clans'
  const guild = new Guild()
  const startIndexClans = 0
  factories.clans(guild, 'ForWin', startIndexClans, 2, {
    factory: factories.players,
    startIndex: 1,
    amount: 2,
    suffix: 'Test'
  })

  const players = guild.getAllPlayersFromClans()

  try {
    assert.deepEqual(players.length, 6)
    chalk.green(SCOPE_MESSAGE) 
  } catch(e: any) {
    chalk.red(SCOPE_MESSAGE, e.message) 
  }
}

// must be realocaion players of clans
{
  const guild = new Guild()

  factories.clans(guild, 'ForWin', 0, 10, {
    factory: factories.players,
    suffix: 'Test',
    startIndex: 1,
    amount: 50
  })

  const vContinuous = new Player({
    name: 'vContinuous',
    power: 117031,
    level: 82,
    classe: new Taoist()
  })
  const LuL4 = new Player({
    name: 'Lu L4',
    power: 131025,
    level: 90,
    classe: new Arbalist()
  })
  const VioletEvergarden = new Player({
    name: 'Violet Evergarden',
    power: 1,
    level: 199,
    classe: new Taoist()
  })

  const clans = guild.getClans()
  const players = clans[clans.length - 1].getPlayers()
  players.pop()
  players.pop()
  players.pop()
  players.splice(players.length, 0, vContinuous)
  players.splice(players.length, 0, LuL4)
  players.splice(players.length, 0, VioletEvergarden)

  // priority power
  guild.relocation()

  const firstPlayer = guild.getClan('ForWin 0')?.getPlayers()[0]
  const secondPlayer = guild.getClan('ForWin 0')?.getPlayers()[1]

  assert.equal(firstPlayer?.name, 'Lu L4')
  assert.equal(secondPlayer?.name, 'vContinuous')
}

// remove player from clan by index
{
  const clan = new Clan({
    name: 'ForWin 0'
  })

  const PLAYERS_AMOUNT = 50 
  const startIndexPlayers = 1
  factories.players(clan, 'Test', startIndexPlayers, PLAYERS_AMOUNT)

  assert.equal(clan.getPlayers().length, PLAYERS_AMOUNT)

  clan.removePlayerByIndex(1)
  assert.equal(clan.getPlayers().length, 49)
}
