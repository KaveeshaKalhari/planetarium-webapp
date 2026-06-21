import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookingStepper } from '../components/BookingStepper';
import api from '../services/api';

export function PaymentPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { bookingId, total, showDetails, selectedSeats } = state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [successStep, setSuccessStep] = useState(0);
    const [formData, setFormData] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
    const [cardErrors, setCardErrors] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });

    useEffect(() => { setTimeout(() => setPageLoaded(true), 80); }, []);

    const validateCardName = (v: string) => { if (!v.trim()) return 'Required.'; if (v.trim().length < 3) return 'Too short.'; if (!/^[a-zA-Z\s]+$/.test(v)) return 'Letters only.'; return ''; };
    const validateCardNumber = (v: string) => { const d = v.replace(/\s/g, ''); if (!d) return 'Required.'; if (!/^\d+$/.test(d)) return 'Digits only.'; if (d.length !== 16) return '16 digits required.'; return ''; };
    const validateExpiryDate = (v: string) => { if (!v) return 'Required.'; if (!/^\d{2}\/\d{2}$/.test(v)) return 'Use MM/YY.'; const [mm, yy] = v.split('/').map(Number); if (mm < 1 || mm > 12) return 'Invalid month.'; if (new Date(2000 + yy, mm - 1) < new Date()) return 'Card expired.'; return ''; };
    const validateCvv = (v: string) => { if (!v) return 'Required.'; if (!/^\d{3,4}$/.test(v)) return '3-4 digits.'; return ''; };
    const formatCardNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = {
            cardName: validateCardName(formData.cardName),
            cardNumber: validateCardNumber(formData.cardNumber),
            expiryDate: validateExpiryDate(formData.expiryDate),
            cvv: validateCvv(formData.cvv),
        };
        setCardErrors(errors);
        if (Object.values(errors).some(err => err)) return;
        setLoading(true);
        try {
            const res = await api.post('/payments/process', {
                bookingId, paymentMethod: 'CARD',
                cardLastFour: formData.cardNumber.replace(/\s/g, '').slice(-4),
                cardHolderName: formData.cardName,
            });
            setBookingRef(res.data.bookingReference);
            setPaymentComplete(true);
            setTimeout(() => setSuccessStep(1), 300);
            setTimeout(() => setSuccessStep(2), 700);
            setTimeout(() => setSuccessStep(3), 1100);
            setTimeout(() => navigate('/user-home-page'), 5000);
        } catch { alert('Payment failed. Please try again.'); }
        finally { setLoading(false); }
    };

    // ── Success Screen ──
    if (paymentComplete) {
        return (
            <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#001F54] to-[#034078]">
                <style>{`
                    @keyframes successPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2);opacity:1}80%{transform:scale(0.92)}100%{transform:scale(1);opacity:1}}
                    @keyframes ringExpand{0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.6}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}
                    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                    .success-pop{animation:successPop 0.6s cubic-bezier(.36,.07,.19,.97) both}
                    .ring{animation:ringExpand 1s ease-out infinite}
                    .fu1{animation:fadeUp 0.5s ease 0.1s both}
                    .fu2{animation:fadeUp 0.5s ease 0.3s both}
                    .fu3{animation:fadeUp 0.5s ease 0.5s both}
                `}</style>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-sm w-full text-center">
                        <div className="relative inline-block mb-6">
                            <div className="ring absolute top-1/2 left-1/2 w-28 h-28 rounded-full border-2 border-[#219EBC]/40" />
                            <div className="success-pop relative bg-gradient-to-br from-[#1282A2] to-[#219EBC] p-5 rounded-full shadow-2xl shadow-[#1282A2]/40">
                                <CheckCircle className="w-14 h-14 text-white" />
                            </div>
                        </div>
                        <div className="fu1 mb-1"><h2 className="text-2xl font-bold text-white">Payment Successful!</h2></div>
                        <div className="fu2 mb-6"><p className="text-white/60 text-sm">Your booking is confirmed. A confirmation email has been sent.</p></div>
                        <div className={`fu3 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 mb-5 transition-all duration-700 ${successStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="text-white/50 text-xs mb-1">Booking Reference</p>
                            <p className="text-white font-mono text-lg font-bold tracking-wider">{bookingRef}</p>
                        </div>
                        <div className={`flex items-center justify-center gap-2 text-white/40 text-xs transition-all duration-700 ${successStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                            {[0, 150, 300].map(d => <div key={d} className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: d + 'ms' }} />)}
                            <span>Redirecting to home in a few seconds…</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main Form ──
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F0F4F8]">
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
                @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
                @keyframes orbitGlow{0%,100%{opacity:0.15}50%{opacity:0.3}}
                @keyframes cardFlip{0%{transform:rotateY(-6deg) scale(0.97);opacity:0}100%{transform:rotateY(0deg) scale(1);opacity:1}}
                .fade-up{animation:fadeUp 0.4s ease both}
                .shimmer-btn{background:linear-gradient(90deg,#1282A2 0%,#219EBC 45%,#1282A2 100%);background-size:200% auto;animation:shimmer 2.4s linear infinite}
                .card-flip{animation:cardFlip 0.4s ease both}
                .input-valid{border-color:#22C55E!important}
                .input-error{border-color:#EF4444!important}
            `}</style>

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-[#0A1128] via-[#001F54] to-[#034078] text-white relative overflow-hidden shrink-0">
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(18)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white"
                            style={{
                                width: Math.random() * 2 + 0.5 + 'px', height: Math.random() * 2 + 0.5 + 'px',
                                top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', opacity: Math.random() * 0.35 + 0.1,
                                animation: `orbitGlow ${Math.random() * 3 + 2}s ease-in-out infinite`, animationDelay: Math.random() * 3 + 's'
                            }} />
                    ))}
                </div>
                <div className={`max-w-7xl mx-auto px-6 py-3 relative z-10 transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#219EBC]" />
                        <h1 className="text-lg font-bold">Payment</h1>
                        <span className="text-white/40 text-xs">— Step 4 of 4</span>
                        <span className="ml-auto text-white/50 text-xs">256-bit SSL encrypted</span>
                    </div>
                </div>
            </div>

            {/* ── Stepper ── */}
            <div className="shrink-0"><BookingStepper currentStep={4} /></div>

            {/* ── Main Content ── */}
            <div className={`flex-1 overflow-hidden transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="h-full max-w-5xl mx-auto px-4 py-3 flex gap-4">

                    {/* ── Payment Form ── */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 fade-up flex flex-col">

                        {/* Secure header + Method tabs */}
                        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-[#E2E8F0]">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#EFF6FF] p-1.5 rounded-lg"><Lock className="w-4 h-4 text-[#1282A2]" /></div>
                                <div>
                                    <h2 className="text-sm font-bold text-[#0A1128]">Secure Payment</h2>
                                    <p className="text-[10px] text-[#0A1128]/50">256-bit SSL encrypted</p>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-auto">
                                {[{ id: 'card', label: 'Credit Card' }, { id: 'debit', label: 'Debit Card' }].map(({ id, label }) => (
                                    <button key={id} type="button" onClick={() => setPaymentMethod(id)}
                                        className={`px-3 py-1.5 border-2 rounded-lg transition-all duration-150 flex items-center gap-1.5 text-xs font-semibold
                                            ${paymentMethod === id ? 'border-[#1282A2] bg-[#EFF6FF] text-[#1282A2]' : 'border-[#E2E8F0] hover:border-[#1282A2]/40 text-[#0A1128]/60'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card preview */}
                        <div className="card-flip mb-3 bg-gradient-to-br from-[#034078] via-[#1282A2] to-[#219EBC] rounded-xl p-4 text-white relative overflow-hidden h-28 shadow-lg shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Cardholder</p>
                                        <p className="font-semibold text-xs">{formData.cardName || 'Your Name'}</p>
                                    </div>
                                    <CreditCard className="w-6 h-6 text-white/50" />
                                </div>
                                <div>
                                    <p className="font-mono text-sm tracking-[0.18em] mb-1.5">
                                        {formData.cardNumber ? formData.cardNumber.padEnd(19, ' ').replace(/\d(?=.{5})/g, '•') : '•••• •••• •••• ••••'}
                                    </p>
                                    <div className="flex gap-5">
                                        <div><p className="text-white/40 text-[8px] uppercase">Expires</p><p className="text-xs font-mono">{formData.expiryDate || 'MM/YY'}</p></div>
                                        <div><p className="text-white/40 text-[8px] uppercase">CVV</p><p className="text-xs font-mono">{formData.cvv ? '•'.repeat(formData.cvv.length) : '•••'}</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form fields */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 flex-1">
                            {/* Name */}
                            <div>
                                <Label htmlFor="cardName" className="text-[10px] font-semibold text-[#0A1128]/70 uppercase tracking-wide">Cardholder Name</Label>
                                <Input id="cardName" type="text" placeholder="John Doe" value={formData.cardName}
                                    onChange={e => { setFormData({ ...formData, cardName: e.target.value }); setCardErrors(p => ({ ...p, cardName: validateCardName(e.target.value) })); }}
                                    className={`mt-1 bg-[#F8FAFC] rounded-lg h-8 text-sm ${cardErrors.cardName ? 'input-error' : formData.cardName && !cardErrors.cardName ? 'input-valid' : 'border-[#E2E8F0]'}`} required />
                                {cardErrors.cardName && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardName}</p>}
                            </div>

                            {/* Card Number */}
                            <div>
                                <Label htmlFor="cardNumber" className="text-[10px] font-semibold text-[#0A1128]/70 uppercase tracking-wide">Card Number</Label>
                                <Input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" value={formData.cardNumber}
                                    onChange={e => { const f = formatCardNumber(e.target.value); setFormData({ ...formData, cardNumber: f }); setCardErrors(p => ({ ...p, cardNumber: validateCardNumber(f) })); }}
                                    className={`mt-1 bg-[#F8FAFC] rounded-lg font-mono h-8 text-sm ${cardErrors.cardNumber ? 'input-error' : formData.cardNumber && !cardErrors.cardNumber ? 'input-valid' : 'border-[#E2E8F0]'}`}
                                    maxLength={19} required />
                                {cardErrors.cardNumber && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cardNumber}</p>}
                            </div>

                            {/* Expiry + CVV */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="expiryDate" className="text-[10px] font-semibold text-[#0A1128]/70 uppercase tracking-wide">Expiry Date</Label>
                                    <Input id="expiryDate" type="text" placeholder="MM/YY" value={formData.expiryDate}
                                        onChange={e => { const f = formatExpiry(e.target.value); setFormData({ ...formData, expiryDate: f }); setCardErrors(p => ({ ...p, expiryDate: validateExpiryDate(f) })); }}
                                        className={`mt-1 bg-[#F8FAFC] rounded-lg font-mono h-8 text-sm ${cardErrors.expiryDate ? 'input-error' : formData.expiryDate && !cardErrors.expiryDate ? 'input-valid' : 'border-[#E2E8F0]'}`}
                                        maxLength={5} required />
                                    {cardErrors.expiryDate && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.expiryDate}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="cvv" className="text-[10px] font-semibold text-[#0A1128]/70 uppercase tracking-wide">CVV</Label>
                                    <Input id="cvv" type="password" placeholder="•••" value={formData.cvv}
                                        onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setFormData({ ...formData, cvv: v }); setCardErrors(p => ({ ...p, cvv: validateCvv(v) })); }}
                                        className={`mt-1 bg-[#F8FAFC] rounded-lg font-mono h-8 text-sm ${cardErrors.cvv ? 'input-error' : formData.cvv && !cardErrors.cvv ? 'input-valid' : 'border-[#E2E8F0]'}`}
                                        maxLength={4} required />
                                    {cardErrors.cvv && <p className="text-[10px] text-red-500 mt-0.5">{cardErrors.cvv}</p>}
                                </div>
                            </div>

                            {/* Security note */}
                            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-2 flex items-start gap-1.5">
                                <span className="text-green-500 text-xs"></span>
                                <p className="text-[10px] text-green-800">Your payment information is encrypted. We never store your card details.</p>
                            </div>

                            <button type="submit" disabled={loading}
                                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto
                                    ${!loading ? 'shimmer-btn text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-[#0A1128]/20 text-[#0A1128]/40 cursor-not-allowed'}`}>
                                {loading ? (<><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing…</>)
                                    : (<><Lock className="w-3.5 h-3.5" />Pay Rs {(total || 0).toFixed(2)} Securely</>)}
                            </button>
                        </form>
                    </div>

                    {/* ── Summary Sidebar ── */}
                    <div className="w-56 flex flex-col fade-up" style={{ animationDelay: '0.08s' }}>
                        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-[#1282A2] rounded-full" />
                                <h3 className="text-sm font-bold text-[#0A1128]">Payment Summary</h3>
                            </div>

                            <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] mb-3">
                                <p className="font-semibold text-[#0A1128] text-xs">{showDetails?.title || 'Planetarium Show'}</p>
                                <p className="text-[10px] text-[#0A1128]/50 mt-0.5">
                                    {showDetails?.showDate} • {showDetails?.showTime === 'morning' ? '10:00 AM' : '03:00 PM'}
                                </p>
                            </div>

                            <div className="space-y-2 mb-3 pb-3 border-b border-[#E2E8F0] text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/60">{selectedSeats?.length || 0} seat(s)</span>
                                    <span className="font-medium text-[#0A1128]">Rs {(total || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/60">Tax & fees</span>
                                    <span className="font-medium text-[#0A1128]">Included</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-5">
                                <span className="font-bold text-[#0A1128] text-sm">Total</span>
                                <span className="text-xl font-bold text-[#1282A2]">Rs {(total || 0).toFixed(2)}</span>
                            </div>

                            <div className="mt-auto space-y-2">
                                <button onClick={() => window.history.back()}
                                    className="w-full py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-lg transition-all duration-150 font-semibold text-xs flex items-center justify-center gap-1.5">
                                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Review
                                </button>

                                {/* Seat badges */}
                                {selectedSeats?.length > 0 && (
                                    <div className="bg-[#F8FAFC] rounded-lg p-2 border border-[#E2E8F0]">
                                        <p className="text-[10px] text-[#0A1128]/50 mb-1.5">Booked Seats</p>
                                        <div className="flex flex-wrap gap-1">
                                            {(selectedSeats || []).map((s: string) => (
                                                <span key={s} className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-2 text-[9px] text-[#0A1128]/35 pt-1">
                                    {['Visa', 'MC', 'Amex'].map(b => <span key={b}>{b}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}