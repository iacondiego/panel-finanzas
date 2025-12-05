import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || 'Hoja 1';
const DATA_RANGE = process.env.NEXT_PUBLIC_DATA_RANGE || 'A:F';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Sanitize private key: remove surrounding quotes and unescape newlines
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/^"|"$/g, '') // Remove quotes at start/end
    ?.replace(/\\n/g, '\n'); // Unescape newlines

export async function GET(request: NextRequest) {
    try {
        // Validar credenciales
        if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SPREADSHEET_ID) {
            console.error('Missing credentials for read operation:', {
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
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        // Configurar Google Sheets API
        const sheets = google.sheets({ version: 'v4', auth });

        // Leer datos de Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!${DATA_RANGE}`,
        });

        return NextResponse.json({
            values: response.data.values || [],
        });

    } catch (error) {
        console.error('Error reading transactions:', error);
        return NextResponse.json(
            { error: `Error al leer: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        );
    }
}
