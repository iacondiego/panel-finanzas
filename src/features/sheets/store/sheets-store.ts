import { create } from 'zustand';
import { Transaction, FinancialMetrics, CategoryDistribution, ConnectionStatus } from '../types';

interface SheetsStore {
    // Data
    transactions: Transaction[];
    metrics: FinancialMetrics;
    categoryDistribution: CategoryDistribution[];
    connectionStatus: ConnectionStatus;

    // Actions
    setTransactions: (transactions: Transaction[]) => void;
    setConnectionStatus: (status: Partial<ConnectionStatus>) => void;
    calculateMetrics: () => void;
    calculateCategoryDistribution: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Publicidad': '#3b82f6',
    'Agente': '#8b5cf6',
    'Software': '#10b981',
    'Servicios': '#f59e0b',
};

export const useSheetsStore = create<SheetsStore>((set, get) => ({
    // Initial state
    transactions: [],
    metrics: {
        balance: 0,
        totalIngresos: 0,
        totalGastos: 0,
        pendientes: 0,
        transaccionesCount: 0,
    },
    categoryDistribution: [],
    connectionStatus: {
        isConnected: false,
        lastUpdate: null,
        error: null,
    },

    // Set transactions and recalculate everything
    setTransactions: (transactions) => {
        set({ transactions });
        get().calculateMetrics();
        get().calculateCategoryDistribution();
    },

    // Update connection status
    setConnectionStatus: (status) => {
        set((state) => ({
            connectionStatus: {
                ...state.connectionStatus,
                ...status,
            },
        }));
    },

    // Calculate financial metrics
    calculateMetrics: () => {
        const { transactions } = get();

        const totalIngresos = transactions
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.importe, 0);

        const totalGastos = transactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + t.importe, 0);

        const pendientes = transactions
            .filter(t => !t.estadoPago)
            .reduce((sum, t) => sum + t.importe, 0);

        const balance = totalIngresos - totalGastos;

        set({
            metrics: {
                balance,
                totalIngresos,
                totalGastos,
                pendientes,
                transaccionesCount: transactions.length,
            },
        });
    },

    // Calculate category distribution
    calculateCategoryDistribution: () => {
        const { transactions } = get();

        // Agrupar por categoría
        const categoryMap = new Map<string, number>();

        transactions.forEach(transaction => {
            const current = categoryMap.get(transaction.categoria) || 0;
            categoryMap.set(transaction.categoria, current + Math.abs(transaction.importe));
        });

        // Calcular total para porcentajes
        const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

        // Convertir a array con porcentajes
        const distribution: CategoryDistribution[] = Array.from(categoryMap.entries())
            .map(([categoria, amount]) => ({
                categoria,
                total: amount,
                porcentaje: total > 0 ? (amount / total) * 100 : 0,
                color: CATEGORY_COLORS[categoria] || '#6b7280',
            }))
            .sort((a, b) => b.total - a.total);

        set({ categoryDistribution: distribution });
    },
}));
