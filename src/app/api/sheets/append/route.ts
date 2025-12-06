import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || 'Hoja 1';
// Helper to sanitize private key
const formatPrivateKey = (key: string | undefined) => {
    if (!key) return undefined;

    // 1. If it's a JSON string (starts/ends with quotes), try parsing it
    if (key.startsWith('"') && key.endsWith('"')) {
        try {
            return JSON.parse(key);
        } catch (e) {
            // If parse fails, fall back to manual replacement
        }
    }

    // 2. Manual cleanup: remove surrounding quotes and spaces, unescape newlines
    return key
        .replace(/^["']+|["']+$/g, '') // Remove specific quotes
        .trim()
        .replace(/\\n/g, '\n');
};

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fecha, tipo, categoria, importe, estadoPago, descripcionAdicional } = body;

        // Validar datos
        if (!fecha || !tipo || !categoria || importe === undefined) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        // Validar credenciales
        if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SPREADSHEET_ID) {
            console.error('Missing credentials:', {
                hasEmail: !!SERVICE_ACCOUNT_EMAIL,
                hasKey: !!PRIVATE_KEY,
                hasSpreadsheetId: !!SPREADSHEET_ID,
            });
            return NextResponse.json(
                { error: 'Configuración de Google Sheets incompleta' },
                { status: 500 }
            );
        }

        // Configurar autenticación con Service Account
        const auth = new google.auth.JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Configurar Google Sheets API
        const sheets = google.sheets({ version: 'v4', auth });

        // Preparar fila para agregar
        const values = [
            [
                fecha,
                tipo,
                categoria,
                importe.toString(),
                estadoPago ? 'TRUE' : 'FALSE',
                descripcionAdicional || '',
            ],
        ];

        // Agregar fila a Google Sheets
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:F`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return NextResponse.json({
            success: true,
            updatedRange: response.data.updates?.updatedRange,
        });
    } catch (error) {
        console.error('Error adding transaction:', error);
        return NextResponse.json(
            { error: 'Error al agregar la transacción' },
            { status: 500 }
        );
    }
}
