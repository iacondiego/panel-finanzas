'use client';

import { useState } from 'react';
import { useSheetData } from '@/features/sheets/hooks/useSheetData';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { MetricsCards } from '@/features/dashboard/components/MetricsCards';
import { EvolutionChart } from '@/features/dashboard/components/EvolutionChart';
import { CategoryChart } from '@/features/dashboard/components/CategoryChart';
import { TransactionsTable } from '@/features/dashboard/components/TransactionsTable';
import { MonthFilter } from '@/features/dashboard/components/MonthFilter';
import { AiInsights } from '@/features/dashboard/components/AiInsights';
import { ScenarioSimulator } from '@/features/dashboard/components/ScenarioSimulator';
import { AddTransactionForm } from '@/features/dashboard/components/AddTransactionForm';
import { RefreshCw, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export default function Home() {
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const { connectionStatus, refresh, isLoading } = useSheetData({
        enabled: true,
        refreshInterval: 5000,
    });

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Panel de Finanzas
                            </h1>
                            <p className="text-gray-400 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Dashboard profesional en tiempo real
                            </p>
                        </div>

                        {/* Connection Status */}
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                                'backdrop-blur-xl border transition-all duration-300',
                                connectionStatus.isConnected
                                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                            )}>
                                {connectionStatus.isConnected ? (
                                    <>
                                        <Wifi className="w-4 h-4" />
                                        Conectado
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-4 h-4" />
                                        Desconectado
                                    </>
                                )}
                            </div>

                            <button
                                onClick={refresh}
                                disabled={isLoading}
                                className={cn(
                                    'p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10',
                                    'hover:bg-white/10 transition-all duration-300',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    'group'
                                )}
                                title="Actualizar datos"
                            >
                                <RefreshCw className={cn(
                                    'w-5 h-5 text-white transition-transform duration-300',
                                    isLoading && 'animate-spin',
                                    'group-hover:rotate-180'
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Month Filter */}
                    <MonthFilter
                        selectedMonth={selectedMonth}
                        onMonthChange={setSelectedMonth}
                    />
                </motion.div>

                {/* Error Message */}
                {connectionStatus.error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-xl"
                    >
                        <p className="text-red-400 text-sm">
                            <strong>Error:</strong> {connectionStatus.error}
                        </p>
                        <p className="text-red-300 text-xs mt-1">
                            Verifica tu configuración de Google Sheets API en el archivo .env.local
                        </p>
                    </motion.div>
                )}

                {/* Loading State */}
                {isLoading && !connectionStatus.error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Cargando datos financieros...</p>
                        </div>
                    </motion.div>
                )}

                {/* Dashboard Content */}
                {!isLoading && (
                    <>
                        <MetricsCards selectedMonth={selectedMonth} />

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <EvolutionChart selectedMonth={selectedMonth} />
                            <CategoryChart selectedMonth={selectedMonth} />
                        </div>

                        <AiInsights />
                        <ScenarioSimulator />

                        <TransactionsTable selectedMonth={selectedMonth} />
                    </>
                )}

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-gray-500 text-sm py-8"
                >
                    <p>
                        Última actualización:{' '}
                        {connectionStatus.lastUpdate
                            ? new Date(connectionStatus.lastUpdate).toLocaleString('es-AR')
                            : 'Nunca'}
                    </p>
                    <p className="mt-2">
                        Datos sincronizados con Google Sheets en tiempo real
                    </p>
                </motion.footer>
            </div>

            {/* Add Transaction Form */}
            <AddTransactionForm onSuccess={refresh} />
        </main>
    );
}
