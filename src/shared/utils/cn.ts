import { type ClassValue, clsx } from 'clsx';

/**
 * Combina clases de Tailwind CSS de forma condicional
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
