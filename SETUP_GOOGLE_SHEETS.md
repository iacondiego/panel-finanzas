# Configuración de Google Sheets API

Esta guía te ayudará a configurar la autenticación con Google Sheets para poder escribir datos desde la aplicación.

## Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

## Paso 2: Habilitar Google Sheets API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Sheets API"
3. Haz clic en **Enable** (Habilitar)

## Paso 3: Crear una Service Account

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **Service Account**
3. Completa los datos:
   - **Service account name**: `panel-finanzas-service`
   - **Service account ID**: se generará automáticamente
   - **Description**: `Service account para escribir en Google Sheets`
4. Haz clic en **Create and Continue**
5. En "Grant this service account access to project", puedes dejarlo vacío
6. Haz clic en **Done**

## Paso 4: Crear y Descargar las Credenciales

1. En la lista de Service Accounts, haz clic en la que acabas de crear
2. Ve a la pestaña **Keys**
3. Haz clic en **Add Key** > **Create new key**
4. Selecciona **JSON** como tipo de clave
5. Haz clic en **Create**
6. Se descargará un archivo JSON con las credenciales
7. **IMPORTANTE**: Guarda este archivo en un lugar seguro, lo necesitarás en el siguiente paso

## Paso 5: Compartir tu Google Sheet con la Service Account

1. Abre el archivo JSON que descargaste
2. Busca el campo `client_email`, se verá algo así:
   ```
   panel-finanzas-service@tu-proyecto.iam.gserviceaccount.com
   ```
3. Copia ese email completo
4. Abre tu Google Sheet de finanzas
5. Haz clic en **Compartir** (botón verde en la esquina superior derecha)
6. Pega el email de la Service Account
7. Asegúrate de darle permisos de **Editor**
8. Haz clic en **Enviar**

## Paso 6: Configurar Variables de Entorno

1. Abre el archivo JSON de credenciales que descargaste
2. Crea un archivo llamado `.env.local` en la raíz del proyecto
3. Copia y pega lo siguiente, reemplazando con tus valores:

```env
# Email de la Service Account (campo "client_email" del JSON)
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com

# Private Key de la Service Account (campo "private_key" del JSON)
# IMPORTANTE: Copia TODO el contenido incluyendo -----BEGIN PRIVATE KEY----- y -----END PRIVATE KEY-----
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

# ID de tu Google Sheet (lo puedes encontrar en la URL)
NEXT_PUBLIC_SPREADSHEET_ID=tu-spreadsheet-id

# Nombre de la hoja (por defecto "Hoja 1")
NEXT_PUBLIC_SHEET_NAME=Hoja 1
```

### Cómo obtener el SPREADSHEET_ID:

La URL de tu Google Sheet se ve así:
```
https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit
                                      ^^^^^^^^^^^^^^
                                      Este es tu SPREADSHEET_ID
```

### Nota sobre GOOGLE_PRIVATE_KEY:

- Debe estar entre comillas dobles
- Debe incluir los `\n` (saltos de línea literales, no reales)
- Si el JSON tiene saltos de línea reales, reemplázalos por `\n`

## Paso 7: Reiniciar el Servidor de Desarrollo

Después de crear el archivo `.env.local`:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia:
npm run dev
```

## Paso 8: Probar la Funcionalidad

1. Abre la aplicación en tu navegador
2. Haz clic en el botón flotante "+" para agregar una transacción
3. Completa el formulario y haz clic en "Agregar"
4. Verifica que aparezca el mensaje de éxito
5. Abre tu Google Sheet y confirma que se agregó la nueva fila

## Solución de Problemas

### Error: "Error al agregar la transacción"

- Verifica que el email de la Service Account tenga permisos de Editor en el Google Sheet
- Asegúrate de que las variables de entorno estén correctamente configuradas
- Revisa que el GOOGLE_PRIVATE_KEY esté completo y bien formateado

### Error: "Invalid credentials"

- Verifica que copiaste correctamente el `client_email` y `private_key` del JSON
- Asegúrate de que el `private_key` incluya los `\n` y las líneas BEGIN/END

### El servidor no lee las variables de entorno

- Asegúrate de que el archivo se llame exactamente `.env.local`
- Reinicia completamente el servidor de desarrollo
- Verifica que el archivo esté en la raíz del proyecto (mismo nivel que `package.json`)

## Seguridad

⚠️ **IMPORTANTE**: 
- **NUNCA** subas el archivo `.env.local` a Git
- **NUNCA** subas el archivo JSON de credenciales a Git
- El archivo `.env.local` ya está incluido en `.gitignore` por defecto en Next.js
- Si despliegas en Vercel, configura las variables de entorno en el dashboard de Vercel
