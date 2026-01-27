const { validatePixCode, parsePixCode } = require('./utils/pix');

// Código PIX fornecido pelo usuário
const pixCode = '0020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com520400005303986540525.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzhy0pj6KxezV_46gY63047D4C';

console.log('=== TESTE DO CÓDIGO PIX FORNECIDO ===\n');
console.log('Código:', pixCode);
console.log('Tamanho:', pixCode.length, 'caracteres\n');

// Validar
const validation = validatePixCode(pixCode);
console.log('Validação:', validation);

// Parse detalhado
console.log('\n=== ANÁLISE DETALHADA ===');
const parsed = parsePixCode(pixCode);
console.log('Dados extraídos:', JSON.stringify(parsed, null, 2));

// Verificar se há caracteres especiais ou problemas de encoding
console.log('\n=== VERIFICAÇÃO DE CARACTERES ===');
for (let i = 0; i < pixCode.length; i++) {
    const char = pixCode[i];
    const code = char.charCodeAt(0);
    if (code > 127) {
        console.log(`Caractere não-ASCII encontrado na posição ${i}: '${char}' (código ${code})`);
    }
}

// Verificar estrutura básica
console.log('\n=== VERIFICAÇÃO DE ESTRUTURA ===');
if (!pixCode.startsWith('000201')) {
    console.log('❌ Não inicia com 000201 (Payload Format Indicator)');
} else {
    console.log('✅ Inicia corretamente com 000201');
}

if (!pixCode.includes('26') || !pixCode.includes('br.gov.bcb.pix')) {
    console.log('❌ Não contém informações de conta PIX válidas');
} else {
    console.log('✅ Contém informações de conta PIX');
}

if (!pixCode.includes('5802BR')) {
    console.log('❌ Não contém código do país (BR)');
} else {
    console.log('✅ Contém código do país');
}

// Verificar CRC manualmente
const payloadWithoutCrc = pixCode.slice(0, -4);
const crcFromCode = pixCode.slice(-4);
console.log('\nPayload sem CRC:', payloadWithoutCrc);
console.log('CRC do código:', crcFromCode);

// Calcular CRC esperado
function crc16(buffer) {
    let crc = 0xFFFF;
    for (let i = 0; i < buffer.length; i++) {
        crc ^= (buffer.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = (crc << 1);
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

const expectedCrc = crc16(payloadWithoutCrc);
console.log('CRC esperado:', expectedCrc);
console.log('CRC válido:', crcFromCode === expectedCrc ? '✅' : '❌');