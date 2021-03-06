import Util from '@common/util'

import Player from '@domains/player'
import Clan from '@domains/clan'
import Guild from '@domains/guild'

type FactoryIterator = {
  factory: Function
  suffix: string
  startIndex: number
  amount: number
}

export default {
  players(
    clan: Clan,
    suffix: string,
    startIndex: number = 0,
    amount: number = 0
  ): void {
    const players = []

    for (let index = startIndex; index <= amount; index++) {
      players.push(new Player({
        name: `${suffix}${index}`,
        power: 0,
        level: 0,
        class: Util.randomInstanceClass()
      }))
    }

    clan.add(...players)
  },
  clans(
    guild: Guild,
    suffix: string,
    startIndex: number = 0,
    amount: number = 1,
    ...iterators: FactoryIterator[]) {
    const clans = []

    for (let index = startIndex; index <= amount; index++) {
      const clan = new Clan({
        name: `${suffix} ${index}`
      })

      iterators.map(
        (iterator, index) =>
          iterator
          .factory(
            clan,
            `${iterator.suffix} ${index}`,
            iterator.startIndex,
            iterator.amount
          )
      )

      clans.push(clan)
    }

    guild.add(...clans)
  }
}
