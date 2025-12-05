'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/shared/components/ui/Card';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { formatCurrency } from '@/shared/utils/formatters';
import { TrendingUp, Activity, Calculator } from 'lucide-react';

export function ScenarioSimulator() {
    const { transactions } = useSheetsStore();

    const [incomeGrowth, setIncomeGrowth] = useState<number>(0);
    const [expenseAdjustment, setExpenseAdjustment] = useState<number>(0);
    const [projection, setProjection] = useState<number>(0);
    const [baseProfit, setBaseProfit] = useState<number>(0);

    useEffect(() => {
        // Calcular escenario base (mes actual o promedio, usaremos total acumulado por simplicidad visual)
        // Idealmente sería el promedio mensual, pero para "Jugar" usaremos los totales actuales
        const totalIncome = transactions
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + t.importe, 0);

        const totalExpenses = transactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + t.importe, 0);

        const currentProfit = totalIncome - totalExpenses;
        setBaseProfit(currentProfit);

        // Calcular proyección
        const projectedIncome = totalIncome * (1 + incomeGrowth / 100);
        const projectedExpenses = totalExpenses * (1 + expenseAdjustment / 100); // Adjustment positivo aumenta gastos

        setProjection(projectedIncome - projectedExpenses);

    }, [transactions, incomeGrowth, expenseAdjustment]);

    if (transactions.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <Activity className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Simulador de Escenarios</h2>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl border border-white/10 bg-[#0f172a]/50 backdrop-blur-xl">
                    {/* Controles */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-gray-400 text-sm mb-4">Ajusta las variables para proyectar tu futuro financiero.</p>

                            <div className="space-y-6">
                                {/* Slider Ingresos */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Crecimiento de Ingresos</label>
                                        <span className="text-sm font-bold text-emerald-400">+{incomeGrowth}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={incomeGrowth}
                                        onChange={(e) => setIncomeGrowth(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <p className="text-xs text-gray-500 text-right">Proyectar aumento de ventas</p>
                                </div>

                                {/* Slider Gastos */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Ajuste de Gastos</label>
                                        <span className={`text-sm font-bold ${expenseAdjustment > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {expenseAdjustment > 0 ? '+' : ''}{expenseAdjustment}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-50"
                                        max="50"
                                        value={expenseAdjustment}
                                        onChange={(e) => setExpenseAdjustment(Number(e.target.value))}
                                        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${expenseAdjustment > 0 ? 'accent-red-500' : 'accent-emerald-500'}`}
                                    />
                                    <p className="text-xs text-gray-500 text-right">Simular ahorro o inversión</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display Resultado */}
                    <div className="flex flex-col justify-center items-center bg-[#020617]/50 rounded-xl border border-white/5 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Calculator className="w-32 h-32 text-white" />
                        </div>

                        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2 z-10">
                            Beneficio Proyectado
                        </p>

                        <motion.p
                            key={projection}
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-4xl md:text-5xl font-bold z-10 ${projection >= baseProfit ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                            {formatCurrency(projection)}
                        </motion.p>

                        <div className="mt-4 flex gap-8 z-10">
                            <div className="text-center">
                                <span className="block w-2 h-8 bg-gray-600/30 rounded-full mx-auto mb-2 relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-gray-500 h-1/2"></div>
                                </span>
                                <p className="text-xs text-gray-500">Base</p>
                            </div>
                            <div className="text-center">
                                <span className={`block w-2 h-8 rounded-full mx-auto mb-2 relative overflow-hidden ${projection >= baseProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    <div className={`absolute bottom-0 w-full h-full ${projection >= baseProfit ? 'bg-emerald-500' : 'bg-red-500'} transition-all`} style={{ height: `${Math.min(100, (projection / baseProfit) * 50)}%` }}></div>
                                </span>
                                <p className="text-xs text-gray-400">Proyección</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
