import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getShowById } from "../services/api";
import {
  Info,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { BookingStepper } from "../components/BookingStepper";

interface Seat {
  id: string;
  row: string;
  number: number;
  angle: number;
  radius: number;
  status: "available" | "selected" | "booked";
}

const ROW_CONFIG = [
  { label: "A", count: 20, radius: 260 },
  { label: "B", count: 24, radius: 232 },
  { label: "C", count: 28, radius: 204 },
  { label: "D", count: 32, radius: 176 },
  { label: "E", count: 36, radius: 148 },
  { label: "F", count: 40, radius: 120 },
  { label: "G", count: 44, radius: 92 },
];

function buildSeats(
  bookedSeatIds: string[],
  preSelectedSeatIds: string[] = [],
): Seat[] {
  const bookedSet = new Set(bookedSeatIds);
  const preSelectedSet = new Set(preSelectedSeatIds);
  return ROW_CONFIG.flatMap((row) => {
    const angleStep = 360 / row.count;
    return Array.from({ length: row.count }, (_, i) => {
      const seatId = `${row.label}${i + 1}`;
      const isBooked = bookedSet.has(seatId);
      return {
        id: seatId,
        row: row.label,
        number: i + 1,
        angle: i * angleStep - 90,
        radius: row.radius,
        status: isBooked
          ? "booked"
          : preSelectedSet.has(seatId)
            ? "selected"
            : "available",
      };
    });
  });
}

export function SeatSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showId: number = location.state?.showId;
  const showDetails = location.state?.showDetails;
  const schoolInfo = location.state?.schoolInfo;
  const preSelectedSeatIds: string[] = location.state?.preSelectedSeatIds ?? [];

  const [seats, setSeats] = useState<Seat[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [recentlySelected, setRecentlySelected] = useState<string | null>(null);

  const eventDetails = {
    title:
      showDetails?.title ||
      showDetails?.audienceType ||
      "Journey Through the Cosmos",
    date: showDetails?.showDate || "—",
    time: showDetails?.showTime === "morning" ? "10:00 AM" : "03:00 PM",
    language: showDetails?.language || "English",
    pricePerSeat:
      showDetails?.pricePerSeat ??
      (showDetails?.audienceType === "School Program" ? 150.0 : 250.0),
  };

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 80);
    if (!showId) return;
    getShowById(showId)
      .then((show) =>
        setSeats(buildSeats(show.bookedSeatIds ?? [], preSelectedSeatIds)),
      )
      .catch(console.error);
  }, [showId]);

  const handleSeatClick = (seatId: string) => {
    setSeats(
      seats.map((seat) => {
        if (seat.id === seatId && seat.status !== "booked")
          return {
            ...seat,
            status: seat.status === "selected" ? "available" : "selected",
          };
        return seat;
      }),
    );
    setRecentlySelected(seatId);
    setTimeout(() => setRecentlySelected(null), 550);
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.length * eventDetails.pricePerSeat;

  const getSeatColor = (status: string) => {
    switch (status) {
      case "available":
        return "#1E6B8C";
      case "selected":
        return "#F59E0B";
      case "booked":
        return "#DC2626";
      default:
        return "#1E6B8C";
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigate("/review-order", {
        state: {
          showId,
          selectedSeats: selectedSeats.map((s) => s.id),
          showDetails,
          pricePerSeat: eventDetails.pricePerSeat,
          schoolInfo,
        },
      });
    }
  };

  // Map center and size — fits laptop without scroll
  const MAP_SIZE = 430;
  const CENTER = MAP_SIZE / 2;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F0F4F8]">
      {/* ── Compact Header ── */}
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
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/select-datetime")}
                  className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 mr-2 transition-all active:scale-95"
                  title="Back to Home"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-xs font-semibold tracking-widest text-[#219EBC] uppercase">
                  Step 2 of 4
                </span>
                <span className="mx-3 text-white/20">|</span>
                <h1 className="text-lg font-bold">Choose Your Seats</h1>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="ml-auto px-3 py-1.5 border border-[#1282A2]/60 text-[#219EBC] hover:bg-[#1282A2]/20 rounded-lg transition-all duration-150 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="shrink-0">
        <BookingStepper currentStep={2} />
      </div>

      {/* ── Main Content ── */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-full max-w-7xl mx-auto px-4 py-3 flex gap-4">
          {/* ── Seat Map ── */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex flex-col p-3">
            <div className="text-center mb-1">
              <p className="text-xs font-semibold text-[#0A1128]">
                Planetarium Dome
              </p>
              <p className="text-[10px] text-[#0A1128]/40">
                Best viewing: Rows D, E, F
              </p>
            </div>

            {/* Map */}
            <div className="flex-1 flex items-center justify-center">
              <div
                className="relative"
                style={{ width: MAP_SIZE + "px", height: MAP_SIZE + "px" }}
              >
                {/* Orbit rings */}
                {[0.95, 0.84, 0.73, 0.62, 0.51, 0.4, 0.3].map((r, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-[#1282A2]/06 pointer-events-none"
                    style={{
                      width: MAP_SIZE * r + "px",
                      height: MAP_SIZE * r + "px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  />
                ))}

                {/* Central dome */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1282A2]/30 via-[#034078]/20 to-[#001F54]/10 border-2 border-[#1282A2]/50">
                      <div className="absolute inset-2 rounded-full border border-[#1282A2]/25" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[#1282A2]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 2v4m0 12v4M2 12h4m12 0h4"
                        />
                      </svg>
                      <div className="text-[7px] font-bold text-[#1282A2] mt-0.5">
                        DOME
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entrance */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                  <div className="w-10 h-px bg-[#1282A2]/60" />
                  <div className="text-[8px] font-bold text-[#1282A2]/60 tracking-widest">
                    ENTRANCE
                  </div>
                </div>

                {/* Seats */}
                {seats.map((seat) => {
                  const r = seat.radius * 0.82;
                  const x = CENTER + r * Math.cos((seat.angle * Math.PI) / 180);
                  const y = CENTER + r * Math.sin((seat.angle * Math.PI) / 180);
                  const isRecent = recentlySelected === seat.id;
                  const isSelected = seat.status === "selected";
                  const isBooked = seat.status === "booked";

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={isBooked}
                      className={`absolute group disabled:cursor-not-allowed ${isRecent ? "seat-pop" : ""}`}
                      style={{
                        left: x + "px",
                        top: y + "px",
                        transform: "translate(-50%,-50%)",
                        zIndex: isSelected ? 5 : 1,
                      }}
                      title={`${seat.id} — ${seat.status}`}
                    >
                      {isRecent && isSelected && (
                        <div
                          className="pulse-ring absolute rounded-full border-2 border-amber-400 pointer-events-none"
                          style={{
                            width: "16px",
                            height: "16px",
                            top: "-1px",
                            left: "-1px",
                          }}
                        />
                      )}
                      <svg width="11" height="11" viewBox="0 0 20 20">
                        {isSelected && (
                          <filter id={`g-${seat.id}`}>
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        )}
                        <rect
                          x="2"
                          y="6"
                          width="16"
                          height="12"
                          rx="2"
                          fill={getSeatColor(seat.status)}
                          stroke={
                            isSelected
                              ? "#FDE68A"
                              : isBooked
                                ? "none"
                                : "rgba(255,255,255,0.1)"
                          }
                          strokeWidth={isSelected ? "1.5" : "0.8"}
                          filter={isSelected ? `url(#g-${seat.id})` : undefined}
                        />
                        <rect
                          x="4"
                          y="4"
                          width="12"
                          height="3"
                          rx="1.5"
                          fill={getSeatColor(seat.status)}
                          opacity={isBooked ? 0.7 : 1}
                        />
                      </svg>
                      {!isBooked && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0A1128] px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 text-white z-50">
                          {seat.id}
                          {isSelected ? " ✓" : ""}
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Row labels */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  {["A", "B", "C", "D", "E", "F", "G"].map((label, index) => {
                    const radius = (260 - index * 28 + 16) * 0.82;
                    const angle = -96;
                    const x = radius * Math.cos((angle * Math.PI) / 180);
                    const y = radius * Math.sin((angle * Math.PI) / 180);
                    return (
                      <div
                        key={label}
                        className="absolute text-[8px] font-bold text-white/80 bg-[#034078] px-1 py-0.5 rounded border border-[#1282A2]/30"
                        style={{
                          left: x + "px",
                          top: y + "px",
                          transform: "translate(-50%,-50%)",
                        }}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center items-center gap-5 pt-2 border-t border-[#E2E8F0]">
              {[
                { color: "#1E6B8C", stroke: "none", label: "Available" },
                {
                  color: "#F59E0B",
                  stroke: "#FDE68A",
                  label: "Your Selection",
                },
                { color: "#DC2626", stroke: "none", label: "Unavailable" },
              ].map(({ color, stroke, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 20 20">
                    <rect
                      x="2"
                      y="6"
                      width="16"
                      height="12"
                      rx="2"
                      fill={color}
                      stroke={stroke}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="4"
                      y="4"
                      width="12"
                      height="3"
                      rx="1.5"
                      fill={color}
                    />
                  </svg>
                  <span className="text-[10px] text-[#0A1128]/60">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Summary Panel ── */}
          <div className="w-56 flex flex-col gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-[#034078] to-[#1282A2] px-4 py-2.5">
                <h3 className="font-bold text-white text-sm">
                  Booking Summary
                </h3>
              </div>
              <div className="p-4 flex flex-col flex-1">
                {/* Selected seats */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#0A1128]/60">
                      Selected Seats
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedSeats.length > 0 ? "bg-amber-100 text-amber-700" : "bg-[#F1F5F9] text-[#0A1128]/40"}`}
                    >
                      {selectedSeats.length}
                    </span>
                  </div>
                  {selectedSeats.length > 0 ? (
                    <div className="bg-[#F8FAFC] rounded-lg p-2 max-h-24 overflow-y-auto border border-[#E2E8F0]">
                      <div className="flex flex-wrap gap-1">
                        {selectedSeats.map((seat) => (
                          <div
                            key={seat.id}
                            className="seat-tag bg-amber-400 text-amber-900 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                          >
                            {seat.id}
                            <button
                              onClick={() => handleSeatClick(seat.id)}
                              className="text-amber-700 hover:text-amber-900 font-bold leading-none"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F8FAFC] rounded-lg p-3 text-center text-[10px] text-[#0A1128]/35 border border-dashed border-[#CBD5E1]">
                      Click seats on the map
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-1.5 mb-3 pb-3 border-b border-[#E2E8F0] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#0A1128]/60">Per seat</span>
                    <span className="text-[#0A1128]">
                      Rs {eventDetails.pricePerSeat.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0A1128]/60">Seats</span>
                    <span className="text-[#0A1128]">
                      × {selectedSeats.length}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-[#0A1128] text-sm">
                    Total
                  </span>
                  <span
                    className={`text-base font-bold transition-all duration-300 ${selectedSeats.length > 0 ? "text-[#1282A2]" : "text-[#0A1128]/30"}`}
                  >
                    Rs {totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="mt-auto space-y-2">
                  <button
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs
                                            ${
                                              selectedSeats.length > 0
                                                ? "shimmer-btn text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                                : "bg-[#F1F5F9] text-[#0A1128]/30 cursor-not-allowed"
                                            }`}
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate("/select-datetime", {
                        state: { showId, showDetails, schoolInfo },
                      })
                    }
                    className="w-full py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-lg transition-all duration-150 font-semibold text-xs"
                  >
                    ← Back
                  </button>
                  <p className="text-[9px] text-[#0A1128]/35 text-center">
                    Seats held for 10 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3">
              <p className="font-semibold text-[#034078] text-xs mb-1.5">
                Viewing Tips
              </p>
              <ul className="text-[10px] text-[#0A1128]/65 space-y-1">
                <li>🎯 Best: Rows D, E & F</li>
                <li>♿ Wheelchair: Row A</li>
                <li>🕐 Arrive 15 min early</li>
                <li>🔭 360° dome projection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "fadeUp 0.3s ease both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0A1128]">
                Show Information
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#0A1128]/50 hover:text-[#0A1128] transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#0A1128]/70 leading-relaxed">
              {[
                [
                  "360° Dome",
                  "Recline and look upward for a full celestial immersion.",
                ],
                [
                  "Best Seats",
                  "Rows D, E and F (center rings) offer optimal dome angles.",
                ],
                ["Capacity", "224 seats in 7 concentric circular rows."],
                ["Accessibility", "Wheelchair accessible in Row A."],
                [
                  "Cancellation",
                  "Free cancellation up to 24 hours before the show.",
                ],
              ].map(([t, b]) => (
                <p key={t}>
                  <strong className="text-[#0A1128]">{t}:</strong> {b}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
