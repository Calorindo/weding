import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        { name: 'Home', path: '/' },
        { name: 'O Casal', path: '/#casal' },
        { name: 'Cerimônia e Recepção', path: '/#cerimonia' },
        { name: 'Confirme sua Presença', path: '/#rsvp' },
        { name: 'Lista de Presentes', path: '/#lista' },
    ];

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
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`text-xs uppercase tracking-[0.2em] font-sans font-bold transition-colors ${scrolled ? 'text-gray-500 hover:text-charcoal' : 'text-gray-600 hover:text-charcoal'
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link to="/admin" className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-gray-400 hover:text-charcoal">Admin</Link>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 lg:hidden animate-in slide-in-from-top-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm uppercase tracking-widest text-gray-600 hover:text-charcoal py-2 border-b border-gray-100 last:border-0"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest text-gray-400 hover:text-charcoal py-2">Admin</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
