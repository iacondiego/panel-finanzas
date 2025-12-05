import { useEffect, useRef } from 'react';
import { sheetsService } from '../services/sheets-service';
import { useSheetsStore } from '../store/sheets-store';

interface UseSheetDataOptions {
    enabled?: boolean;
    refreshInterval?: number; // en milisegundos
}

/**
 * Hook para obtener datos de Google Sheets en tiempo real
 * Usa polling para simular actualizaciones en tiempo real
 */
export function useSheetData(options: UseSheetDataOptions = {}) {
    const { enabled = true, refreshInterval = 5000 } = options; // 5 segundos por defecto

    const { setTransactions, setConnectionStatus, transactions, metrics, connectionStatus } = useSheetsStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async () => {
        try {
            setConnectionStatus({ error: null });
            const data = await sheetsService.fetchTransactions();

            setTransactions(data);
            setConnectionStatus({
                isConnected: true,
                lastUpdate: new Date(),
                error: null,
            });
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            setConnectionStatus({
                isConnected: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    useEffect(() => {
        if (!enabled) return;

        // Fetch inicial
        fetchData();

        // Setup polling para actualizaciones en tiempo real
        intervalRef.current = setInterval(fetchData, refreshInterval);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, refreshInterval]);

    // Función para forzar refresh manual
    const refresh = () => {
        fetchData();
    };

    return {
        transactions,
        metrics,
        connectionStatus,
        refresh,
        isLoading: transactions.length === 0 && !connectionStatus.error,
    };
}
