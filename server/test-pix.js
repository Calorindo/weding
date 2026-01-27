const { validatePixCode, parsePixCode, generatePixPayload } = require('./utils/pix');

// Seu código PIX
const pixCode = '00020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com520400005303986540525.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzhy0pj6KxezV_46gY63047D4C';

console.log('=== ANÁLISE DO CÓDIGO PIX ===\n');

// Validar o código
const validation = validatePixCode(pixCode);
console.log('Validação:', validation);

if (!validation.valid) {
    console.log('\n=== CORRIGINDO O CÓDIGO ===\n');
    
    // Parse do código para extrair informações
    const parsed = parsePixCode(pixCode);
    console.log('Dados extraídos:', parsed);
    
    // Gerar código correto
    const correctedCode = generatePixPayload(
        'gabrielcalorindo+btg@gmail.com',
        'Noivo e Noiva',
        'Brasil',
        25.00,
        '-Ojzhy0pj6KxezV_46gY'
    );
    
    console.log('\nCódigo PIX corrigido:');
    console.log(correctedCode);
    
    // Validar o código corrigido
    const correctedValidation = validatePixCode(correctedCode);
    console.log('\nValidação do código corrigido:', correctedValidation);
} else {
    console.log('Código PIX está válido!');
}