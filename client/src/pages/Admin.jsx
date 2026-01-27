import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const Admin = () => {
    const [gifts, setGifts] = useState([]);
    const [formData, setFormData] = useState({
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
        // eslint-disable-next-line
        fetchGifts();
    }, [fetchGifts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        try {
            await axios.post('http://localhost:3000/api/gifts', formData);
            setFormData({ name: '', price: '', imageUrl: '' });
            fetchGifts();
        } catch (error) {
            console.error('Error adding gift:', error);
            alert('Erro ao adicionar presente');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este item?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/gifts/${id}`);
            fetchGifts();
        } catch (error) {
            console.error('Error deleting gift:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-pastel-text">Gerenciar Lista</h1>

            {/* Add New Gift Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-pastel-green">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Adicionar Novo Presente
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nome do Item</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
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
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="150.00"
                            step="0.01"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">URL da Imagem (Opcional)</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
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
                    <h2 className="font-semibold text-pastel-text">Itens Cadastrados ({gifts.length})</h2>
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
                                onClick={() => handleDelete(gift.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remover"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {gifts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Sua lista está vazia. Adicione o primeiro presente acima!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
