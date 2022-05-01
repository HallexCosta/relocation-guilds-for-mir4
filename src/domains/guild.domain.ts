import Player, { PlayerMethods } from '@domains/player'
import Clan, { ClanMethods } from '@domains/clan'

export type GuildProps = {
  clans: ClanMethods[]
}

export interface GuildMethods {
  add(...clans: ClanMethods[]): void
  clearClans(): void
  clearPlayersFromClans(excludes?: string[]): void
  getClan(clanName: string): ClanMethods
  getClans(): ClanMethods[]
  getAllPlayersFromClans(): PlayerMethods[]
  relocation(
    power: boolean,
    level: boolean
  ): void
}

export default class Guild implements GuildMethods {
  private readonly clans: Clan[] = []

  public getClan(clanName: string): ClanMethods {
    const clan = this.clans
      .find(({ name }) => name === clanName)

    if (!clan)
      throw new Error('Clan not found')

    return clan
  }
  public getClans(): Clan[] {
    return this.clans
  }
  public add(...clans: Clan[]) {
    this.clans.push(...clans)
  }
  public getAllPlayersFromClans(): Player[] {
    return this.clans
      .map(clan => clan.getPlayers())
      .flat(1)
  }
  public clearPlayersFromClans(excludes?: string[]): void {
    for (const clan of this.clans) {
      if (!excludes?.includes(clan.name))
        clan.clearPlayers()
    }
  }
  public clearClans(): void {
    while(this.clans.length)
      this.clans.pop()
  }
  public relocation(
    power: boolean = true,
    level: boolean = true
  ): void {
    const players = this.getAllPlayersFromClans()

    if (level) 
      players.sort(
        (a, b) => a.level >= b.level
          ? -1
          : a.level < b.level
          ? 1
          : 0
      )

    if (power)
      players.sort(
        (a, b) => a.power >= b.power
          ? -1
          : a.power < b.power
          ? 1
          : 0
      )

    const totalClans = players.length / 50

    this.clearPlayersFromClans()

    for (let clanIndex = 0; clanIndex <= totalClans; clanIndex++) { 
      const relocatedPlayers = players.splice(
        0,
        50
      )
      this.getClan(`ForWin ${clanIndex}`)
        .add(...relocatedPlayers)
    }
  }
}

