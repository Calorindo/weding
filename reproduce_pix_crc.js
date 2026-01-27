const crc16 = (buffer) => {
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
};

const fullString = "00020126520014br.gov.bcb.pix0130gabrielcalorindo+btg@gmail.com5204000053039865406750.005802BR5913Noivo e Noiva6006Brasil62240520-Ojzx-MJrrWI6IgVYnqC6304E2DE";
const payloadWithoutCrc = fullString.substring(0, fullString.length - 4);
const expectedCrc = fullString.substring(fullString.length - 4);
const calculatedCrc = crc16(payloadWithoutCrc);

console.log(`Payload: ${payloadWithoutCrc}`);
console.log(`Expected CRC: ${expectedCrc}`);
console.log(`Calculated CRC: ${calculatedCrc}`);
console.log(`Match: ${expectedCrc === calculatedCrc}`);
