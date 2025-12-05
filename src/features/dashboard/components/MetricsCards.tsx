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
    success: {
        bg: 'from-emerald-500/20 to-green-500/20',
        border: 'border-emerald-500/30',
        icon: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
    },
    danger: {
        bg: 'from-red-500/20 to-rose-500/20',
        border: 'border-red-500/30',
        icon: 'text-red-400',
        glow: 'shadow-red-500/20',
    },
    warning: {
        bg: 'from-amber-500/20 to-yellow-500/20',
        border: 'border-amber-500/30',
        icon: 'text-amber-400',
        glow: 'shadow-amber-500/20',
    },
    info: {
        bg: 'from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
        glow: 'shadow-blue-500/20',
    },
};

function MetricCard({ title, value, icon, trend, variant, delay = 0 }: MetricCardProps) {
    const styles = variantStyles[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className={cn(
                'relative overflow-hidden group hover:scale-105 transition-transform duration-300',
                styles.border,
                styles.glow,
                'shadow-2xl'
            )}>
                <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-50',
                    styles.bg
                )} />

                <CardContent className="relative">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                            <motion.p
                                className="text-3xl font-bold text-white mb-2"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: delay + 0.2 }}
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
                            'p-3 rounded-xl bg-white/5 backdrop-blur-sm',
                            'group-hover:scale-110 transition-transform duration-300',
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
                variant={metrics.balance >= 0 ? 'success' : 'danger'}
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
