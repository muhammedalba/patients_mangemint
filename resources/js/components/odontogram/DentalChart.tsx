import { Procedure } from '@/types';
import ToothSVG from './ToothSvg';
import { memo, useCallback } from 'react';

interface Props {
    teeth: any[];
    getToothClasses: (toothNumber: number) => string; // Fixed return type to string based on usage
    getLastProcedure: (toothNumber: number) => Procedure | null;
    onToothSelect: (toothNumber: number) => void;
}

const MemoizedToothSVG = memo(ToothSVG);

export default function DentalChart({
    teeth,
    getToothClasses,
    getLastProcedure,
    onToothSelect,
}: Props) {
    type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';

    const getToothType = useCallback((toothNumber: string): ToothType => {
        const position = parseInt(toothNumber[1], 10);
        if (position <= 2) return 'incisor';
        if (position === 3) return 'canine';
        if (position <= 5) return 'premolar';
        return 'molar';
    }, []);

    // Handling data preparation
    const upperRight = teeth.filter((t) => t.tooth_number.startsWith('1')).sort((a, b) => Number(a.tooth_number) - Number(b.tooth_number));
    const upperLeft = teeth.filter((t) => t.tooth_number.startsWith('2')).sort((a, b) => Number(b.tooth_number) - Number(a.tooth_number));
    const lowerRight = teeth.filter((t) => t.tooth_number.startsWith('4')).sort((a, b) => Number(a.tooth_number) - Number(b.tooth_number));
    const lowerLeft = teeth.filter((t) => t.tooth_number.startsWith('3')).sort((a, b) => Number(b.tooth_number) - Number(a.tooth_number));

    return (
        <div className="dental-chart flex flex-col gap-8 py-8 select-none">

            {/* Upper Jaw */}
            <div className="flex justify-center gap-1 md:gap-2">
                {/* Quadrant 2 (Upper Left from Dr perspective, Right on screen) - effectively 28->21 */}
                <div className="flex gap-2 md:gap-4">
                     {upperLeft.map((tooth) => (
                        <MemoizedToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.tooth_number)}
                            className={getToothClasses(Number(tooth.tooth_number))}
                            onClick={() => onToothSelect(Number(tooth.tooth_number))}
                            procedure={getLastProcedure(Number(tooth.tooth_number))}
                        />
                     ))}
                </div>

                <div className="w-px bg-slate-200 mx-2 h-16 self-center" />

                {/* Quadrant 1 (Upper Right from Dr perspective, Left on screen) - effectively 11->18 */}
                <div className="flex gap-2 md:gap-4">
                    {upperRight.map((tooth) => (
                        <MemoizedToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.tooth_number)}
                            className={getToothClasses(Number(tooth.tooth_number))}
                            onClick={() => onToothSelect(Number(tooth.tooth_number))}
                            procedure={getLastProcedure(Number(tooth.tooth_number))}
                        />
                    ))}
                </div>
            </div>

            {/* Middle Divider */}
            <div className="relative flex items-center justify-center my-2">
                 <div className="absolute w-3/4 border-t border-slate-100" />
                 <span className="relative bg-white px-2 text-xs text-slate-300 font-mono">LINGUAL</span>
            </div>

            {/* Lower Jaw */}
            <div className="flex justify-center gap-1 md:gap-2 lower-jaw mb-10">
                {/* Quadrant 3 (Lower Left from Dr perspective) - effectively 38->31 */}
                 <div className="flex gap-2 md:gap-4">
                    {lowerLeft.map((tooth) => (
                        <MemoizedToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.tooth_number)}
                            className={getToothClasses(Number(tooth.tooth_number))}
                            onClick={() => onToothSelect(Number(tooth.tooth_number))}
                            procedure={getLastProcedure(Number(tooth.tooth_number))}
                        />
                    ))}
                </div>

                <div className="w-px bg-slate-200 mx-2 h-16 self-center" />

                {/* Quadrant 4 (Lower Right from Dr perspective) - effectively 41->48 */}
                <div className="flex gap-2 md:gap-4 px-1">
                     {lowerRight.map((tooth) => (
                        <MemoizedToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.tooth_number)}
                            className={getToothClasses(Number(tooth.tooth_number))}
                            onClick={() => onToothSelect(Number(tooth.tooth_number))}
                            procedure={getLastProcedure(Number(tooth.tooth_number))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
