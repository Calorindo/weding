import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

const CartModal = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
    if (!isOpen) return null;

    const total = items.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-end z-50 transition-opacity">
            <div className={`bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-charcoal" />
                        <h2 className="text-xl font-heading text-charcoal uppercase tracking-[0.2em]">Seu Carrinho</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-charcoal transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 space-y-3">
                            <ShoppingBag className="w-12 h-12 opacity-20" strokeWidth={1} />
                            <p className="font-light tracking-widest uppercase text-xs">Seu carrinho está vazio</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex gap-4 items-start group">
                                <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag className="w-8 h-8 opacity-50" strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between h-20 py-1">
                                    <div>
                                        <h3 className="text-xs font-heading text-charcoal uppercase tracking-wider line-clamp-2">{item.name}</h3>
                                        <p className="text-gray-500 font-sans text-sm mt-1">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveItem(index)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
                        <div className="flex justify-between items-center text-charcoal">
                            <span className="font-heading uppercase tracking-widest text-sm">Total</span>
                            <span className="font-sans text-xl font-light">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                            </span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full py-4 bg-charcoal text-black hover:bg-gray-100 transition-colors uppercase tracking-[0.2em] text-xs font-bold border border-gray-300"
                        >
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
