import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Search, Banknote, ShoppingBag } from 'lucide-react';
import GiftCard from '../components/GiftCard';
import PixModal from '../components/PixModal';
import CartModal from '../components/CartModal';
import Countdown from '../components/Countdown';

import About from '../components/About';
import Ceremony from '../components/Ceremony';
import { db } from '../lib/firebase';
import { ref, onValue } from "firebase/database";
import photo1 from '../assets/photo1.jpg'; // Center/Main
import photo2 from '../assets/photo2.jpg'; // Side 1
import photo3 from '../assets/photo3.jpg'; // Side 2

const Home = () => {
    const [gifts, setGifts] = useState([]);
    const [selectedGift, setSelectedGift] = useState(null);
    const [pixData, setPixData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('price-asc');
    const [searchTerm, setSearchTerm] = useState('');

    // Cart State
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Custom Cash Gift State
    const [showCashModal, setShowCashModal] = useState(false);
    const [cashAmount, setCashAmount] = useState('');

    const fetchGifts = React.useCallback(() => {
        const giftsRef = ref(db, 'gifts');
        const unsubscribe = onValue(giftsRef, (snapshot) => {
            if (snapshot.exists()) {
                const giftsData = snapshot.val();
                const giftList = Object.entries(giftsData).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setGifts(giftList);
            } else {
                setGifts([]);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = fetchGifts();
        return () => unsubscribe();
    }, [fetchGifts]);

    // Função para gerar PIX offline usando a mesma lógica do servidor
    const generateOfflinePixPayload = (gift, amount = null) => {
        const pixKey = "gabrielcalorindo+btg@gmail.com";

        // Remove accents and special characters from merchant info
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const merchantName = normalizeStr("Noivo e Noiva");
        const merchantCity = normalizeStr("Brasil");
        const finalAmount = amount || gift.price;

        // Sanitize TxID: uppercase, remove accents, keep only alphanumeric, limit to 25 chars
        let rawTxId = gift.id || "PRESENTEPX";
        const txId = normalizeStr(rawTxId)
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 25) || "PRESENTEPX";

        // Implementação simplificada do PIX payload
        const formatField = (id, value) => {
            const len = value.length.toString().padStart(2, '0');
            return `${id}${len}${value}`;
        };

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

        let payload = formatField('00', '01');
        const merchantInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', pixKey);
        payload += formatField('26', merchantInfo);
        payload += formatField('52', '0000');
        payload += formatField('53', '986');
        payload += formatField('54', finalAmount.toFixed(2));
        payload += formatField('58', 'BR');
        payload += formatField('59', merchantName);
        payload += formatField('60', merchantCity);
        const additionalData = formatField('05', txId);
        payload += formatField('62', additionalData);
        payload += '6304';
        const crc = crc16(payload);
        payload += crc;

        return payload;
    };



    const addToCart = (gift) => {
        setCart([...cart, gift]);
        setIsCartOpen(true);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleCartCheckout = async () => {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        const compositeGift = {
            id: 'CART' + Date.now().toString(36).toUpperCase(),
            name: `Lista de Casamento (${cart.length} itens)`,
            price: total
        };

        // Detecta se está em produção (GitHub Pages)
        const isProduction = window.location.hostname !== 'localhost';

        if (isProduction) {
            // Modo offline - gera PIX diretamente no frontend
            const payload = generateOfflinePixPayload(compositeGift);
            setSelectedGift(compositeGift);
            setPixData(payload);
            setIsCartOpen(false);
            return;
        }

        // Modo desenvolvimento - tenta usar o servidor local
        try {
            const response = await fetch('http://localhost:3000/api/pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: total,
                    message: `Lista de Casamento (${cart.length} itens)`,
                    txid: compositeGift.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedGift(compositeGift);
                setPixData(data.payload);
                setIsCartOpen(false);
            } else {
                // Fallback para modo offline
                const payload = generateOfflinePixPayload(compositeGift);
                setSelectedGift(compositeGift);
                setPixData(payload);
                setIsCartOpen(false);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            // Fallback para modo offline
            const payload = generateOfflinePixPayload(compositeGift);
            setSelectedGift(compositeGift);
            setPixData(payload);
            setIsCartOpen(false);
        }
    };


    const handleCashGift = async (e) => {
        e.preventDefault();
        if (!cashAmount || parseFloat(cashAmount) <= 0) return;

        const amount = parseFloat(cashAmount);
        const isProduction = window.location.hostname !== 'localhost';

        if (isProduction) {
            // Modo offline - gera PIX diretamente no frontend
            const payload = generateOfflinePixPayload({ name: 'Presente em Dinheiro', id: 'CASH' }, amount);
            setSelectedGift({ name: `Presente em Dinheiro` });
            setPixData(payload);
            setShowCashModal(false);
            return;
        }

        // Modo desenvolvimento - tenta usar o servidor local
        try {
            const response = await fetch('http://localhost:3000/api/pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    message: `Presente em dinheiro - R$ ${cashAmount}`
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedGift({ name: `Presente em Dinheiro` });
                setPixData(data.payload);
                setShowCashModal(false);
            } else {
                // Fallback para modo offline
                const payload = generateOfflinePixPayload({ name: 'Presente em Dinheiro', id: 'CASH' }, amount);
                setSelectedGift({ name: `Presente em Dinheiro` });
                setPixData(payload);
                setShowCashModal(false);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            // Fallback para modo offline
            const payload = generateOfflinePixPayload({ name: 'Presente em Dinheiro', id: 'CASH' }, amount);
            setSelectedGift({ name: `Presente em Dinheiro` });
            setPixData(payload);
            setShowCashModal(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedGift(null);
        setPixData(null);
        setShowCashModal(false);
        setCashAmount('');
    };

    const filteredAndSortedGifts = [...gifts]
        .filter(gift =>
            gift.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return 0;
        });

    return (
        <div className="min-h-screen bg-pastel-bg pb-20">
            {/* Hero Section */}
            <div className="flex flex-col items-center pt-20 sm:pt-24 pb-16 px-4 text-center bg-white">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-light text-charcoal uppercase tracking-[0.15em] mb-4">
                    Gabriel + Emanuely
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-sans font-bold tracking-[0.2em] text-gray-500 mb-8 sm:mb-12 uppercase">
                    18.04.2026 • Sítio da Figueira
                </p>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 w-full max-w-7xl px-2 sm:px-4 mb-12 sm:mb-16">
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo1} alt="Gabriel and Emanuely 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo2} alt="Gabriel and Emanuely Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo3} alt="Gabriel and Emanuely 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>

                {/* Quote Section */}
                <div className="max-w-3xl mx-auto text-center px-4 mb-8 sm:mb-12">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                        <h3 className="font-heading text-base sm:text-lg text-charcoal uppercase tracking-[0.15em] mb-4">Seja bem-vindo ao nosso site de casamento!</h3>
                        <div className="space-y-3 text-gray-600 font-sans text-xs sm:text-sm leading-relaxed">
                            <p>Criamos este espaço para compartilhar com vocês todos os detalhes do nosso grande dia. Estamos muito felizes de tê-lo conosco!</p>
                            <p>Aproveitamos também para deixar aqui todas as informações sobre como nos presentear, caso queira — você pode escolher um mimo na nossa lista de presentes online aqui neste site, ou, se preferir, nos presentear pessoalmente no dia da festa! Contamos com sua presença e carinho para celebrar conosco esse momento tão especial! 💖</p>
                        </div>
                    </div>
                </div>
                {/* Countdown Section */}
                <div className="w-full bg-slate-50 py-8 sm:py-12 mb-8 sm:mb-12">
                    <Countdown />
                </div>
            </div>

            {/* About Section */}
            <About />

            {/* Ceremony Section */}
            <Ceremony />



            {/* Gift Registry Section */}
            <div id="lista" className="container mx-auto px-4 py-12 sm:py-16 space-y-8 sm:space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-heading text-charcoal uppercase tracking-[0.2em]">Lista de Presentes</h2>
                    <div className="w-16 h-px bg-charcoal mx-auto"></div>
                    <p className="text-sm sm:text-base text-gray-500 font-light font-sans tracking-wide px-4">Queridos amigos e familiares, Caso queiram nos presentear, selecionamos alguns itens para o nosso lar.</p>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 max-w-6xl mx-auto">
                    <div className="flex flex-col space-y-4 sm:space-y-6">
                        {/* Search Input */}
                        <div className="relative w-full group">
                            <input
                                type="text"
                                placeholder="BUSCAR PRESENTE..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-0 pr-8 py-2 border-b border-gray-300 focus:border-charcoal outline-none transition-all bg-transparent placeholder-gray-400 font-sans text-sm uppercase tracking-wider"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute right-0 top-3 pointer-events-none" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                            {/* Sort Dropdown */}
                            <div className="flex-1 sm:flex-none inline-flex items-center justify-between sm:justify-start space-x-2 border-b border-gray-300 pb-2">
                                <span className="text-xs uppercase tracking-widest text-gray-400">Ordenar por:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-xs text-charcoal font-bold uppercase tracking-wide focus:outline-none cursor-pointer"
                                >
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                    <option value="name-asc">Nome (A-Z)</option>
                                    <option value="name-desc">Nome (Z-A)</option>
                                </select>
                            </div>

                            {/* Cash Gift Button */}
                            <button
                                onClick={() => setShowCashModal(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-charcoal text-white px-6 sm:px-8 py-3 hover:bg-charcoal-light transition-colors uppercase tracking-widest text-xs font-bold"
                            >
                                <Banknote className="w-4 h-4" />
                                <span className="hidden sm:inline">Presentear com Dinheiro</span>
                                <span className="sm:hidden">Dinheiro</span>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 max-w-7xl mx-auto">
                        {filteredAndSortedGifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                onSelect={addToCart}
                            />
                        ))}
                    </div>
                )}

                {filteredAndSortedGifts.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-400 font-light tracking-widest uppercase text-sm">
                        Nenhum presente encontrado.
                    </div>
                )}
            </div>

            <PixModal
                isOpen={!!selectedGift}
                onClose={handleCloseModal}
                payload={pixData}
                giftName={selectedGift?.name}
            />

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemoveItem={removeFromCart}
                onCheckout={handleCartCheckout}
            />

            {/* Floating Cart Button */}
            {cart.length > 0 && !isCartOpen && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
                >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cart.length}
                    </span>
                </button>
            )}


            {/* Cash Gift Modal (New) */}
            {showCashModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 sm:p-10 max-w-md w-full relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors">
                            <div className="w-6 h-6 flex items-center justify-center text-xl">×</div>
                        </button>

                        <h3 className="text-lg sm:text-xl font-heading text-charcoal mb-2 text-center uppercase tracking-[0.2em] font-light">Presente em Dinheiro</h3>
                        <div className="w-12 h-px bg-charcoal mx-auto mb-6 sm:mb-8"></div>
                        <p className="text-gray-500 mb-8 sm:mb-10 text-center font-light text-sm tracking-wide">Qual valor você gostaria de nos presentear?</p>

                        <form onSubmit={handleCashGift} className="space-y-6 sm:space-y-8">
                            <div className="relative group">
                                <span className="absolute left-0 top-2 text-gray-400 font-light text-xl sm:text-2xl">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full pl-6 sm:pl-8 pr-4 py-2 text-2xl sm:text-4xl font-light text-charcoal border-b border-gray-200 focus:border-charcoal outline-none bg-transparent transition-colors placeholder-gray-200"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 sm:py-4 bg-charcoal text-white hover:bg-charcoal-light transition-colors uppercase tracking-[0.2em] text-xs font-bold"
                                >
                                    Gerar Pix
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
