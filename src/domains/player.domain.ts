import BaseClass from '@classes/base'

export interface PlayerMethods {}

export type PlayerProps = {
  name: string
  power: number
  level: number
  class: BaseClass
}

export default class Player implements PlayerMethods {
  public readonly name: string
  public readonly power: number
  public readonly level: number
  public readonly class: BaseClass

  public constructor(player: PlayerProps) {
    Object.assign(this, player)
  }
}

