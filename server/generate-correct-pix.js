const { generatePixPayload, validatePixCode } = require('./utils/pix');

console.log('=== GERANDO CÓDIGO PIX CORRETO ===\n');

// Gerar código PIX correto com os mesmos dados
const correctPixCode = generatePixPayload(
    'gabrielcalorindo+btg@gmail.com',  // Chave PIX
    'Noivo e Noiva',                   // Nome
    'Brasil',                          // Cidade
    25.00,                             // Valor
    '-Ojzhy0pj6KxezV_46gY'            // ID da transação
);

console.log('Código PIX CORRETO:');
console.log(correctPixCode);
console.log('\nTamanho:', correctPixCode.length, 'caracteres');

// Validar o código correto
const validation = validatePixCode(correctPixCode);
console.log('\nValidação:', validation);

console.log('\n=== COMPARAÇÃO ===');
console.log('Código original (INVÁLIDO):');
console.log('0020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com520400005303986540525.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzhy0pj6KxezV_46gY63047D4C');
console.log('\nCódigo corrigido (VÁLIDO):');
console.log(correctPixCode);

console.log('\n=== DIFERENÇAS ===');
const original = '0020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com520400005303986540525.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzhy0pj6KxezV_46gY63047D4C';
console.log('1. Início do código:');
console.log('   Original: ' + original.substring(0, 10));
console.log('   Correto:  ' + correctPixCode.substring(0, 10));
console.log('2. CRC (últimos 4 dígitos):');
console.log('   Original: ' + original.slice(-4));
console.log('   Correto:  ' + correctPixCode.slice(-4));