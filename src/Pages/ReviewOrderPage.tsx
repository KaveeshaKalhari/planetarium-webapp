import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Armchair,
} from "lucide-react";
import { BookingStepper } from "../components/BookingStepper";
import api from "../services/api";
import { useState, useEffect } from "react";

export function ReviewOrderPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { showId, selectedSeats, showDetails, pricePerSeat, schoolInfo } =
    state || {};
  const subtotal = (selectedSeats?.length || 0) * (pricePerSeat || 0);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 80);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const schoolForm = schoolInfo
        ? {
            schoolName: schoolInfo.schoolName,
            schoolAddress: schoolInfo.schoolAddress,
            teacherName: schoolInfo.teacherName,
            contactNumber: schoolInfo.contactNumber,
            email: schoolInfo.email,
            studentCount: Number(schoolInfo.studentCount) || 0,
            gradeLevel: schoolInfo.gradeLevel,
            otherInfo: schoolInfo.otherInfo,
          }
        : undefined;
      const bookingRes = await api.post("/bookings", {
        showId,
        selectedSeatIds: selectedSeats,
        schoolForm,
      });
      const booking = bookingRes.data;
      navigate("/payment", {
        state: {
          bookingId: booking.id,
          total: subtotal,
          showDetails,
          selectedSeats,
        },
      });
    } catch {
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const detailItems = [
    {
      icon: <Calendar className="w-3.5 h-3.5 text-[#1282A2]" />,
      label: "Date",
      value: showDetails?.showDate || "—",
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-[#1282A2]" />,
      label: "Time",
      value: showDetails?.showTime === "morning" ? "10:00 AM" : "03:00 PM",
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-[#1282A2]" />,
      label: "Duration",
      value: showDetails?.duration ? `${showDetails.duration} min` : "45 min",
    },
    {
      icon: <MapPin className="w-3.5 h-3.5 text-[#1282A2]" />,
      label: "Venue",
      value: "Main Planetarium Hall",
    },
  ];

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
              onClick={() => navigate("/seat-selection")}
              className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 mr-2 transition-all active:scale-95"
              title="Back to Home"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-xs font-semibold tracking-widest text-[#219EBC] uppercase">
              Step 3 of 4
            </span>
            <span className="mx-3 text-white/20">|</span>
            <h1 className="text-lg font-bold">Review Your Order</h1>
            <span className="ml-auto text-white/50 text-xs">
              Verify details before payment
            </span>
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="shrink-0">
        <BookingStepper currentStep={3} />
      </div>

      {/* ── Main Content ── */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-full max-w-6xl mx-auto px-4 py-3 flex gap-4">
          {/* ── Left: Show + Seats + Notice ── */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Show Details */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 fade-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-[#1282A2] rounded-full" />
                    <h2 className="text-sm font-bold text-[#0A1128]">
                      Show Details
                    </h2>
                  </div>
                  <h3 className="text-base font-semibold text-[#0A1128] ml-3">
                    {showDetails?.title || "Planetarium Show"}
                  </h3>
                </div>
                {(showDetails?.language || showDetails?.audienceType) && (
                  <div className="flex gap-3 text-right">
                    {showDetails?.language && (
                      <div>
                        <p className="text-[10px] text-[#0A1128]/50">
                          Language
                        </p>
                        <p className="font-semibold text-[#0A1128] capitalize text-xs">
                          {showDetails.language}
                        </p>
                      </div>
                    )}
                    {showDetails?.audienceType && (
                      <div>
                        <p className="text-[10px] text-[#0A1128]/50">Program</p>
                        <p className="font-semibold text-[#0A1128] text-xs">
                          {showDetails.audienceType}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-2 bg-[#F8FAFC] rounded-lg p-2.5 border border-[#E2E8F0]"
                  >
                    <div className="bg-[#EFF6FF] p-1 rounded-md shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-[#0A1128]/50">
                        {item.label}
                      </p>
                      <p className="font-semibold text-[#0A1128] text-xs">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Seats */}
            <div
              className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-amber-400 rounded-full" />
                <h2 className="text-sm font-bold text-[#0A1128]">
                  Selected Seats
                </h2>
                <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedSeats?.length || 0} seat
                  {selectedSeats?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(selectedSeats || []).map((seat: string, i: number) => (
                  <div
                    key={seat}
                    className="seat-in px-2.5 py-1.5 bg-amber-400 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <Armchair className="w-3 h-3" /> {seat}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#0A1128]/50">
                {selectedSeats?.length || 0} seat(s) × Rs {pricePerSeat || 0}{" "}
                each
              </p>
            </div>

            {/* Important Info */}
            <div
              className="bg-gradient-to-br from-[#FFF7ED] to-[#FFFBEB] border border-[#FED7AA] rounded-xl p-3 fade-up flex-1"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-semibold text-[#92400E] mb-2 text-xs flex items-center gap-1.5">
                <span>⚠️</span> Important Information
              </h3>
              <ul className="space-y-1.5 text-xs text-[#78350F]">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> Please arrive
                  15 minutes before the show starts
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> Late entry
                  may not be permitted after the show begins
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> Tickets are
                  non-refundable but reschedulable up to 24 hours before
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> Photography
                  and video recording are not allowed during the show
                </li>
              </ul>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="w-60 flex flex-col">
            <div
              className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 fade-up flex flex-col h-full"
              style={{ animationDelay: "0.08s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#1282A2] rounded-full" />
                <h3 className="text-sm font-bold text-[#0A1128]">
                  Order Summary
                </h3>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] mb-3">
                <p className="text-[10px] text-[#0A1128]/50 mb-0.5">Show</p>
                <p className="font-semibold text-[#0A1128] text-xs">
                  {showDetails?.title || "Planetarium Show"}
                </p>
                <p className="text-[10px] text-[#0A1128]/50 mt-0.5">
                  {showDetails?.showDate}
                </p>
              </div>

              <div className="space-y-2 mb-3 pb-3 border-b border-[#E2E8F0] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#0A1128]/60">
                    {selectedSeats?.length || 0} × Rs {pricePerSeat || 0}
                  </span>
                  <span className="font-semibold text-[#0A1128]">
                    Rs {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-[#0A1128] text-sm">Total</span>
                <span className="text-xl font-bold text-[#1282A2]">
                  Rs {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-auto space-y-2">
                <button
                  onClick={handleConfirm}
                  disabled={loading || !selectedSeats?.length}
                  className={`w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs
                                        ${
                                          !loading && selectedSeats?.length
                                            ? "shimmer-btn shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-[#0A1128]/20 text-[#0A1128]/40 cursor-not-allowed"
                                        }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  {loading ? "Creating Booking…" : "Proceed to Payment"}
                  {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() =>
                    navigate("/seat-selection", {
                      state: {
                        showId,
                        showDetails,
                        schoolInfo,
                        preSelectedSeatIds: selectedSeats,
                      },
                    })
                  }
                  className="w-full py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-lg transition-all duration-150 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Seats
                </button>

                <div className="flex items-center justify-center gap-1 text-[9px] text-[#0A1128]/40 pt-1">
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  SSL encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
