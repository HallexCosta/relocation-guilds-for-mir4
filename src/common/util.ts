import { randomUUID } from 'node:crypto'

import Taoist from '@classes/taoist'
import Arbalist from '@classes/arbalist'
import Warrior from '@classes/warrior'
import Lancer from '@classes/lancer'
import Sorcer from '@classes/sorcer'

import Guild from '@domains/guild'

export default class Util {
  static readonly classes = [
    Taoist,
    Arbalist,
    Warrior,
    Lancer,
    Sorcer
  ]

  static printPlayersFromClans(guild: Guild) {
    for (const clan of guild.getClans()) {
      console.log(`\nClan ${clan.name}`)

      const players = clan.getPlayers()

      for (const playerIndex in players) {
        const player = players[playerIndex]
        console.log(`Player ${player.name} level ${player.level} power ${player.power} classe ${player.classe}`)
      }

      console.log(`Total players: ${players.length}\n`)
    }
  }

  static randomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * max - min) + min
  }

  static randomUUID() {
    return randomUUID()
  }

  static randomClass() {
    const classIndex = Util.randomNumber(
      0,
      Util.classes.length - 1
    )
    const classInstance = new Util.classes[classIndex]
    return classInstance
  }
}