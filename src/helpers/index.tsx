import { ValidationResults } from 'types'

export const noop = (v: any) => v
export const alwaysValid = (k: string): ValidationResults => true
export const sanitizeKey = (k: string) => k.replace('.', '-')
