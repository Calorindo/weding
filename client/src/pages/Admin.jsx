import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon, Users, Gift, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref, push, onValue, remove } from "firebase/database";

const Admin = () => {
    const [activeTab, setActiveTab] = useState('guests'); // 'gifts' or 'guests'

    // --- GIFTS STATE & LOGIC ---
    const [gifts, setGifts] = useState([]);
    const [giftFormData, setGiftFormData] = useState({
        name: '',
        price: '',
        imageUrl: ''
    });

    const fetchGifts = React.useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/gifts');
            setGifts(response.data);
        } catch (error) {
            console.error('Error fetching gifts:', error);
        }
    }, []);

    useEffect(() => {
        fetchGifts();
    }, [fetchGifts]);

    const handleGiftSubmit = async (e) => {
        e.preventDefault();
        if (!giftFormData.name || !giftFormData.price) return;

        try {
            await axios.post('http://localhost:3000/api/gifts', giftFormData);
            setGiftFormData({ name: '', price: '', imageUrl: '' });
            fetchGifts();
        } catch (error) {
            console.error('Error adding gift:', error);
            alert('Erro ao adicionar presente');
        }
    };

    const handleGiftDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este item?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/gifts/${id}`);
            fetchGifts();
        } catch (error) {
            console.error('Error deleting gift:', error);
        }
    };

    const handleGiftChange = (e) => {
        setGiftFormData({
            ...giftFormData,
            [e.target.name]: e.target.value
        });
    };

    // --- GUESTS STATE & LOGIC ---
    const [guests, setGuests] = useState([]);
    const [guestFormData, setGuestFormData] = useState({
        name: '',
        adults: 1,
        children: 0,
        category: 'Amigo'
    });

    useEffect(() => {
        const guestsRef = ref(db, 'guests');
        const unsubscribe = onValue(guestsRef, (snapshot) => {
            console.log('Firebase listener triggered');
            if (snapshot.exists()) {
                const guestsData = snapshot.val();
                console.log('Guests data from Firebase:', guestsData);
                const guestList = Object.entries(guestsData).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                // Sort by name
                guestList.sort((a, b) => a.name.localeCompare(b.name));
                console.log('Processed guest list:', guestList);
                setGuests(guestList);
            } else {
                console.log('No guests found in Firebase');
                setGuests([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGuestSubmit = async (e) => {
        e.preventDefault();
        console.log('Tentando adicionar convidado:', guestFormData);
        
        if (!guestFormData.name) {
            alert('Nome é obrigatório');
            return;
        }

        try {
            const guestsRef = ref(db, 'guests');
            const newGuest = {
                name: guestFormData.name.toUpperCase(),
                adults: parseInt(guestFormData.adults),
                children: parseInt(guestFormData.children),
                category: guestFormData.category,
                confirmed: false,
                confirmedAdults: 0,
                confirmedChildren: 0,
                createdAt: new Date().toISOString()
            };
            
            console.log('Dados a serem salvos:', newGuest);
            await push(guestsRef, newGuest);
            
            console.log('Convidado adicionado com sucesso');
            setGuestFormData({ name: '', adults: 1, children: 0, category: 'Amigo' });
        } catch (error) {
            console.error('Error adding guest:', error);
            alert('Erro ao adicionar convidado: ' + error.message);
        }
    };

    const handleGuestDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este convidado?')) return;
        try {
            const guestRef = ref(db, `guests/${id}`);
            await remove(guestRef);
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    const handleGuestChange = (e) => {
        setGuestFormData({
            ...guestFormData,
            [e.target.name]: e.target.value
        });
    };

    // --- RENDER ---

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20 pt-20 sm:pt-24 px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-pastel-text">Painel Administrativo</h1>

            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'guests'
                            ? 'text-pastel-darkGreen border-b-2 border-pastel-darkGreen'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Convidados ({guests.length})
                </button>
                <button
                    onClick={() => setActiveTab('gifts')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'gifts'
                            ? 'text-pastel-darkGreen border-b-2 border-pastel-darkGreen'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    Presentes ({gifts.length})
                </button>
            </div>

            {activeTab === 'gifts' ? (
                <>
                    {/* Add New Gift Form */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pastel-green">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Adicionar Novo Presente
                        </h2>
                        <form onSubmit={handleGiftSubmit} className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Nome do Item</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={giftFormData.name}
                                    onChange={handleGiftChange}
                                    placeholder="Ex: Jogo de Panelas"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={giftFormData.price}
                                    onChange={handleGiftChange}
                                    placeholder="150.00"
                                    step="0.01"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">URL da Imagem (Opcional)</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={giftFormData.imageUrl}
                                    onChange={handleGiftChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-pastel-green hover:bg-pastel-darkGreen text-pastel-text hover:text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
                                >
                                    Adicionar à Lista
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Gift List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-pastel-lightGreen border-b border-pastel-green">
                            <h2 className="font-semibold text-pastel-text">Itens Cadastrados</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {gifts.map(gift => (
                                <div key={gift.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {gift.imageUrl ? (
                                                <img src={gift.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{gift.name}</h3>
                                            <p className="text-pastel-darkGreen font-bold">R$ {gift.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleGiftDelete(gift.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* GUESTS SECTION */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pastel-green">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Adicionar Novo Convidado
                        </h2>
                        <form onSubmit={handleGuestSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={guestFormData.name}
                                    onChange={handleGuestChange}
                                    placeholder="NOME DO CONVIDADO"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all uppercase"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Categoria</label>
                                <select
                                    name="category"
                                    value={guestFormData.category}
                                    onChange={handleGuestChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                >
                                    <option value="Amigo">Amigo</option>
                                    <option value="Parente">Parente</option>
                                    <option value="Padrinho">Padrinho</option>
                                    <option value="Noivos">Noivos</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Adultos</label>
                                <input
                                    type="number"
                                    name="adults"
                                    value={guestFormData.adults}
                                    onChange={handleGuestChange}
                                    min="1"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Crianças</label>
                                <input
                                    type="number"
                                    name="children"
                                    value={guestFormData.children}
                                    onChange={handleGuestChange}
                                    min="0"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-5 pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-pastel-green hover:bg-pastel-darkGreen text-pastel-text hover:text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
                                >
                                    Adicionar Convidado
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-pastel-lightGreen border-b border-pastel-green flex justify-between items-center">
                            <h2 className="font-semibold text-pastel-text">Lista de Convidados</h2>
                            <div className="text-sm text-pastel-darkGreen font-bold">
                                Total Confirmados: {guests.filter(g => g.confirmed).length} / {guests.length}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {guests.map(guest => (
                                <div key={guest.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${guest.confirmed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {guest.confirmed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 uppercase tracking-wide">{guest.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {guest.category} • {guest.adults} adultos, {guest.children} crianças
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleGuestDelete(guest.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {guests.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    Nenhum convidado cadastrado.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;
