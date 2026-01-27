import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

const Ceremony = () => {
    return (
        <section id="cerimonia" className="py-12 sm:py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-heading text-charcoal uppercase tracking-[0.2em] mb-4">Cerimônia e Recepção</h2>
                    <div className="w-16 h-px bg-charcoal mx-auto"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 max-w-6xl mx-auto">
                    {/* Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-xl relative">
                            <div className="absolute inset-0 border-[8px] sm:border-[12px] border-white z-10"></div>
                            <img
                                src="https://cdn-assets-legacy.casar.com/dados/sitenoivos/wed1250782/paginas/omiQ7_1760650042.jpeg"
                                alt="Local da Cerimônia"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-heading text-charcoal uppercase tracking-[0.15em] mb-2">Cerimônia</h3>
                            <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed mb-4 sm:mb-6">
                                A cerimônia será realizada no dia 18/04/2026, no Sítio da Figueira e iniciará pontualmente, portanto chegue com antecedência! Em seguida, celebraremos juntos no mesmo local, com muita música, comida boa e alegria.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="flex flex-col items-center lg:items-start p-4 sm:p-6 bg-white shadow-sm border border-gray-100">
                                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-charcoal mb-2 sm:mb-3" strokeWidth={1} />
                                <h4 className="font-heading uppercase tracking-wider text-xs sm:text-sm mb-1">Data</h4>
                                <p className="text-sm sm:text-base text-gray-500 font-light">18 de Abril de 2026</p>
                            </div>

                            <div className="flex flex-col items-center lg:items-start p-4 sm:p-6 bg-white shadow-sm border border-gray-100">
                                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-charcoal mb-2 sm:mb-3" strokeWidth={1} />
                                <h4 className="font-heading uppercase tracking-wider text-xs sm:text-sm mb-1">Horário</h4>
                                <p className="text-sm sm:text-base text-gray-500 font-light">16:30</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center lg:items-start p-4 sm:p-6 bg-white shadow-sm border border-gray-100">
                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-charcoal mb-2 sm:mb-3" strokeWidth={1} />
                            <h4 className="font-heading uppercase tracking-wider text-xs sm:text-sm mb-1">Local</h4>
                            <p className="text-charcoal font-bold tracking-wide uppercase mb-1 text-sm sm:text-base">Sítio da Figueira</p>
                            <p className="text-gray-500 font-light text-xs sm:text-sm">Estrada Retiro da Ponta Grossa 2500 - Ponta Grossa, Porto Alegre - RS</p>

                            <div className="mt-4 sm:mt-6 w-full h-32 sm:h-48 bg-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3450.597621867183!2d-51.1398769!3d-30.152646699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951989e09b2bee2d%3A0x6622b14e9ce96808!2sS%C3%ADtio%20da%20Figueira!5e0!3m2!1spt-BR!2sbr!4v1706321234567!5m2!1spt-BR!2sbr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Mapa do Local"
                                ></iframe>
                            </div>
                            <a
                                href="https://www.google.com/maps?q=Sítio+da+Figueira,+Estrada+Retiro+da+Ponta+Grossa+2500+-+Ponta+Grossa,+Porto+Alegre+-+RS"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 sm:mt-4 inline-block text-xs font-bold uppercase tracking-widest text-charcoal border-b border-charcoal hover:text-gray-600 hover:border-gray-600 transition-colors"
                            >
                                Ver no Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ceremony;
