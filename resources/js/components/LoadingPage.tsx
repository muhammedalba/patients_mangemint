import React from "react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      {/* Soft medical glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @keyframes pulseGlow {
            0% { opacity: 0.4; }
            50% { opacity: 0.8; }
            100% { opacity: 0.4; }
          }
        `}
      </style>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        
        {/* Glow ring */}
        <div
          className="absolute h-64 w-64 rounded-full bg-cyan-300/20 blur-2xl"
          style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
        />

        {/* Logo */}
        <img
          src="/zirconLogo.png"
          alt="Zircon Dental Clinic"
          loading="eager"
          className="relative opacity-90"
          style={{
            animation: "float 2.5s ease-in-out infinite",
            height: 180,
            width: "auto",
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.12))",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
