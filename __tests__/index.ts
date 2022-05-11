import assert from 'assert/strict'

import factories from './factories'

import Util from '@tests/util'

import Taoist from '@classes/taoist'
import Arbalist from '@classes/arbalist'

import Player from '@domains/player'
import Clan from '@domains/clan'
import Guild from '@domains/guild'

import {it} from '../test-runner/runner'

// must be added the player in order of highest power

it('must be added', () => {
  assert.deepEqual(12, 1)
  const player1 = new Player({
    name: 'vContinuous',
    power: 117031,
    level: 82,
    class: new Taoist()
  })
  const player2 = new Player({
    name: 'Lu L4',
    power: 131025,
    level: 90,
    class: new Arbalist()
  })
  const player3 = new Player({
    name: 'Arriety ツ',
    power: 42000,
    level: 48,
    class: new Arbalist()
  })

  const clan = new Clan({
    name: 'ForWin'
  })

  clan.add(player3)
  clan.add(player2)
  clan.add(player1)

  function findPlayer(name: string) {
    return (player: Player) => {
      return player.name === name 
    }
  }
  const firstPlayer = clan.getPlayers()
    .find(findPlayer('Lu L4'))

  assert.deepEqual(
    Util.matchObject(firstPlayer, player2),
    true
  )
})

 
it('must be throw error if try add more 50 players to a clan (no-spread)', () => {
  const clan = new Clan({
    name: 'ForWin 1'
  })

  assert.throws(() =>{
    for (let index = 1; index <= 51; index++)
      clan.add({
        name: `Player ${index}`,
        power: 0,
        level: 0,
        class: Util.randomInstanceClass()
      })
  })
})
  
it('must be throw error if try add more 50 players to a clan (with spread)', () => {
  const clan = new Clan({
    name: 'ForWin 1'
  })

  assert.throws(() =>{
    const players = []
    for (let index = 1; index <= 80; index++)
      players.push(new Player({
        name: `Player ${index}`,
        power: 0,
        level: 0,
        class: Util.randomInstanceClass()
      }))

    clan.add(...players)
  })
}) 

it('must be get all players from clans', () => {
  const guild = new Guild()
  const startIndexClans = 1
  const amountAddClans = 2
  factories.clans(guild, 'ForWin', startIndexClans, amountAddClans, {
    factory: factories.players,
    startIndex: 1,
    amount: 2,
    suffix: 'Test'
  })

  const players = guild.getAllPlayersFromClans()

  assert.equal(players.length, 4)
})

it('must be relocation players of clans', () => {
  const guild = new Guild()

  const startIndexClans = 0
  const amountAddClans = 10
  factories.clans(guild, 'ForWin', startIndexClans, amountAddClans, {
    factory: factories.players,
    suffix: 'Test',
    startIndex: 1,
    amount: 50
  })

  const player1 = new Player({
    name: 'vContinuous',
    power: 117031,
    level: 82,
    class: new Taoist()
  })
  const player2 = new Player({
    name: 'Lu L4',
    power: 131025,
    level: 90,
    class: new Arbalist()
  })
  const player3 = new Player({
    name: 'Violet Evergarden',
    power: 1,
    level: 199,
    class: new Taoist()
  })

  const clans = guild.getClans()
  const players = clans[clans.length - 1].getPlayers()

  // remove last players from structure
  players.pop()
  players.pop()
  players.pop()

  // push players in last position from array
  players.splice(players.length, 0, player1)
  players.splice(players.length, 0, player2)
  players.splice(players.length, 0, player3)

  // priority power
  guild.relocation()

  const firstPlayer = guild.getClan('ForWin 0')?.getPlayers()[0]
  const secondPlayer = guild.getClan('ForWin 0')?.getPlayers()[1]

  assert.equal(firstPlayer?.name, 'Lu L4')
  assert.equal(secondPlayer?.name, 'vContinuous')
})


it('remove player from clan by index', () => {
  const clan = new Clan({
    name: 'ForWin 0'
  })

  const amountPlayers = 50 
  const startIndexPlayers = 1
  factories.players(clan, 'Test', startIndexPlayers, amountPlayers)

  assert.equal(clan.getPlayers().length, amountPlayers)

  clan.removePlayerByIndex(1)
  assert.equal(clan.getPlayers().length, 49)
})

