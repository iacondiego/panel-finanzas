'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { formatCurrency } from '@/shared/utils/formatters';
import { format } from 'date-fns';

interface EvolutionChartProps {
    selectedMonth?: string | null;
}

export function EvolutionChart({ selectedMonth }: EvolutionChartProps) {
    const { transactions } = useSheetsStore();

    const chartData = useMemo(() => {
        const filteredTransactions = selectedMonth
            ? transactions.filter(t => format(t.fecha, 'yyyy-MM') === selectedMonth)
            : transactions;

        const dateMap = new Map<string, { ingresos: number; gastos: number }>();

        filteredTransactions.forEach(transaction => {
            const dateKey = format(transaction.fecha, 'dd/MM/yyyy');
            const current = dateMap.get(dateKey) || { ingresos: 0, gastos: 0 };

            if (transaction.tipo === 'Ingreso') {
                current.ingresos += transaction.importe;
            } else {
                current.gastos += transaction.importe;
            }

            dateMap.set(dateKey, current);
        });

        const data = Array.from(dateMap.entries())
            .map(([fecha, values]) => ({
                fecha,
                ingresos: values.ingresos,
                gastos: values.gastos,
                balance: values.ingresos - values.gastos,
            }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.fecha.split('/').map(Number);
                const [dayB, monthB, yearB] = b.fecha.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });

        return data;
    }, [transactions, selectedMonth]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-xl">
                    <p className="text-white font-semibold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-sm" style={{ color: entry.color }}>
                                {entry.name}:
                            </span>
                            <span className="text-sm font-medium text-white">
                                {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Evolución Financiera</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
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
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Evolución Financiera</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
                            <XAxis
                                dataKey="fecha"
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `$${value / 1000}K`}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }} />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />
                            <Bar
                                dataKey="ingresos"
                                name="Ingresos"
                                fill="#17C964"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                            <Bar
                                dataKey="gastos"
                                name="Gastos"
                                fill="#F31260"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
