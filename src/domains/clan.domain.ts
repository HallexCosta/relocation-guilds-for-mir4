import Player from '@domains/player'

export type ClanProps = {
  name: string
}

export interface ClanMethods {
  add(...players: Player[]): void
  getPlayers(): Player[]
  removePlayerByIndex(playerIndex: number): void
  clearPlayers(): void
}

export default class Clan implements ClanMethods {
  public readonly name: string
  private readonly players: Player[] = []

  public constructor(clanProps: ClanProps) {
    Object.assign(this, clanProps)
  }

  public clearPlayers(): void {
    while (this.players.length)
      this.players.pop()
  }
  public getPlayers(): Player[] {
    return this.players
  }
  public add(...players: Player[]) {
    // throw error if players params have a length
    // greater than that 50
    // or there are already 50 players stored.
    if (
      players.length > 50
      || this.players.length === 50
    ) throw new Error('Ops... limit reached 50 players')
   
    // add players
    this.players.push(...players)
    // sort players
    // this.sort(this.players)
  }
  public removePlayerByIndex(playerIndex: number) {
    // copy array without reference of object
    const players = this.players.slice()
    // clear all players from clan
    this.clearPlayers()
    // loop old players from clan
    for (const currentPlayerIndex in players) {
      // don't add player with playerIndex
      if (Number(currentPlayerIndex) !== playerIndex)
        this.add(players[playerIndex])
    }
  }
  private sort(players: Player[]): Player[] {
    return players.sort(
      (player1, player2) => 
        player1.power >= player2.power
          ? -1
          : player2.power >= player1.power
            ? 1
            : 0
    )
  }
}
