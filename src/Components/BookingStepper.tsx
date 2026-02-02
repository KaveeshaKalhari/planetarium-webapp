import { Check } from 'lucide-react';

interface BookingStepperProps {
    currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
    const steps = [
        { number: 1, label: 'Select Show' },
        { number: 2, label: 'Choose Seats' },
        { number: 3, label: 'Review Order' },
        { number: 4, label: 'Payment' }
    ];

    return (
        <div className="w-full py-8 bg-[#001F54]">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center relative">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                        currentStep > step.number
                                            ? 'bg-[#1282A2] border-[#1282A2]'
                                            : currentStep === step.number
                                                ? 'bg-[#1282A2] border-[#1282A2]'
                                                : 'bg-transparent border-white/40'
                                    }`}
                                >
                                    {currentStep > step.number ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <span
                                            className={`text-sm font-semibold ${
                                                currentStep >= step.number ? 'text-white' : 'text-white/60'
                                            }`}
                                        >
                      {step.number}
                    </span>
                                    )}
                                </div>
                                <p
                                    className={`text-xs mt-2 whitespace-nowrap ${
                                        currentStep >= step.number ? 'text-white font-medium' : 'text-white/60'
                                    }`}
                                >
                                    {step.label}
                                </p>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 -mt-6">
                                    <div
                                        className={`h-full transition-all ${
                                            currentStep > step.number ? 'bg-[#1282A2]' : 'bg-white/20'
                                        }`}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
