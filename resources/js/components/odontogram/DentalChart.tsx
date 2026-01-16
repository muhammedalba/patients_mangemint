import { Procedure } from '@/types';
import ToothSVG from './ToothSvg';

interface Props {
    teeth: any[];
    getToothClasses: (toothNumber: number) => string[];
    onToothClick: (tooth: any) => void;
    getLastProcedure: (toothNumber: number) => Procedure | null;
    onToothSelect: (toothNumber: number) => void;
}

export default function DentalChart({
    teeth,
    getToothClasses,
    onToothClick,
    getLastProcedure,
    onToothSelect,
}: Props) {
    type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';
    function getToothType(toothNumber: string): ToothType {
        const position = parseInt(toothNumber[1], 10);
        if (position <= 2) return 'incisor';
        if (position === 3) return 'canine';
        if (position <= 5) return 'premolar';
        return 'molar';
    }

    const upperRight = teeth.filter((t) => t.tooth_number.startsWith('1'));
    const upperLeft = teeth.filter((t) => t.tooth_number.startsWith('2'));
    const lowerRight = teeth.filter((t) => t.tooth_number.startsWith('4'));
    const lowerLeft = teeth.filter((t) => t.tooth_number.startsWith('3'));

    // الفك العلوي
    upperRight.sort((a, b) => Number(a.tooth_number) - Number(b.tooth_number)); // 18 → 11
    upperLeft.sort((a, b) => Number(b.tooth_number) - Number(a.tooth_number)); // 21 → 28

    // الفك السفلي
    lowerRight.sort((a, b) => Number(a.tooth_number) - Number(b.tooth_number)); // 48 → 41
    lowerLeft.sort((a, b) => Number(b.tooth_number) - Number(a.tooth_number)); // 31 → 38

    return (
        <div className="dental-chart mt-8 flex flex-col gap-4">
            <div className="row upper flex justify-center gap-2">
                {upperLeft.map((tooth) => (
                    <div className="tooth-cell">
                        <ToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.status)}
                            className={getToothClasses(tooth.tooth_number)}
                            onClick={() => onToothSelect(tooth.tooth_number)}
                            procedure={getLastProcedure(tooth.tooth_number)}
                        />
                    </div>
                ))}
                <div className="w-4" />

                {upperRight.map((tooth) => (
                    <div className="tooth-cell">
                        <ToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            mirror
                            type={getToothType(tooth.status)}
                            className={getToothClasses(tooth.tooth_number)}
                            onClick={() => onToothSelect(tooth.tooth_number)}
                            procedure={getLastProcedure(tooth.tooth_number)}
                        />
                    </div>
                ))}
            </div>
            <div className="row upper flex justify-center gap-2">
                {lowerLeft.map((tooth) => (
                  <div className="tooth-cell lower">
                        <ToothSVG
                            key={tooth.tooth_number}
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            type={getToothType(tooth.status)}
                            className={getToothClasses(tooth.tooth_number)}
                            onClick={() => onToothSelect(tooth.tooth_number)}
                            procedure={getLastProcedure(tooth.tooth_number)}
                        />
                    </div>
                ))}
                <div className="w-4" />
                {lowerRight.map((tooth) => (
                    <div className="tooth-cell lower">
                        <ToothSVG
                            tooth={tooth}
                            toothNumber={tooth.tooth_number}
                            mirror
                            type={getToothType(tooth.status)}
                            className={getToothClasses(tooth.tooth_number)}
                            onClick={() => onToothSelect(tooth.tooth_number)}
                            procedure={getLastProcedure(tooth.tooth_number)}
                        />
                    </div>
                ))}
            </div>

             <div className="divider vertical" />
  <div className="divider horizontal" />
        </div>
    );
}
