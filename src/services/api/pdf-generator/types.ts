import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { generatePdf } from './actions'

export type Customer = ReturnTypeWithoutPromise<typeof generatePdf>