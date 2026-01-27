import React, { useState, useEffect } from 'react';

const Countdown = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2026-04-18T16:30:00") - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                segundos: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm w-20 h-20 md:w-24 md:h-24 mx-2">
                <span className="text-3xl md:text-4xl font-heading font-bold text-charcoal">
                    {timeLeft[interval].toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-pastel-text mt-1 font-heading font-semibold">
                    {interval}
                </span>
            </div>
        );
    });

    return (
        <div className="w-full bg-charcoal py-12 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-6">
                    <h3 className="text-white text-lg tracking-[0.2em] font-heading font-light uppercase">Contagem Regressiva</h3>
                    <div className="flex justify-center flex-wrap animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {timerComponents.length ? (
                            <div className="flex">
                                {timerComponents}
                            </div>
                        ) : (
                            <span className="text-2xl font-cursive text-white">Chegou o grande dia!</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Countdown;
