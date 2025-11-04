import React from "react"

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#a8a2a2ba]">
      <div className=" w-64 h-16 relative">
        <svg
          viewBox="0 0 240 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[150px] h-[75px] m-auto"
        >
          <path
            d="
       M 0 50
      L 60 50
      L 70 20
      L 80 70
      L 90 40
      L 100 50
      L 165 50
      L 170 0
      L 180 100
      L 190 40
      L 200 50
      L 300 50

    "
            className="stroke-[#fc4c56] fill-none stroke-[9] "
            style={{
              strokeDasharray: "500",
              strokeDashoffset: "500",
              animation: "draw 0.7s linear infinite",
              zIndex: "20",
            }}
          />
          <svg
            viewBox="0 0 240 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[150px] h-[75px] m-auto z-2"
          >
            <path
              d="
       M 0 50
      L 60 50
      L 70 20
      L 80 70
      L 90 40
      L 100 50
      L 165 50
      L 170 0
      L 180 100
      L 190 40
      L 200 50
      L 300 50
    "
              className="stroke-[#ccc8c856] fill-none stroke-[9]
              "
            />
          </svg>
        </svg>
      </div>
    </div>
  )
}
