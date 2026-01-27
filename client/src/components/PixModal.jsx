import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';

const PixModal = ({ isOpen, onClose, payload, giftName }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-pastel-text">Pagamento Pix</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                        Para presentear com <span className="font-bold text-pastel-darkGreen">{giftName}</span>
                    </p>

                    <div className="flex justify-center p-3 sm:p-4 bg-pastel-lightGreen rounded-xl">
                        <QRCodeSVG value={payload} size={window.innerWidth < 640 ? 160 : 200} level="M" />
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500">
                        Escaneie o QR Code com o aplicativo do seu banco
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-2 bg-white text-gray-500">Ou copie e cole</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-xl border border-pastel-green hover:bg-pastel-lightGreen text-pastel-text transition-all duration-200 text-sm sm:text-base"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                <span>Copiado!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Copiar Código Pix</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PixModal;
