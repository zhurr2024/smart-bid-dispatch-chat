import { userHandlers } from './userHandlers'
import { bidHandlers } from './bidHandlers'
import { opportunityHandlers } from './opportunityHandlers'
import { reportHandlers } from './reportHandlers'

export const handlers = [
  ...userHandlers,
  ...bidHandlers,
  ...opportunityHandlers,
  ...reportHandlers,
]
