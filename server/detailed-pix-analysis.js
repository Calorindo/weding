const { validatePixCode, parsePixCode, generatePixPayload } = require('./utils/pix');

const pixCode = '00020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com520400005303986540525.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzhy0pj6KxezV_46gY63047D4C';

console.log('=== ANÁLISE DETALHADA DO CÓDIGO PIX ===\n');

// Parse detalhado
const parsed = parsePixCode(pixCode);
console.log('Dados extraídos:');
console.log('- Formato do payload:', parsed.payloadFormat);
console.log('- Conta do comerciante:', parsed.merchantAccount);
console.log('- Categoria do comerciante:', parsed.merchantCategory);
console.log('- Moeda:', parsed.currency);
console.log('- Valor:', parsed.amount);
console.log('- País:', parsed.country);
console.log('- Nome do comerciante:', parsed.merchantName);
console.log('- Cidade do comerciante:', parsed.merchantCity);
console.log('- Dados adicionais:', parsed.additionalData);
console.log('- CRC:', parsed.crc);

console.log('\n=== POSSÍVEIS PROBLEMAS ===\n');

// Verificar problemas comuns
const issues = [];

if (parsed.merchantName && parsed.merchantName.length > 25) {
    issues.push(`Nome muito longo (${parsed.merchantName.length} chars, máximo 25)`);
}

if (parsed.merchantCity && parsed.merchantCity.length > 15) {
    issues.push(`Cidade muito longa (${parsed.merchantCity.length} chars, máximo 15)`);
}

if (parsed.amount && parsed.amount < 0.01) {
    issues.push('Valor muito baixo (mínimo R$ 0,01)');
}

if (parsed.amount && parsed.amount > 999999.99) {
    issues.push('Valor muito alto (máximo R$ 999.999,99)');
}

if (issues.length > 0) {
    console.log('Problemas encontrados:');
    issues.forEach(issue => console.log('- ' + issue));
} else {
    console.log('Nenhum problema óbvio encontrado.');
}

console.log('\n=== CÓDIGO PIX ALTERNATIVO (MAIS COMPATÍVEL) ===\n');

// Gerar versão mais compatível
const alternativeCode = generatePixPayload(
    'gabrielcalorindo+btg@gmail.com',
    'Gabriel e Noiva', // Nome mais curto
    'Brasil',
    25.00,
    'CASAMENTO2024' // TxID mais simples
);

console.log('Código alternativo:');
console.log(alternativeCode);

const altValidation = validatePixCode(alternativeCode);
console.log('\nValidação do código alternativo:', altValidation);