import React, { useState } from "react";
import Navbar from "../Components/Navbar.tsx";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type CalendarProps = {
  year: number;
  month: number;
  highlights?: Record<number, string>;
};

const Calendar: React.FC<CalendarProps> = ({ year, month, highlights = {} }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days: (number | null)[] = Array(firstDay).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (days.length < 35) days.push(null);

  return (
      <div className="bg-[#181F36] rounded-lg p-6 w-72 shadow-md">
        <div className="text-center text-[#B6C2E2] font-semibold mb-2">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#B6C2E2]">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          {days.map((day, i) => {
            let style = "";
            if (day && highlights[day]) style = highlights[day];
            return (
                <span key={i} className={`py-1 ${style}`}>
              {day || ""}
            </span>
            );
          })}
        </div>
      </div>
  );
};

const EventPage: React.FC = () => {
  const [leftYear, setLeftYear] = useState(2024);
  const [leftMonth, setLeftMonth] = useState(6); // July (0-based)

  const handlePrev = () => {
    let newMonth = leftMonth - 1;
    let newYear = leftYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setLeftMonth(newMonth);
    setLeftYear(newYear);
  };

  const handleNext = () => {
    let newMonth = leftMonth + 1;
    let newYear = leftYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setLeftMonth(newMonth);
    setLeftYear(newYear);
  };

  // Example highlights for demo
  const highlights1 = {
    6: "bg-[#FFD600] text-black font-bold rounded-full",   // yellow
    15: "bg-[#00CFFF] text-white font-bold rounded-full",  // blue
    25: "bg-[#FF3B3B] text-white font-bold rounded-full"   // red
  };
  const highlights2 = {
    9: "bg-[#00CFFF] text-white font-bold rounded-full"
  };

  // Calculate right calendar's month/year
  let rightMonth = leftMonth + 1;
  let rightYear = leftYear;
  if (rightMonth > 11) {
    rightMonth = 0;
    rightYear += 1;
  }

  return (
      <div className="min-h-screen bg-[#0A1128] text-white font-sans pb-12 pt-8">
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <div className="text-center mt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-lg text-[#B6C2E2] max-w-2xl mx-auto">
            Explore the cosmos with our exciting events. From stargazing nights to expert talks, there's something for everyone.
          </p>
        </div>

        {/* Notification Box */}
        <div className="max-w-4xl mx-auto mt-8 border-2 border-[#00CFFF] rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 bg-[#10162A] shadow-md relative" style={{boxShadow: "0 0 0 2px #00CFFF"}}>
          <div className="flex-1">
            <div className="font-semibold text-base">Stay Notified</div>
            <div className="text-[#B6C2E2] text-xs">Never miss a celestial event. Subscribe to get reminders for upcoming events.</div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex gap-2">
              <input
                  type="email"
                  placeholder="Enter Your e-mail"
                  className="px-4 py-2 rounded bg-[#181F36] text-white border border-[#2A3147] focus:outline-none flex-1"
              />
              <button className="bg-white text-black font-semibold px-4 py-2 rounded">Subscribe</button>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#B6C2E2]">
              <span>Alert Preferences:</span>
              <label className="flex items-center gap-1">
                <input type="checkbox" className="accent-[#FFD600]" defaultChecked />
                1 day before
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" className="accent-[#FFD600]" />
                1 hour before
              </label>
            </div>
          </div>
        </div>

        {/* Calendars */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-10">
          <button className="text-3xl text-[#B6C2E2] px-2" onClick={handlePrev}>&#60;</button>
          <Calendar year={leftYear} month={leftMonth} highlights={highlights1} />
          <Calendar year={rightYear} month={rightMonth} highlights={highlights2} />
          <button className="text-3xl text-[#B6C2E2] px-2" onClick={handleNext}>&#62;</button>
        </div>

        {/* Event Cards */}
        <div className="max-w-5xl mx-auto mt-12 flex flex-col gap-6">
          {/* Special Event Card */}
          <div className="border-2 border-[#FFD600] rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 bg-[#10162A] shadow-md">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">Solar Eclipse Viewing</span>
                <span className="bg-[#FFD600] text-black px-3 py-1 rounded-full text-xs font-semibold">Special Event</span>
              </div>
              <div className="text-[#B6C2E2] text-sm mt-1">
                Explore the cosmos with our exciting events. From stargazing nights to expert talks, there's something for everyone.
              </div>
              <div className="text-[#00CFFF] text-sm mt-2 font-semibold">
                July 11, 2025 | 1:00 PM - 3:00 PM
              </div>
            </div>
            <button className="bg-[#FFD600] text-black font-bold px-8 py-2 rounded text-lg hover:bg-yellow-400 transition">Register</button>
          </div>
          {/* Blue Event Card */}
          <div className="border-2 border-[#0033FF] rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 bg-[#10162A] shadow-md">
            <div className="flex-1">
              <div className="font-bold text-lg">Solar Eclipse Viewing</div>
              <div className="text-[#B6C2E2] text-sm mt-1">
                Explore the cosmos with our exciting events. From stargazing nights to expert talks, there's something for everyone.
              </div>
              <div className="text-[#00CFFF] text-sm mt-2 font-semibold">
                July 11, 2025 | 1:00 PM - 3:00 PM
              </div>
            </div>
            <button className="bg-[#0033FF] text-white font-bold px-8 py-2 rounded text-lg hover:bg-blue-700 transition">Register</button>
          </div>
          {/* Red Event Card */}
          <div className="border-2 border-[#FF3B3B] rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 bg-[#10162A] shadow-md">
            <div className="flex-1">
              <div className="font-bold text-lg">Solar Eclipse Viewing</div>
              <div className="text-[#B6C2E2] text-sm mt-1">
                Explore the cosmos with our exciting events. From stargazing nights to expert talks, there's something for everyone.
              </div>
              <div className="text-[#00CFFF] text-sm mt-2 font-semibold">
                July 11, 2025 | 1:00 PM - 3:00 PM
              </div>
            </div>
            <button className="bg-[#FF3B3B] text-white font-bold px-8 py-2 rounded text-lg hover:bg-red-600 transition">Register</button>
          </div>
        </div>
      </div>
  );
};

export default EventPage;