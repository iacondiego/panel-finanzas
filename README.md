# Panel de Finanzas - Configuración

Este proyecto es un panel de finanzas profesional conectado en tiempo real a Google Sheets.

## 🚀 Configuración Rápida

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Google Sheets API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Crea credenciales (API Key)
5. Copia tu API Key

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_SPREADSHEET_ID=tu_spreadsheet_id_aqui
NEXT_PUBLIC_SHEET_NAME=Hoja 1
NEXT_PUBLIC_DATA_RANGE=A:F
```

**¿Cómo obtener el SPREADSHEET_ID?**

De la URL de tu Google Sheet:
```
https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_SPREADSHEET_ID]/edit
```

### 4. Hacer tu Google Sheet Público

1. Abre tu Google Sheet
2. Click en "Compartir" (esquina superior derecha)
3. Click en "Cambiar a cualquier persona con el enlace"
4. Asegúrate que el permiso sea "Lector"

### 5. Iniciar el Servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Estructura de la Hoja de Cálculo

Tu Google Sheet debe tener las siguientes columnas (en orden):

| A - Fecha | B - Tipo | C - Categoria | D - Importe | E - Estado pago | F - Descripcion adicional |
|-----------|----------|---------------|-------------|-----------------|---------------------------|
| 05/12/2025 | Gasto | Publicidad | 250000 | FALSE | Campaña Meta |
| 05/12/2025 | Ingreso | Agente | 700000 | TRUE | Comisión venta |

### Formatos Esperados:

- **Fecha**: DD/MM/YYYY
- **Tipo**: "Gasto" o "Ingreso"
- **Categoria**: Texto libre (ej: "Publicidad", "Software", etc.)
- **Importe**: Número (sin símbolos de moneda)
- **Estado pago**: TRUE/FALSE o checkbox de Google Sheets
- **Descripcion adicional**: Texto opcional

## 🎨 Características

- ✅ Conexión en tiempo real con Google Sheets (actualización cada 5 segundos)
- ✅ Dashboard con métricas clave (Balance, Ingresos, Gastos, Pendientes)
- ✅ Gráfico de evolución financiera
- ✅ Gráfico de distribución por categorías
- ✅ Tabla de transacciones con filtros y búsqueda
- ✅ Diseño premium con glassmorphism
- ✅ Animaciones suaves con Framer Motion
- ✅ Responsive (mobile, tablet, desktop)

## 🛠️ Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run typecheck    # Verificar tipos TypeScript
```

## 🔧 Troubleshooting

### Error: "Google Sheets API error"

- Verifica que tu API Key sea correcta
- Asegúrate que la Google Sheets API esté habilitada en tu proyecto
- Verifica que el SPREADSHEET_ID sea correcto

### No se muestran datos

- Verifica que tu Google Sheet sea público (o compartido con "cualquiera con el enlace")
- Revisa que los nombres de las columnas coincidan
- Abre la consola del navegador para ver errores específicos

### Los datos no se actualizan

- El dashboard se actualiza automáticamente cada 5 segundos
- Puedes forzar una actualización con el botón de refresh
- Verifica tu conexión a internet

## 📝 Personalización

### Cambiar el intervalo de actualización

En `src/app/page.tsx`, modifica el valor de `refreshInterval`:

```typescript
const { connectionStatus, refresh, isLoading } = useSheetData({
  enabled: true,
  refreshInterval: 10000, // 10 segundos
});
```

### Cambiar colores de categorías

En `src/features/sheets/store/sheets-store.ts`, modifica el objeto `CATEGORY_COLORS`:

```typescript
const CATEGORY_COLORS: Record<string, string> = {
  'Publicidad': '#3b82f6',
  'TuCategoria': '#tu-color-hex',
};
```

## 📄 Licencia

MIT
