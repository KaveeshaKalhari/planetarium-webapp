import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingStepperProps {
    currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
    const [animatedStep, setAnimatedStep] = useState(0);

    const steps = [
        { number: 1, label: 'Select Show', icon: '🗓' },
        { number: 2, label: 'Choose Seats', icon: '💺' },
        { number: 3, label: 'Review Order', icon: '📋' },
        { number: 4, label: 'Payment', icon: '💳' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedStep(currentStep), 100);
        return () => clearTimeout(timer);
    }, [currentStep]);

    return (
        <div className="w-full bg-gradient-to-r from-[#001F54] via-[#034078] to-[#001F54] relative overflow-hidden">
            <div className="max-w-2xl mx-auto px-6 py-2 relative z-10">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Step node */}
                            <div className="flex items-center gap-1.5 relative">
                                {/* Glow ring for active */}
                                {animatedStep === step.number && (
                                    <div className="absolute w-8 h-8 rounded-full bg-[#1282A2]/30 animate-ping pointer-events-none left-0" />
                                )}

                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10 shrink-0
                                    ${animatedStep > step.number
                                        ? 'bg-[#1282A2] border-[#1282A2]'
                                        : animatedStep === step.number
                                            ? 'bg-[#1282A2] border-[#219EBC] shadow-[0_0_10px_rgba(18,130,162,0.7)]'
                                            : 'bg-transparent border-white/30'}`}>
                                    {animatedStep > step.number ? (
                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    ) : animatedStep === step.number ? (
                                        <span className="text-xs leading-none">{step.icon}</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-white/40">{step.number}</span>
                                    )}
                                </div>

                                <p className={`text-[11px] whitespace-nowrap font-medium tracking-wide transition-all duration-300 hidden sm:block
                                    ${animatedStep >= step.number ? 'text-white' : 'text-white/40'}`}>
                                    {step.label}
                                </p>
                            </div>

                            {/* Connector */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-2 h-px bg-white/15 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#1282A2] to-[#219EBC] rounded-full transition-all duration-700 ease-out"
                                        style={{ width: animatedStep > step.number ? '100%' : '0%' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}