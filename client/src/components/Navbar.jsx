import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', id: 'home' },
        { name: 'O Casal', id: 'casal' },
        { name: 'Cerimônia e Recepção', id: 'cerimonia' },
        { name: 'Lista de Presentes', id: 'lista' },
    ];

    const scrollToSection = (id) => {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-charcoal hover:text-charcoal-light transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex justify-center w-full space-x-8 items-center">
                    {isHomePage ? (
                        <>
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`text-xs uppercase tracking-[0.2em] font-sans font-bold transition-colors ${scrolled ? 'text-gray-500 hover:text-charcoal' : 'text-gray-600 hover:text-charcoal'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </>
                    ) : (
                        <Link
                            to="/"
                            className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-bold transition-colors ${scrolled ? 'text-gray-500 hover:text-charcoal' : 'text-gray-600 hover:text-charcoal'
                                }`}
                        >
                            <Home size={16} />
                            Voltar ao Site
                        </Link>
                    )}
                    <Link to="/admin" className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-gray-400 hover:text-charcoal">Admin</Link>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 lg:hidden animate-in slide-in-from-top-2">
                        {isHomePage ? (
                            <>
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => scrollToSection(link.id)}
                                        className="text-sm uppercase tracking-widest text-gray-600 hover:text-charcoal py-2 border-b border-gray-100 last:border-0 text-left"
                                    >
                                        {link.name}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-600 hover:text-charcoal py-2 border-b border-gray-100"
                            >
                                <Home size={16} />
                                Voltar ao Site
                            </Link>
                        )}
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-400 hover:text-charcoal py-2">Admin</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
