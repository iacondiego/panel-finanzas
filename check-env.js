const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Diagnóstico de Variables de Entorno');
console.log('-----------------------------------');
console.log(`Buscando archivo en: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('✅ El archivo .env.local EXISTE');

    // Intentar leer contenido raw (sin imprimir secretos)
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(`📄 Tamaño del archivo: ${content.length} bytes`);

    // Parsear
    const config = dotenv.parse(content);

    console.log('\nVerificando variables esperadas:');

    const checkVar = (name) => {
        const value = config[name];
        if (!value) {
            console.log(`❌ ${name}: NO ENCONTRADA o VACÍA`);
        } else {
            console.log(`✅ ${name}: ENCONTRADA (Longitud: ${value.length})`);
            if (name === 'GOOGLE_PRIVATE_KEY') {
                if (value.includes('BEGIN PRIVATE KEY') && value.includes('END PRIVATE KEY')) {
                    console.log('   ✅ Formato de clave privada parece correcto');
                } else {
                    console.log('   ⚠️ WARNING: La clave privada no parece tener el formato correcto (falta BEGIN/END)');
                }
            }
        }
    };

    checkVar('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    checkVar('GOOGLE_PRIVATE_KEY');
    checkVar('NEXT_PUBLIC_SPREADSHEET_ID');

} else {
    console.log('❌ El archivo .env.local NO EXISTE');
}
