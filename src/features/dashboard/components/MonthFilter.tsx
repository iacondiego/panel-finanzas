'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MonthFilterProps {
    selectedMonth: string | null;
    onMonthChange: (month: string | null) => void;
}

export function MonthFilter({ selectedMonth, onMonthChange }: MonthFilterProps) {
    const { transactions } = useSheetsStore();

    // Obtener lista de meses disponibles
    const availableMonths = useMemo(() => {
        const monthsSet = new Set<string>();

        transactions.forEach(transaction => {
            const monthKey = format(transaction.fecha, 'yyyy-MM');
            monthsSet.add(monthKey);
        });

        const months = Array.from(monthsSet).sort().reverse();

        return months.map(monthKey => {
            const [year, month] = monthKey.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, 1);

            return {
                key: monthKey,
                label: format(date, 'MMMM yyyy', { locale: es }),
                labelShort: format(date, 'MMM yyyy', { locale: es }),
            };
        });
    }, [transactions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
        >
            <Calendar className="w-5 h-5 text-gray-400" />

            <select
                value={selectedMonth || 'all'}
                onChange={(e) => onMonthChange(e.target.value === 'all' ? null : e.target.value)}
                className={cn(
                    'px-4 py-2 bg-white/5 border border-white/10 rounded-lg',
                    'text-sm text-white font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                    'hover:bg-white/10 transition-colors',
                    'min-w-[180px]'
                )}
            >
                <option value="all">Todos los meses</option>
                {availableMonths.map((month) => (
                    <option key={month.key} value={month.key}>
                        {month.label}
                    </option>
                ))}
            </select>

            {selectedMonth && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => onMonthChange(null)}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                >
                    Limpiar
                </motion.button>
            )}
        </motion.div>
    );
}
