import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
    // Content extracted from reference
    const profiles = [
        {
            name: "GABRIEL",
            image: "https://cdn-assets-legacy.casar.com/thumb/300x300x1xx611,388,279,279/dados/sitenoivos/wed1250782/paginas/dxc4f_1767485847.jpeg"
        },
        {
            name: "EMANUELY",
            image: "https://cdn-assets-legacy.casar.com/thumb/300x300x1xx226,339,492,492/dados/sitenoivos/wed1250782/paginas/DuC7f_1767485801.jpeg"

        }
    ];

    const sliderImages = [
        "https://cdn-assets-legacy.casar.com/thumb/autoxautox1xx0,133,1280,720/dados/sitenoivos/wed1250782/sliders/pF1c6_1767485906.jpeg",
        "https://cdn-assets-legacy.casar.com/thumb/autoxautox1xx0,129,1280,720/dados/sitenoivos/wed1250782/sliders/Ye2dT_1767485966.jpeg",
        "https://cdn-assets-legacy.casar.com/thumb/autoxautox1xx0,133,1280,720/dados/sitenoivos/wed1250782/sliders/4T9nw_1767485994.jpeg",
        "https://cdn-assets-legacy.casar.com/thumb/autoxautox1xx0,528,854,480/dados/sitenoivos/wed1250782/sliders/F4KLY_1767486026.jpeg"
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
    };

    // Auto-advance slider
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="casal" className="py-12 sm:py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-heading text-charcoal uppercase tracking-[0.2em] mb-4">O Casal</h2>
                    <div className="w-16 h-px bg-charcoal mx-auto"></div>
                </div>

                {/* Profiles */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-24 mb-12 sm:mb-20">
                    {profiles.map((profile, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 sm:mb-6 border-4 border-gray-100 shadow-sm">
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="text-lg sm:text-xl font-heading text-charcoal uppercase tracking-[0.15em]">{profile.name}</h3>
                        </div>
                    ))}
                </div>

                {/* Slider */}
                <div className="max-w-5xl mx-auto relative group">
                    <div className="aspect-video w-full overflow-hidden rounded-sm shadow-lg bg-gray-100 relative">
                        {sliderImages.map((img, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Couple Photo ${index + 1}`}
                                    className="w-full h-full object-contain bg-gray-50"
                                />
                            </div>
                        ))}

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-charcoal rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-charcoal rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {sliderImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-charcoal w-4' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
