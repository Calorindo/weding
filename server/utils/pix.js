function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

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

function generatePixPayload(key, name, city, amount, txId = '***') {
    // 00 - Payload Format Indicator
    let payload = formatField('00', '01');

    // 26 - Merchant Account Information
    // 00 - GUI (BR.GOV.BCB.PIX)
    // 01 - Chave Pix
    const merchantInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', key);
    payload += formatField('26', merchantInfo);

    // 52 - Merchant Category Code (0000 - undefined or general)
    payload += formatField('52', '0000');

    // 53 - Transaction Currency (986 - BRL)
    payload += formatField('53', '986');

    // 54 - Transaction Amount (Optional in static, but we use dynamic behavior here roughly)
    if (amount) {
        payload += formatField('54', amount.toFixed(2));
    }

    // 58 - Country Code
    payload += formatField('58', 'BR');

    // 59 - Merchant Name
    payload += formatField('59', name);

    // 60 - Merchant City
    payload += formatField('60', city);

    // 62 - Additional Data Field Template
    // 05 - Reference Label (TxID)
    const additionalData = formatField('05', txId);
    payload += formatField('62', additionalData);

    // 63 - CRC16
    payload += '6304'; // ID + Length

    const crc = crc16(payload);
    payload += crc;

    return payload;
}

module.exports = { generatePixPayload };
