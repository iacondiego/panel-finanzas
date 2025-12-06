import { Transaction, TransactionType } from '../types';
import { parse } from 'date-fns';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || 'Hoja 1';
const DATA_RANGE = process.env.NEXT_PUBLIC_DATA_RANGE || 'A:F';

interface SheetRow {
    fecha: string;
    tipo: string;
    categoria: string;
    importe: string;
    estadoPago: string;
    descripcionAdicional?: string;
}


export class SheetsService {
    /**
     * Obtiene los datos de Google Sheets (a través del proxy API)
     */
    async fetchTransactions(): Promise<Transaction[]> {
        const url = '/api/sheets/read';

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error al obtener datos: ${response.statusText}`);
            }

            const data = await response.json();
            return this.transformData(data.values || []);
        } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
            throw error;
        }
    }

    /**
     * Transforma los datos raw de Google Sheets a objetos Transaction
     */
    private transformData(rows: string[][]): Transaction[] {
        if (rows.length === 0) return [];

        // Saltar la primera fila (headers)
        const dataRows = rows.slice(1);

        return dataRows
            .filter(row => row.length >= 5) // Asegurar que tenga los campos mínimos
            .map((row, index) => {
                const [fecha, tipo, categoria, importe, estadoPago, descripcionAdicional] = row;

                return {
                    id: `transaction-${index}`,
                    fecha: this.parseDate(fecha),
                    tipo: tipo as TransactionType,
                    categoria: categoria,
                    importe: this.parseNumber(importe),
                    estadoPago: this.parseBoolean(estadoPago),
                    descripcionAdicional: descripcionAdicional || undefined,
                };
            })
            .filter(transaction => !isNaN(transaction.importe)); // Filtrar transacciones inválidas
    }

    /**
     * Parsea una fecha en formato DD/MM/YYYY
     */
    private parseDate(dateStr: string): Date {
        try {
            // Intentar parsear formato DD/MM/YYYY
            const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }

            // Fallback: intentar parsear como ISO
            return new Date(dateStr);
        } catch {
            return new Date();
        }
    }

    /**
     * Parsea un número desde string
     */
    private parseNumber(numStr: string): number {
        if (!numStr) return 0;

        // Remover separadores de miles y reemplazar coma decimal por punto
        const cleaned = numStr.toString().replace(/\./g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
    }

    /**
     * Parsea el estado de pago desde el texto de Google Sheets
     * Retorna true si es "Pagado", false si es "Pendiente" u otro
     */
    private parseBoolean(value: string): boolean {
        if (!value) return false;

        const normalized = value.toString().toLowerCase().trim();
        return normalized === 'pagado' ||
            normalized === 'true' ||
            normalized === 'verdadero' ||
            normalized === '1' ||
            normalized === 'sí' ||
            normalized === 'si' ||
            normalized === 'yes';
    }
}

// Singleton instance
export const sheetsService = new SheetsService();
