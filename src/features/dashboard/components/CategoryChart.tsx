'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { formatCurrency, formatPercentage } from '@/shared/utils/formatters';
import { format } from 'date-fns';

interface CategoryChartProps {
    selectedMonth?: string | null;
}

export function CategoryChart({ selectedMonth }: CategoryChartProps) {
    const { transactions } = useSheetsStore();

    const chartData = useMemo(() => {
        const filteredTransactions = selectedMonth
            ? transactions.filter(t => format(t.fecha, 'yyyy-MM') === selectedMonth)
            : transactions;

        const categoryMap = new Map<string, number>();

        filteredTransactions.forEach(transaction => {
            const current = categoryMap.get(transaction.categoria) || 0;
            categoryMap.set(transaction.categoria, current + Math.abs(transaction.importe));
        });

        const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

        const CATEGORY_COLORS: Record<string, string> = {
            'Publicidad': '#3b82f6',
            'Agente': '#8b5cf6',
            'Software': '#10b981',
            'Servicios': '#f59e0b',
        };

        return Array.from(categoryMap.entries())
            .map(([categoria, amount]) => ({
                name: categoria,
                value: amount,
                percentage: total > 0 ? (amount / total) * 100 : 0,
                color: CATEGORY_COLORS[categoria] || '#6b7280',
            }))
            .sort((a, b) => b.value - a.value);
    }, [transactions, selectedMonth]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-1">{data.name}</p>
                    <p className="text-gray-300 text-sm">{formatCurrency(data.value)}</p>
                    <p className="text-gray-400 text-xs">{formatPercentage(data.percentage)}</p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-wrap gap-3 justify-center mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-300">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-500">No hay datos disponibles</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
