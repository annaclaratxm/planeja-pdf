import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getBudgetDetails } from './actions'

export type BudgetDetail = ReturnTypeWithoutPromise<typeof getBudgetDetails>