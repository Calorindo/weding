import React, { useState } from 'react';
import { Search, CheckCircle, UserCheck, Users, Baby } from 'lucide-react';
import { ref, query, orderByChild, equalTo, get, update } from "firebase/database";
import { db } from '../lib/firebase';

const RSVP = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundGuests, setFoundGuests] = useState([]);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [confirmedAdults, setConfirmedAdults] = useState(0);
    const [confirmedChildren, setConfirmedChildren] = useState(0);
    const [error, setError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setFoundGuests([]);
        setSelectedGuest(null);
        setShowSuccess(false);

        if (!searchTerm.trim()) return;

        setIsSearching(true);

        try {
            const normalizeString = (str) => {
                return str
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim();
            };

            const guestsRef = ref(db, 'guests');
            const snapshot = await get(guestsRef);

            if (snapshot.exists()) {
                const guestsData = snapshot.val();
                const normalizedSearch = normalizeString(searchTerm);

                // Busca por LIKE - encontra nomes que contenham o termo pesquisado
                const matchingGuests = Object.entries(guestsData)
                    .filter(([key, guest]) => {
                        const normalizedName = normalizeString(guest.name);
                        return normalizedName.includes(normalizedSearch);
                    })
                    .map(([key, guest]) => ({ ...guest, id: key }));

                if (matchingGuests.length > 0) {
                    setFoundGuests(matchingGuests);
                } else {
                    setError('Nenhum convidado encontrado com esse nome. Verifique a grafia ou entre em contato com os noivos.');
                }
            } else {
                setError('A lista de convidados ainda não foi carregada. Tente novamente mais tarde.');
            }
        } catch (err) {
            console.error(err);
            setError('Erro ao buscar convidado. Verifique sua conexão.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectGuest = (guest) => {
        setSelectedGuest(guest);
        setConfirmedAdults(guest.adults || 0);
        setConfirmedChildren(guest.children || 0);
        setError(null);
    };

    const handleConfirm = async () => {
        if (!selectedGuest || !selectedGuest.id) return;

        setIsConfirming(true);

        try {
            const guestRef = ref(db, `guests/${selectedGuest.id}`);
            await update(guestRef, { 
                confirmed: true,
                confirmedAdults: confirmedAdults,
                confirmedChildren: confirmedChildren
            });

            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Erro ao confirmar presença. Tente novamente.');
        } finally {
            setIsConfirming(false);
        }
    };

    const resetForm = () => {
        setFoundGuests([]);
        setSelectedGuest(null);
        setShowSuccess(false);
        setSearchTerm('');
        setError(null);
        setConfirmedAdults(0);
        setConfirmedChildren(0);
    };

    return (
        <section id="rsvp" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-heading text-charcoal uppercase tracking-[0.2em] mb-4">Confirme sua Presença</h2>
                    <div className="w-16 h-px bg-charcoal mx-auto mb-8"></div>
                    <p className="text-gray-500 font-light font-sans tracking-wide mb-12">
                        Digite seu nome completo abaixo para localizar seu convite e confirmar sua presença.
                    </p>

                    <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        {showSuccess ? (
                            <div className="bg-green-50 border border-green-100 p-6 animate-in fade-in zoom-in duration-300">
                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                <p className="text-green-800 font-sans font-bold uppercase tracking-widest text-sm">
                                    Presença Confirmada!
                                </p>
                                <p className="text-green-600 text-xs mt-2 font-light">
                                    {confirmedAdults} {confirmedAdults === 1 ? 'adulto' : 'adultos'}
                                    {confirmedChildren > 0 && ` e ${confirmedChildren} ${confirmedChildren === 1 ? 'criança' : 'crianças'}`} confirmados.
                                </p>
                                <p className="text-green-600 text-xs mt-1 font-light">
                                    Agradecemos sua confirmação. Nos vemos no grande dia!
                                </p>
                                <button
                                    onClick={resetForm}
                                    className="mt-6 text-xs text-gray-400 underline hover:text-charcoal uppercase tracking-wider"
                                >
                                    Voltar
                                </button>
                            </div>
                        ) : selectedGuest ? (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="mb-8">
                                    <UserCheck className="w-12 h-12 text-charcoal mx-auto mb-4" />
                                    <h3 className="text-xl font-heading text-charcoal uppercase tracking-widest mb-2">
                                        {selectedGuest.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-6">
                                        Convite para {selectedGuest.adults} {selectedGuest.adults === 1 ? 'Adulto' : 'Adultos'}
                                        {selectedGuest.children > 0 && ` e ${selectedGuest.children} ${selectedGuest.children === 1 ? 'Criança' : 'Crianças'}`}
                                    </p>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center justify-between p-4 border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-5 h-5 text-charcoal" />
                                            <span className="text-sm font-medium text-charcoal uppercase tracking-wider">Adultos</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setConfirmedAdults(Math.max(0, confirmedAdults - 1))}
                                                className="w-8 h-8 border border-gray-300 text-charcoal hover:bg-gray-100 transition-colors"
                                                disabled={confirmedAdults <= 0}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-charcoal">{confirmedAdults}</span>
                                            <button
                                                onClick={() => setConfirmedAdults(Math.min(selectedGuest.adults, confirmedAdults + 1))}
                                                className="w-8 h-8 border border-gray-300 text-charcoal hover:bg-gray-100 transition-colors"
                                                disabled={confirmedAdults >= selectedGuest.adults}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {selectedGuest.children > 0 && (
                                        <div className="flex items-center justify-between p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Baby className="w-5 h-5 text-charcoal" />
                                                <span className="text-sm font-medium text-charcoal uppercase tracking-wider">Crianças</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => setConfirmedChildren(Math.max(0, confirmedChildren - 1))}
                                                    className="w-8 h-8 border border-gray-300 text-charcoal hover:bg-gray-100 transition-colors"
                                                    disabled={confirmedChildren <= 0}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-charcoal">{confirmedChildren}</span>
                                                <button
                                                    onClick={() => setConfirmedChildren(Math.min(selectedGuest.children, confirmedChildren + 1))}
                                                    className="w-8 h-8 border border-gray-300 text-charcoal hover:bg-gray-100 transition-colors"
                                                    disabled={confirmedChildren >= selectedGuest.children}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={isConfirming || (confirmedAdults === 0 && confirmedChildren === 0)}
                                    className="w-full py-4 bg-charcoal text-white hover:bg-charcoal-light transition-colors uppercase tracking-[0.2em] text-xs font-bold disabled:opacity-70 disabled:cursor-not-allowed mb-4"
                                >
                                    {isConfirming ? 'Confirmando...' : 'Confirmar Presença'}
                                </button>

                                <button
                                    onClick={() => setSelectedGuest(null)}
                                    className="text-xs text-gray-400 underline hover:text-charcoal uppercase tracking-wider"
                                >
                                    Voltar para resultados
                                </button>

                                {error && (
                                    <p className="text-red-400 text-xs uppercase tracking-wider mt-4 animate-in fade-in">
                                        {error}
                                    </p>
                                )}
                            </div>
                        ) : foundGuests.length > 0 ? (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <h3 className="text-lg font-heading text-charcoal uppercase tracking-widest mb-6">
                                    Convidados Encontrados
                                </h3>
                                <div className="space-y-4 mb-6">
                                    {foundGuests.map((guest) => (
                                        <div 
                                            key={guest.id} 
                                            onClick={() => !guest.confirmed && handleSelectGuest(guest)}
                                            className={`border border-gray-200 p-4 transition-colors ${
                                                guest.confirmed 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:bg-gray-50 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium text-charcoal uppercase tracking-wider text-sm">
                                                        {guest.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {guest.adults} {guest.adults === 1 ? 'adulto' : 'adultos'}
                                                        {guest.children > 0 && ` • ${guest.children} ${guest.children === 1 ? 'criança' : 'crianças'}`}
                                                        {guest.confirmed && ' • JÁ CONFIRMADO'}
                                                    </p>
                                                </div>
                                                {!guest.confirmed && (
                                                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                                                        Clique para selecionar
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={resetForm}
                                    className="text-xs text-gray-400 underline hover:text-charcoal uppercase tracking-wider"
                                >
                                    Nova busca
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="DIGITE SEU NOME"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-4 pr-10 py-4 border-b border-gray-300 focus:border-charcoal outline-none transition-all bg-transparent placeholder-gray-400 font-sans text-sm uppercase tracking-wider text-center"
                                        disabled={isSearching}
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute right-2 top-4 pointer-events-none" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="w-full py-4 bg-charcoal text-white hover:bg-charcoal-light transition-colors uppercase tracking-[0.2em] text-xs font-bold disabled:opacity-70"
                                >
                                    {isSearching ? 'Buscando...' : 'Buscar Convite'}
                                </button>
                                {error && (
                                    <p className="text-red-400 text-xs uppercase tracking-wider mt-4 animate-in fade-in">
                                        {error}
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RSVP;
