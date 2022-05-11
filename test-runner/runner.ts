import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'

import chalk from 'chalk'
import Util from '@common/util'

enum EMOJI {
  heavyCheckMark = '✔ ',
  crossMark = '❌'
}

type TestResult = {
  id: string
  name: string
  success: boolean
  action: Function
  errorMessage?: string
}

interface TestRunner {
  registerEvents(): void
  runTests(): void
  subscribe(id: string, name: string, callback: () => void): void
  handleErrors(error: Error): void
  dispatchLogs(): void
}

class Runner implements TestRunner {
  static readonly instance: TestRunner
  public readonly events: EventEmitter
  public testResults: TestResult[] = []
  public currentTestId: string

  public constructor() {
    this.events = new EventEmitter()
  }
  public static runnerInstance(): TestRunner {
    return Runner.instance || new Runner()
  }
  public registerEvents(): void {
    this.events.on('subscribe', this.subscribe.bind(this))
    this.events.on('update-status', this.update.bind(this))
    this.events.on('dispatch', this.dispatch.bind(this))
  }
  public runTests() {
    try {
      for (const testResult of this.testResults) {
        this.currentTestId = testResult.id
        testResult.action()
      }
    } catch(error: any) {
      this.handleErrors(error)
    }
  }

  public dispatchLogs() {
    this.events.emit('dispatch')
  }
  public handleErrors(error: Error) {
    const testResultError = this.testResults.find(testResult => testResult.id === this.currentTestId)
    const errorMessage = `${error.name}: ${error.message}`
    const success = false
    this.events.emit('update-status', {
      ...testResultError,
      success,
      errorMessage
    })
  }
  public subscribe(id: string, name: string, callback: Function) {
    const testResult = {
      id,
      name,
      success: true,
      action: callback
    }
    this.testResults.push(testResult)
  }
  private update(currentTestResult: TestResult): void {
    const testResults = this.testResults.slice()

    Util.clearAnArray(this.testResults)

    this.testResults = testResults.map(testResult => testResult.id === currentTestResult.id ? currentTestResult : testResult)
  }
  private dispatch(): void {
    for (const { name, success, errorMessage } of this.testResults) {
      const emojiColor = success ? 'green' : 'red'
      const nameColor = success ? 'white' : 'gray'
      const paintText = chalk[emojiColor]
      const emoji = success ? paintText(EMOJI.heavyCheckMark) : paintText(EMOJI.crossMark)
      const message = `${emoji} ${name}`

      const showMessage = console.log.bind(
        null,
        chalk[nameColor].call(message)
      )
      showMessage(message)

      if (!success)
        showMessage(paintText(errorMessage))
    }
  }
}

const runner = Runner.runnerInstance()
runner.registerEvents()

function testScopeMain(runner: TestRunner) {
  return (name: string, callback: () => void) => {
    const id = randomUUID()
    runner.subscribe(
      id,
      name,
      callback
    )
  }
}

export const it = testScopeMain(runner)

process.on('unhandledRejection', runner.handleErrors.bind(runner))
process.on('uncaughtException', runner.handleErrors.bind(runner))
process.on('exit', () => {
  runner.runTests()
  runner.dispatchLogs.call(runner)
})
