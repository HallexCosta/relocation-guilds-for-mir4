import BaseClass from '@classes/base'

import Arbalist from '@classes/arbalist'
import Lancer from '@classes/lancer'
import Sorcer from '@classes/sorcer'
import Taoist from '@classes/taoist'
import Warrior from '@classes/warrior'

export default class Util {
  static readonly classes = [
    Taoist,
    Arbalist,
    Warrior,
    Lancer,
    Sorcer
  ]

  static randomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * max - min) + min
  }
  static randomInstanceClass(): BaseClass {
    const classIndex = Util.randomNumber(
      0,
      Util.classes.length - 1
    )
    const instanceClass = new (Util.classes[classIndex])
    return instanceClass
  }

  static matchObject(obj1: any, obj2: any): boolean {
    const valuesMatching: boolean[] = []

    for (const key in obj1) {
      valuesMatching.push(key in obj2)
      valuesMatching.push(obj1[key] === obj2[key])
    }

    const isFail = valuesMatching.find(v => v === false)
    const isMatched = isFail === false ? false : true

    return isMatched
  }
}

