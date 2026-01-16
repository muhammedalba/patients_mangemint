import { Procedure } from '@/types';

type ToothSVGProps = {
  toothNumber: string | number;
  type: string;
  className?: string;
  onClick?: () => void;
    procedure?: Procedure | null;
};

export default function ToothSVG({
  toothNumber,
  type,
  className = '',
  onClick,
  procedure
}: ToothSVGProps) {
    console.log(
    'tooth',
    toothNumber,
    'className:',
    className,
    'includes tooth-root:',
    className?.includes('tooth-root')
  );

  return (
    <div className="tooth-wrapper"
      onClick={onClick}
    >
      <span className="tooth-number text-[10px] text-gray-600 mt-1">
        {toothNumber}
      </span>
      <svg
  width={40}
  height={60}
  viewBox="0 0 120 160"
  className={`tooth ${className ?? ""}`}
  onClick={onClick}
>
    <title > <span className='font-bold text-sm border border-gray-700'>
        {toothNumber} /
        {procedure
          ? `${procedure.name}`
          : 'سن سليم'}
    </span>
      </title>
  {type === 'incisor' && (
  <path
    d="
      M30 20
      C32 12 42 8 50 8
      C58 8 68 12 70 20
      C72 28 72 40 70 50
      C68 60 62 68 50 70
      C38 68 32 60 30 50
      C28 40 28 28 30 20
      Z

      M42 70
      C40 82 38 96 38 110
      C38 122 42 136 50 146
      C58 136 62 122 62 110
      C62 96 60 82 58 70
      Z
    "
    strokeWidth="2"
  />
)}

  {type === 'canine' && (
  <path
    d="
      M34 22
      C36 14 44 10 50 10
      C56 10 64 14 66 22
      C68 30 68 40 66 48
      C64 56 58 62 50 64
      C42 62 36 56 34 48
      C32 40 32 30 34 22
      Z

      M44 64
      C42 76 40 92 40 108
      C40 122 44 138 50 148
      C56 138 60 122 60 108
      C60 92 58 76 56 64
      Z
    "
    strokeWidth="2"
  />
)}

  {type === 'premolar' && (
  <path
    d="
      M32 30
      C34 22 44 18 50 18
      C56 18 66 22 68 30
      C70 38 70 48 68 56
      C66 64 60 70 50 72
      C40 70 34 64 32 56
      C30 48 30 38 32 30
      Z

      M40 72
      C38 82 36 92 36 102
      C36 108 38 116 42 124
      L46 132
      C48 136 50 140 50 144
      C50 140 52 136 54 132
      L58 124
      C62 116 64 108 64 102
      C64 92 62 82 60 72
      Z
    "
    strokeWidth="2"
  />
)}

  {type === 'molar' && (
  <path
    d="
      M28 36
      C30 26 42 22 50 22
      C58 22 70 26 72 36
      C74 44 74 54 72 62
      C70 70 64 78 50 80
      C36 78 30 70 28 62
      C26 54 26 44 28 36
      Z

      M36 80
      C34 90 32 100 32 108
      C32 114 34 122 38 128
      L42 136
      C44 140 46 144 46 148

      M64 80
      C66 90 68 100 68 108
      C68 114 66 122 62 128
      L58 136
      C56 140 54 144 54 148
    "
    strokeWidth="2"
  />
)}

{className?.includes('tooth-extraction') && (
  <>
    <line x1="30" y1="30" x2="90" y2="90" stroke="#e74c3c" strokeWidth="6" />
    <line x1="90" y1="30" x2="30" y2="90" stroke="#e74c3c" strokeWidth="6" />
  </>
)}
{className?.includes('tooth-filling') && (
  <circle
    cx="50"
    cy="60"
    r="9"
    fill="var(--filling-color)"
  />
)}
{className?.includes('tooth-root') && (
  <path
    d="
      M50 75
      L46 90
      L54 105
      L46 120
      L54 135
    "
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)}

{className?.includes('tooth-prosthetic') && (
    <rect
      x="30"
      y="10"
      width="40"
      height="55"
      rx="3"
    />
)}
{className?.includes('tooth-surgery') && (
    <rect
      x="40"
      y="50"
      width="20"
      height="50"
      rx="3"
    />
)}
</svg>
    </div>
  );
}
