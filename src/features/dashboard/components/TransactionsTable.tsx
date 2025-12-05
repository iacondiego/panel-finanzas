'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { useSheetsStore } from '@/features/sheets/store/sheets-store';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { Transaction, TransactionType } from '@/features/sheets/types';
import { cn } from '@/shared/utils/cn';
import { format } from 'date-fns';

type SortField = 'fecha' | 'importe' | 'categoria';
type SortDirection = 'asc' | 'desc';

interface TransactionsTableProps {
    selectedMonth?: string | null;
}

export function TransactionsTable({ selectedMonth }: TransactionsTableProps) {
    const { transactions } = useSheetsStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
    const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'pending'>('all');
    const [sortField, setSortField] = useState<SortField>('fecha');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAndSorted = useMemo(() => {
        let result = selectedMonth
            ? transactions.filter(t => format(t.fecha, 'yyyy-MM') === selectedMonth)
            : [...transactions];

        if (searchTerm) {
            result = result.filter(t =>
                t.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.descripcionAdicional?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            result = result.filter(t => t.tipo === filterType);
        }

        if (filterPaid === 'paid') {
            result = result.filter(t => t.estadoPago);
        } else if (filterPaid === 'pending') {
            result = result.filter(t => !t.estadoPago);
        }

        result.sort((a, b) => {
            let aVal: any = a[sortField];
            let bVal: any = b[sortField];

            if (sortField === 'fecha') {
                aVal = a.fecha.getTime();
                bVal = b.fecha.getTime();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    }, [transactions, selectedMonth, searchTerm, filterType, filterPaid, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
    const paginatedTransactions = filteredAndSorted.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle>Transacciones</CardTitle>

                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="all">Todos</option>
                                <option value="Ingreso">Ingresos</option>
                                <option value="Gasto">Gastos</option>
                            </select>

                            <select
                                value={filterPaid}
                                onChange={(e) => setFilterPaid(e.target.value as any)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="all">Todos</option>
                                <option value="paid">Pagados</option>
                                <option value="pending">Pendientes</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th
                                        className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('fecha')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Fecha
                                            <ArrowUpDown className="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                        Tipo
                                    </th>
                                    <th
                                        className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('categoria')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Categoría
                                            <ArrowUpDown className="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th
                                        className="text-right py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort('importe')}
                                    >
                                        <div className="flex items-center justify-end gap-2">
                                            Importe
                                            <ArrowUpDown className="w-4 h-4" />
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">
                                        Estado
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                        Descripción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTransactions.map((transaction, index) => (
                                    <motion.tr
                                        key={transaction.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-300">
                                            {formatDate(transaction.fecha)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={transaction.tipo === 'Ingreso' ? 'success' : 'danger'}>
                                                {transaction.tipo}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-300">
                                            {transaction.categoria}
                                        </td>
                                        <td className={cn(
                                            'py-3 px-4 text-sm font-medium text-right',
                                            transaction.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-red-400'
                                        )}>
                                            {transaction.tipo === 'Ingreso' ? '+' : '-'}
                                            {formatCurrency(transaction.importe)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge variant={transaction.estadoPago ? 'success' : 'warning'}>
                                                {transaction.estadoPago ? 'Pagado' : 'Pendiente'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-400">
                                            {transaction.descripcionAdicional || '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                                {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} de{' '}
                                {filteredAndSorted.length} transacciones
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={cn(
                                                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                currentPage === page
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                            )}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
