import React from 'react';
import { Gift, Banknote, Handshake } from 'lucide-react';

const GiftCard = ({ gift, onSelect }) => {
    return (
        <div className="group flex flex-col h-full bg-white transition-all duration-300 hover:-translate-y-1 items-center">
            <div className="w-full aspect-square sm:aspect-[4/5] bg-gray-50 relative overflow-hidden mb-3 sm:mb-4">
                {gift.imageUrl ? (
                    <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-300">
                        {gift.isCustom ? (
                            <Handshake className="w-12 h-12" strokeWidth={1} />
                        ) : (
                            <Gift className="w-12 h-12" strokeWidth={1} />
                        )}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </div>

            <div className="flex flex-col flex-grow items-center text-center space-y-2 sm:space-y-3 px-1 sm:px-2">
                <h3 className="font-heading text-xs sm:text-sm text-charcoal uppercase tracking-[0.1em] line-clamp-2 min-h-[2em] sm:min-h-[2.5em]">{gift.name}</h3>
                <p className="text-gray-500 font-sans font-light text-base sm:text-lg">
                    {gift.isCustom ? "Valor à escolha" : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.price)}
                </p>

                <button
                    onClick={() => onSelect(gift)}
                    className="mt-auto w-full py-2 sm:py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-[9px] sm:text-[10px] font-bold"
                >
                    Presentear
                </button>
            </div>
        </div>
    );
};

export default GiftCard;
