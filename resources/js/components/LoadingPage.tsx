import React from "react"

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fffffff5]">

      <style>
        {`
          @keyframes wave {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      <img
        src="zirconLogo.png"
        alt="Clinic Logo"
        loading="eager"            
        className="opacity-80"
        style={{
          animation: "wave 2.2s ease-in-out infinite",
          filter: "drop-shadow(0 0 10px #bfb7b7fe)",
          willChange: "transform",
          height: 200,
          width:400
        }}
      />

    </div>
  )
}
