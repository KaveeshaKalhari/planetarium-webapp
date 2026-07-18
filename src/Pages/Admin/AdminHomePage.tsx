import { useEffect, useState, type FC } from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar.tsx";

const LandingPage: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,17,40,0.7), rgba(10,17,40,0.7)), url('/src/assets/planetarium-AI.png')",
      }}
    >
      <UserNavbar />

      {/* Hero heading */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          marginBottom: 20,
          position: "relative",
          zIndex: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-24px)",
          transition:
            "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(2rem,5vw,3.5rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.04em",
            margin: "0 0 2px",
          }}
        >
          Administrative <span style={{ color: "#219EBC" }}>Access</span>
        </h1>
        <p
          style={{
            color: "rgba(203,213,225,0.8)",
            fontSize: "1rem",
            fontWeight: 300,
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Management and control panel for authorized personnel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
        {/* Admin Dashboard Card - Centered below */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#001F54] to-[#034078] border-2 border-[#1282A2]/30 rounded-xl p-8 hover:border-[#1282A2] hover:shadow-2xl transition-all">
            <div className="bg-[#1282A2]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-[#1282A2]" />
            </div>
            <h3 className="text-2xl font-bold text-[#FEFCFB] mb-3">
              Admin Dashboard
            </h3>
            <p className="text-[#FEFCFB]/90 mb-6 leading-relaxed">
              Access the comprehensive administrative control panel to manage
              bookings, shows, revenue analytics, blog moderation, and chat
              monitoring.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-[#FEFCFB]/80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                View and manage booking analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                Control show availability and schedules
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                Track revenue and financial reports
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                Moderate blog posts and community chat
              </li>
            </ul>
            <Link
              to="/admin-dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1282A2] hover:bg-[#FEFCFB] hover:text-[#034078] text-white rounded-lg transition-all font-semibold shadow-lg w-full justify-center"
            >
              <Shield className="w-5 h-5" />
              Access Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
