import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getUserCustomers } from './actions'

export type Customer = ReturnTypeWithoutPromise<typeof getUserCustomers>[0]