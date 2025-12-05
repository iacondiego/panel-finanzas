'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { formatCurrency } from '@/shared/utils/formatters';
import { format } from 'date-fns';
import { TrendingUp, Zap, Target, BarChart3, AlertCircle } from 'lucide-react';

export function AiInsights() {
    const { transactions } = useSheetsStore();

    const stats = useMemo(() => {
        if (transactions.length === 0) return null;

        // 1. Mejor Mes (Beneficio)
        const monthsMap = new Map<string, number>();
        transactions.forEach(t => {
            const monthKey = format(t.fecha, 'MMMM yyyy');
            const current = monthsMap.get(monthKey) || 0;
            const amount = t.tipo === 'Ingreso' ? t.importe : -t.importe;
            monthsMap.set(monthKey, current + amount);
        });

        let bestMonth = '';
        let maxProfit = -Infinity;

        monthsMap.forEach((profit, month) => {
            if (profit > maxProfit) {
                maxProfit = profit;
                bestMonth = month;
            }
        });

        // 2. Categoría más rentable
        const categoryMap = new Map<string, number>();
        transactions
            .filter(t => t.tipo === 'Ingreso')
            .forEach(t => {
                const current = categoryMap.get(t.categoria) || 0;
                categoryMap.set(t.categoria, current + t.importe);
            });

        let bestCategory = '';
        let maxCategoryAmount = -Infinity;

        categoryMap.forEach((amount, category) => {
            if (amount > maxCategoryAmount) {
                maxCategoryAmount = amount;
                bestCategory = category;
            }
        });

        // 3. Canal Líder (Asumimos que es la misma que categoría por ahora o descripción si hubiera)
        // Para este ejemplo usaremos la categoría más rentable como "Canal"
        const topChannel = bestCategory || 'N/A';
        const topChannelAmount = maxCategoryAmount;

        // 4. Retorno (ROI)
        const totalIncome = transactions
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.importe, 0);

        const totalExpenses = transactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + t.importe, 0);

        const roi = totalExpenses > 0 ? ((totalIncome - totalExpenses) / totalExpenses) : 0;
        const roiFormatted = totalExpenses > 0 ? `${roi.toFixed(1)}x` : '∞';

        return {
            bestMonth,
            maxProfit,
            bestCategory,
            maxCategoryAmount,
            topChannel,
            topChannelAmount,
            roiFormatted
        };
    }, [transactions]);

    if (!stats) return null;

    const cards = [
        {
            title: 'MEJOR MES (BENEFICIO)',
            value: stats.bestMonth, // capitalize first letter logic needed if strictly Spanish locale desired
            subValue: formatCurrency(stats.maxProfit),
            icon: TrendingUp,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10',
            borderColor: 'border-emerald-400/20'
        },
        {
            title: 'CATEGORÍA MÁS RENTABLE',
            value: stats.bestCategory,
            subValue: formatCurrency(stats.maxCategoryAmount),
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20'
        },
        {
            title: 'CANAL LÍDER',
            value: stats.topChannel,
            subValue: formatCurrency(stats.topChannelAmount),
            icon: Zap,
            color: 'text-amber-400',
            bgColor: 'bg-amber-400/10',
            borderColor: 'border-amber-400/20'
        },
        {
            title: 'RETORNO (ROI)',
            value: stats.roiFormatted,
            subValue: 'Por cada $1 gastado',
            icon: BarChart3,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
            borderColor: 'border-purple-400/20'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Ai Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border backdrop-blur-xl ${card.borderColor} ${card.bgColor} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <card.icon className={`w-16 h-16 ${card.color}`} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {card.title}
                            </h3>
                            <p className="text-xl font-bold text-white mb-1 capitalize">
                                {card.value}
                            </p>
                            <p className={`text-sm font-medium ${card.color}`}>
                                {card.subValue}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
