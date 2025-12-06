'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/utils/formatters';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { cn } from '@/shared/utils/cn';
import { format } from 'date-fns';

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    variant: 'success' | 'danger' | 'warning' | 'info';
    delay?: number;
}

const variantStyles = {
    first: { // Balance - Electric Blue
        bg: 'from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30',
        border: 'border-blue-500/50',
        icon: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    },
    success: { // Ingresos - Vivid Green
        bg: 'from-emerald-600/20 to-green-500/20 hover:from-emerald-600/30 hover:to-green-500/30',
        border: 'border-emerald-500/50',
        icon: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    },
    danger: { // Gastos - Vivid Red/Pink
        bg: 'from-red-600/20 to-rose-500/20 hover:from-red-600/30 hover:to-rose-500/30',
        border: 'border-red-500/50',
        icon: 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
    },
    warning: { // Pendientes - Vivid Orange/Amber
        bg: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30',
        border: 'border-amber-500/50',
        icon: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]',
    },
    info: { // Fallback / Others
        bg: 'from-violet-600/20 to-purple-500/20',
        border: 'border-violet-500/50',
        icon: 'text-violet-400',
        glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    },
};

function MetricCard({ title, value, icon, trend, variant, delay = 0 }: MetricCardProps) {
    // Cast strict keys to allowing string indexing if needed, or update interface
    // @ts-ignore
    const styles = variantStyles[variant] || variantStyles.info;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className={cn(
                'relative overflow-hidden group hover:-translate-y-1 transition-all duration-300',
                styles.border,
                styles.glow,
                'border bg-gray-900/40 backdrop-blur-xl'
            )}>
                <div className={cn(
                    'absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
                    styles.bg
                )} />

                <CardContent className="relative p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-300 mb-1 tracking-wide uppercase opacity-80">{title}</p>
                            <motion.p
                                key={value} // Re-animate on value change
                                className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md"
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {formatCurrency(value)}
                            </motion.p>

                            {trend !== undefined && trend !== 0 && (
                                <div className="flex items-center gap-1">
                                    {trend > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                    )}
                                    <span className={cn(
                                        'text-sm font-medium',
                                        trend > 0 ? 'text-emerald-400' : 'text-red-400'
                                    )}>
                                        {Math.abs(trend).toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className={cn(
                            'p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10',
                            'group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300',
                            'shadow-lg',
                            styles.icon
                        )}>
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface MetricsCardsProps {
    selectedMonth?: string | null;
}

export function MetricsCards({ selectedMonth }: MetricsCardsProps) {
    const { transactions } = useSheetsStore();

    const metrics = useMemo(() => {
        const filteredTransactions = selectedMonth
            ? transactions.filter(t => format(t.fecha, 'yyyy-MM') === selectedMonth)
            : transactions;

        const totalIngresos = filteredTransactions
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.importe, 0);

        const totalGastos = filteredTransactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + t.importe, 0);

        const pendientes = filteredTransactions
            .filter(t => !t.estadoPago)
            .reduce((sum, t) => sum + t.importe, 0);

        const balance = totalIngresos - totalGastos;

        return {
            balance,
            totalIngresos,
            totalGastos,
            pendientes,
        };
    }, [transactions, selectedMonth]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                title="Balance Total"
                value={metrics.balance}
                icon={<Wallet className="w-6 h-6" />}
                // @ts-ignore
                variant="first"
                delay={0}
            />

            <MetricCard
                title="Ingresos"
                value={metrics.totalIngresos}
                icon={<TrendingUp className="w-6 h-6" />}
                variant="success"
                delay={0.1}
            />

            <MetricCard
                title="Gastos"
                value={metrics.totalGastos}
                icon={<TrendingDown className="w-6 h-6" />}
                variant="danger"
                delay={0.2}
            />

            <MetricCard
                title="Pendientes"
                value={metrics.pendientes}
                icon={<Clock className="w-6 h-6" />}
                variant="warning"
                delay={0.3}
            />
        </div>
    );
}
