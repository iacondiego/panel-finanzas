// Tipos para las transacciones según la estructura de Google Sheets
export type TransactionType = 'Gasto' | 'Ingreso';

export type Category =
    | 'Publicidad'
    | 'Agente'
    | 'Software'
    | 'Servicios'
    | string; // Permite categorías personalizadas

export interface Transaction {
    id: string;
    fecha: Date;
    tipo: TransactionType;
    categoria: Category;
    importe: number;
    estadoPago: boolean;
    descripcionAdicional?: string;
}

// Tipos para métricas calculadas
export interface FinancialMetrics {
    balance: number;
    totalIngresos: number;
    totalGastos: number;
    pendientes: number;
    transaccionesCount: number;
}

// Distribución por categoría
export interface CategoryDistribution {
    categoria: Category;
    total: number;
    porcentaje: number;
    color: string;
}

// Evolución temporal
export interface EvolutionData {
    fecha: string;
    ingresos: number;
    gastos: number;
    balance: number;
}

// Estado de la conexión
export interface ConnectionStatus {
    isConnected: boolean;
    lastUpdate: Date | null;
    error: string | null;
}
