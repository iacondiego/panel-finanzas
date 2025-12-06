'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { cn } from '@/shared/utils/cn';
import { TransactionType, Category } from '@/features/sheets/types';

interface AddTransactionFormProps {
    onSuccess?: () => void;
}

export function AddTransactionForm({ onSuccess }: AddTransactionFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Gasto' as TransactionType,
        categoria: '',
        importe: '',
        estadoPago: false,
        descripcionAdicional: '',
    });

    const categorias: Category[] = [
        'Agentes de IA',
        'Publicidad',
        'Software',
        'Servidores',
        'Hobbie',
        'Mentoria',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Formatear fecha a DD/MM/YYYY
            const [year, month, day] = formData.fecha.split('-');
            const fechaFormateada = `${day}/${month}/${year}`;

            const response = await fetch('/api/sheets/append', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fecha: fechaFormateada,
                    tipo: formData.tipo,
                    categoria: formData.categoria,
                    importe: parseFloat(formData.importe),
                    estadoPago: formData.estadoPago ? 'Pagado' : 'Pendiente',
                    descripcionAdicional: formData.descripcionAdicional,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al agregar la transacción');
            }

            // Éxito
            setSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
                setFormData({
                    fecha: new Date().toISOString().split('T')[0],
                    tipo: 'Gasto',
                    categoria: '',
                    importe: '',
                    estadoPago: false,
                    descripcionAdicional: '',
                });
                onSuccess?.();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-8 right-8 z-50',
                    'w-16 h-16 rounded-full',
                    'bg-gradient-to-r from-blue-500 to-purple-500',
                    'shadow-2xl shadow-blue-500/50',
                    'flex items-center justify-center',
                    'text-white font-bold',
                    'hover:shadow-blue-500/70 transition-shadow'
                )}
                title="Agregar transacción"
            >
                <Plus className="w-8 h-8" />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal Content */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-md"
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Nueva Transacción</CardTitle>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        {success ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-center py-8"
                                            >
                                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg
                                                        className="w-8 h-8 text-emerald-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-white font-semibold mb-2">
                                                    ¡Transacción agregada!
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Los datos se actualizarán en breve
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {/* Tipo */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Tipo
                                                    </label>
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, tipo: 'Ingreso' })}
                                                            className={cn(
                                                                'flex-1 py-2 px-4 rounded-lg border transition-all',
                                                                formData.tipo === 'Ingreso'
                                                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                            )}
                                                        >
                                                            Ingreso
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, tipo: 'Gasto' })}
                                                            className={cn(
                                                                'flex-1 py-2 px-4 rounded-lg border transition-all',
                                                                formData.tipo === 'Gasto'
                                                                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                            )}
                                                        >
                                                            Gasto
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Fecha */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Fecha
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.fecha}
                                                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        required
                                                    />
                                                </div>

                                                {/* Categoría */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Categoría
                                                    </label>
                                                    <select
                                                        value={formData.categoria}
                                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        required
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        {categorias.map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Importe */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Importe
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.importe}
                                                        onChange={(e) => setFormData({ ...formData, importe: e.target.value })}
                                                        placeholder="0"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        required
                                                    />
                                                </div>

                                                {/* Estado de pago */}
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="estadoPago"
                                                        checked={formData.estadoPago}
                                                        onChange={(e) => setFormData({ ...formData, estadoPago: e.target.checked })}
                                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                                                    />
                                                    <label htmlFor="estadoPago" className="text-sm text-gray-300">
                                                        Marcar como pagado
                                                    </label>
                                                </div>

                                                {/* Descripción */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Descripción (opcional)
                                                    </label>
                                                    <textarea
                                                        value={formData.descripcionAdicional}
                                                        onChange={(e) => setFormData({ ...formData, descripcionAdicional: e.target.value })}
                                                        placeholder="Detalles adicionales..."
                                                        rows={3}
                                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                                    />
                                                </div>

                                                {/* Error */}
                                                {error && (
                                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                        <p className="text-red-400 text-sm">{error}</p>
                                                    </div>
                                                )}

                                                {/* Botones */}
                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className={cn(
                                                            'flex-1 px-4 py-2 rounded-lg font-medium transition-all',
                                                            'bg-gradient-to-r from-blue-500 to-purple-500',
                                                            'text-white shadow-lg shadow-blue-500/30',
                                                            'hover:shadow-blue-500/50',
                                                            'disabled:opacity-50 disabled:cursor-not-allowed',
                                                            'flex items-center justify-center gap-2'
                                                        )}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Guardando...
                                                            </>
                                                        ) : (
                                                            'Agregar'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
