import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Heart } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'Manu@230799') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Senha incorreta');
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-pastel-green w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Heart className="w-12 h-12 text-pastel-darkGreen mx-auto mb-4" />
                    <h1 className="text-3xl font-serif text-pastel-text">Acesso Restrito</h1>
                    <p className="text-gray-500">Área exclusiva para os noivos</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pastel-green focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-pastel-green hover:bg-pastel-darkGreen text-pastel-text hover:text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
