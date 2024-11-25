import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getSettings } from './actions'

export type Setting = ReturnTypeWithoutPromise<typeof getSettings>