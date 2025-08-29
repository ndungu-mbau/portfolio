import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const zip = <T, U>(arr1: T[], arr2: U[]) =>
  Array.from(
    { length: Math.min(arr1.length, arr2.length) },
    (_, i) => [arr1[i], arr2[i]] as [T, U]
  )
