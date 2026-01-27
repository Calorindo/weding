import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SlidersHorizontal, Search, Banknote } from 'lucide-react';
import GiftCard from '../components/GiftCard';
import PixModal from '../components/PixModal';
import Countdown from '../components/Countdown';
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

    // Custom Cash Gift State
    const [showCashModal, setShowCashModal] = useState(false);
    const [cashAmount, setCashAmount] = useState('');

    const fetchGifts = React.useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/gifts');
            setGifts(response.data);
        } catch (error) {
            console.error('Error fetching gifts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGifts();
    }, [fetchGifts]);

    const handleSelectGift = async (gift) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/gifts/${gift.id}/select`);
            setPixData(response.data.payload);
            setSelectedGift(gift);
        } catch (error) {
            console.error('Error selecting gift:', error);
            alert('Erro ao gerar Pix. Tente novamente.');
        }
    };

    const handleCashGift = async (e) => {
        e.preventDefault();
        if (!cashAmount || parseFloat(cashAmount) <= 0) return;

        try {
            const response = await axios.post('http://localhost:3000/api/pix', {
                amount: parseFloat(cashAmount),
                message: 'Presente em Dinheiro'
            });
            setPixData(response.data.payload);
            setSelectedGift({ name: `Presente em Dinheiro (R$ ${cashAmount})` });
            setShowCashModal(false);
        } catch (error) {
            console.error('Error generating cash pix:', error);
            alert('Erro ao gerar Pix.');
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
            <div className="flex flex-col items-center pt-24 pb-16 px-4 text-center bg-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light text-charcoal uppercase tracking-[0.15em] mb-4">
                    Gabriel + Emanuely
                </h1>
                <p className="text-sm md:text-base font-sans font-bold tracking-[0.2em] text-gray-500 mb-12 uppercase">
                    18.04.2026 • Brasil
                </p>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl px-4 mb-16">
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo2} alt="Gabriel and Emanuely 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo1} alt="Gabriel and Emanuely Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden">
                        <img src={photo3} alt="Gabriel and Emanuely 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>

                {/* Quote Section */}
                <div className="max-w-2xl mx-auto text-center px-4 mb-12">
                    <p className="font-cursive text-3xl md:text-4xl text-charcoal mb-4 lowercase">
                        "o amor é composto de uma só alma habitando dois corpos."
                    </p>
                </div>

                {/* Countdown Section */}
                <div className="w-full bg-slate-50 py-12 mb-12">
                    <Countdown />
                </div>
            </div>


            {/* Gift Registry Section */}
            <div id="lista" className="container mx-auto px-4 py-16 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-heading text-charcoal uppercase tracking-[0.2em]">Lista de Presentes</h2>
                    <div className="w-16 h-px bg-charcoal mx-auto"></div>
                    <p className="text-gray-500 font-light font-sans tracking-wide">Queridos amigos e familiares, a presença de vocês é o nosso maior presente.<br />Caso queiram nos presentear, selecionamosalguns itens para o nosso lar.</p>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Search Input */}
                        <div className="relative w-full md:max-w-md group">
                            <input
                                type="text"
                                placeholder="BUSCAR PRESENTE..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-0 pr-4 py-2 border-b border-gray-300 focus:border-charcoal outline-none transition-all bg-transparent placeholder-gray-400 font-sans text-sm uppercase tracking-wider"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute right-0 top-3 pointer-events-none" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            {/* Sort Dropdown */}
                            <div className="w-full sm:w-auto inline-flex items-center space-x-2 border-b border-gray-300 pb-2">
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
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-3 hover:bg-charcoal-light transition-colors uppercase tracking-widest text-xs font-bold"
                            >
                                <Banknote className="w-4 h-4" />
                                <span>Presentear com Dinheiro</span>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto">
                        {filteredAndSortedGifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                onSelect={handleSelectGift}
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

            {/* Pix Modal (Existing) */}
            <PixModal
                isOpen={!!selectedGift}
                onClose={handleCloseModal}
                payload={pixData}
                giftName={selectedGift?.name}
            />

            {/* Cash Gift Modal (New) */}
            {showCashModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white p-10 max-w-md w-full relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors">
                            <div className="w-6 h-6 flex items-center justify-center text-xl">×</div>
                        </button>

                        <h3 className="text-xl font-heading text-charcoal mb-2 text-center uppercase tracking-[0.2em] font-light">Presente em Dinheiro</h3>
                        <div className="w-12 h-px bg-charcoal mx-auto mb-8"></div>
                        <p className="text-gray-500 mb-10 text-center font-light text-sm tracking-wide">Qual valor você gostaria de nos presentear?</p>

                        <form onSubmit={handleCashGift} className="space-y-8">
                            <div className="relative group">
                                <span className="absolute left-0 top-2 text-gray-400 font-light text-2xl">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full pl-8 pr-4 py-2 text-4xl font-light text-charcoal border-b border-gray-200 focus:border-charcoal outline-none bg-transparent transition-colors placeholder-gray-200"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-charcoal text-white hover:bg-charcoal-light transition-colors uppercase tracking-[0.2em] text-xs font-bold"
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
