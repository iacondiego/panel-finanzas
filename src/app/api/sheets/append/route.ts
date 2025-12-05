import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || 'Hoja 1';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

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

        // Configurar Google Sheets API
        const sheets = google.sheets({ version: 'v4', auth: API_KEY });

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
