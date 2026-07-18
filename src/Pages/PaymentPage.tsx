import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, CheckCircle, ChevronLeft } from "lucide-react";
import { BookingStepper } from "../components/BookingStepper";
import api from "../services/api";

// PayHere's JS SDK attaches itself to window at runtime
declare global {
  interface Window {
    payhere: any;
  }
}

const PAYHERE_SCRIPT_SRC = "https://www.payhere.lk/lib/payhere.js";

// Loads the PayHere SDK once, reusing it if it's already on the page
function loadPayHereScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.payhere) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      `script[src="${PAYHERE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = PAYHERE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

export function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { bookingId, total, showDetails, selectedSeats } = state || {};

  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [successStep, setSuccessStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 80);
  }, []);

  useEffect(() => {
    loadPayHereScript()
      .then(() => setSdkReady(true))
      .catch(() =>
        setErrorMsg("Could not load the payment gateway. Please refresh."),
      );
  }, []);

  const handlePay = async () => {
    if (!bookingId) {
      setErrorMsg("Missing booking details. Please start over.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await api.post("/payments/payhere/initiate", { bookingId });
      const payment = res.data;

      window.payhere.onCompleted = function () {
        // UI-only signal — the real confirmation comes from the backend
        // once PayHere's server-to-server notify has been verified.
        setBookingRef(payment.orderId);
        setPaymentComplete(true);
        setTimeout(() => setSuccessStep(1), 300);
        setTimeout(() => setSuccessStep(2), 700);
        setTimeout(() => setSuccessStep(3), 1100);
        setTimeout(() => navigate("/user-home-page"), 5000);
      };
      window.payhere.onDismissed = function () {
        setLoading(false);
      };
      window.payhere.onError = function (error: string) {
        setLoading(false);
        setErrorMsg("Payment failed: " + error);
      };

      window.payhere.startPayment({
        sandbox: payment.sandbox,
        merchant_id: payment.merchantId,
        return_url: payment.returnUrl,
        cancel_url: payment.cancelUrl,
        notify_url: payment.notifyUrl,
        order_id: payment.orderId,
        items: payment.items,
        amount: payment.amount,
        currency: payment.currency,
        hash: payment.hash,
        first_name: payment.firstName,
        last_name: payment.lastName,
        email: payment.email,
        phone: payment.phone,
        address: payment.address,
        city: payment.city,
        country: payment.country,
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(
        err?.response?.data?.message ||
          "Could not start payment. Please try again.",
      );
    }
  };

  // ── Success Screen ──
  if (paymentComplete) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#001F54] to-[#034078]">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="relative inline-block mb-6">
              <div className="ring absolute top-1/2 left-1/2 w-28 h-28 rounded-full border-2 border-[#219EBC]/40" />
              <div className="success-pop relative bg-gradient-to-br from-[#1282A2] to-[#219EBC] p-5 rounded-full shadow-2xl shadow-[#1282A2]/40">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            <div className="fu1 mb-1">
              <h2 className="text-2xl font-bold text-white">
                Payment Successful!
              </h2>
            </div>
            <div className="fu2 mb-6">
              <p className="text-white/60 text-sm">
                Your booking is confirmed. A confirmation email has been sent.
              </p>
            </div>
            <div
              className={`fu3 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 mb-5 transition-all duration-700 ${successStep >= 2 ? "opacity-100" : "opacity-0"}`}
            >
              <p className="text-white/50 text-xs mb-1">Booking Reference</p>
              <p className="text-white font-mono text-lg font-bold tracking-wider">
                {bookingRef}
              </p>
            </div>
            <div
              className={`flex items-center justify-center gap-2 text-white/40 text-xs transition-all duration-700 ${successStep >= 3 ? "opacity-100" : "opacity-0"}`}
            >
              {[0, 150, 300].map((d) => (
                <div
                  key={d}
                  className="w-1 h-1 rounded-full bg-white/40 animate-bounce"
                  style={{ animationDelay: d + "ms" }}
                />
              ))}
              <span>Redirecting to home in a few seconds…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Page ──
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F0F4F8]">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#0A1128] via-[#001F54] to-[#034078] text-white relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 0.5 + "px",
                height: Math.random() * 2 + 0.5 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.35 + 0.1,
                animation: `orbitGlow ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 3 + "s",
              }}
            />
          ))}
        </div>
        <div
          className={`max-w-7xl mx-auto px-6 py-3 relative z-10 transition-all duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/review-order")}
              className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 mr-2 transition-all active:scale-95"
              title="Back to Home"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-xs font-semibold tracking-widest text-[#219EBC] uppercase">
              Step 4 of 4
            </span>
            <span className="mx-3 text-white/20">|</span>
            <h1 className="text-lg font-bold">Payment</h1>
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="shrink-0">
        <BookingStepper currentStep={4} />
      </div>

      {/* ── Main Content ── */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-full max-w-5xl mx-auto px-4 py-3 flex gap-4">
          {/* ── Payment Panel ── */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 fade-up flex flex-col">
            {/* Secure header */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E2E8F0]">
              <div className="bg-[#EFF6FF] p-1.5 rounded-lg">
                <Lock className="w-4 h-4 text-[#1282A2]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0A1128]">
                  Secure Payment
                </h2>
                <p className="text-[10px] text-[#0A1128]/50">
                  Processed securely by PayHere — we never see or store your
                  card details
                </p>
              </div>
            </div>

            {/* PayHere branding panel */}
            <div className="card-flip mb-3 bg-gradient-to-br from-[#034078] via-[#1282A2] to-[#219EBC] rounded-xl p-4 text-white relative overflow-hidden h-28 shadow-lg shrink-0 flex items-center justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <ShieldCheck className="w-7 h-7 text-white/80" />
                <p className="text-sm font-semibold">
                  You'll be redirected to PayHere's secure checkout
                </p>
                <p className="text-[10px] text-white/60">
                  Visa • MasterCard • Amex • Bank transfer
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-2.5">
              {/* Security note */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-2 flex items-start gap-1.5">
                <span className="text-green-500 text-xs"></span>
                <p className="text-[10px] text-green-800">
                  Your card details are entered directly on PayHere's encrypted
                  checkout page. We never receive or store them.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-[11px] text-red-600">{errorMsg}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={loading || !sdkReady}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                    ${
                                      !loading && sdkReady
                                        ? "shimmer-btn text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                        : "bg-[#0A1128]/20 text-[#0A1128]/40 cursor-not-allowed"
                                    }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Pay Rs {(total || 0).toFixed(2)} Securely
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Summary Sidebar ── */}
          <div
            className="w-56 flex flex-col fade-up"
            style={{ animationDelay: "0.08s" }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#1282A2] rounded-full" />
                <h3 className="text-sm font-bold text-[#0A1128]">
                  Payment Summary
                </h3>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] mb-3">
                <p className="font-semibold text-[#0A1128] text-xs">
                  {showDetails?.title || "Planetarium Show"}
                </p>
                <p className="text-[10px] text-[#0A1128]/50 mt-0.5">
                  {showDetails?.showDate} •{" "}
                  {showDetails?.showTime === "morning"
                    ? "10:00 AM"
                    : "03:00 PM"}
                </p>
              </div>

              <div className="space-y-2 mb-3 pb-3 border-b border-[#E2E8F0] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#0A1128]/60">
                    {selectedSeats?.length || 0} seat(s)
                  </span>
                  <span className="font-medium text-[#0A1128]">
                    Rs {(total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0A1128]/60">Tax & fees</span>
                  <span className="font-medium text-[#0A1128]">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-[#0A1128] text-sm">Total</span>
                <span className="text-xl font-bold text-[#1282A2]">
                  Rs {(total || 0).toFixed(2)}
                </span>
              </div>

              <div className="mt-auto space-y-2">
                <button
                  onClick={() => window.history.back()}
                  className="w-full py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-lg transition-all duration-150 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Review
                </button>

                {/* Seat badges */}
                {selectedSeats?.length > 0 && (
                  <div className="bg-[#F8FAFC] rounded-lg p-2 border border-[#E2E8F0]">
                    <p className="text-[10px] text-[#0A1128]/50 mb-1.5">
                      Booked Seats
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(selectedSeats || []).map((s: string) => (
                        <span
                          key={s}
                          className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[9px] text-[#0A1128]/35 pt-1">
                  {["Visa", "MC", "Amex"].map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
