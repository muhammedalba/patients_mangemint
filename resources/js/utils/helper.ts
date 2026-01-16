export const TOOTH_TREATMENT_STYLES: Record<string, string> = {
    checkup: 'tooth-checkup',
    cleaning: 'tooth-cleaning',
    filling: 'tooth-filling',
    root: 'tooth-root',
    extraction: 'tooth-extraction',
    prosthetic: 'tooth-prosthetic',
    surgery: 'tooth-surgery',
};

// الفئات البصرية (لا تتغير)
export type TreatmentCategory =
    | 'extraction'
    | 'root'
    | 'filling'
    | 'prosthetic'
    | 'surgery'
    | 'default';

export type RootTreatmentType =
    | 'vital'
    | 'necrotic'
    | 'pulpotomy'
    | 'retreatment';

export type ProstheticTreatmentType =
    | 'khazaf'
    | 'zircon'
    | 'emax'
    | 'venner'
    | 'casted'
    | 'cadcam';

export type FillingTreatmentType =
    | 'light'
    | 'metal'
    | 'cosmetic'
    | 'directvenner'
    | 'child'
    | 'withcast';

// الربط بين الاسم والفئة
export const TREATMENT_NAME_TO_CATEGORY: Record<string, TreatmentCategory> = {
    // قلع
    'قلع عادي': 'extraction',
    'قلع جراحي': 'extraction',
    'قلع أطفال': 'extraction',

    // جراحة
    زراعة: 'surgery',

    // لبية
    'معالجة جذور لب حي': 'root',
    'معالجة جذور لب عفنة': 'root',
    'معالجة جذور أطفال بتر لب': 'root',
    'معالجة جذور إعادة معالجة': 'root',

    // ترميميات
    'حشوة ضوئية': 'filling',
    'حشوة تجميلية': 'filling',
    'Direct venner': 'filling',
    'حشوة أطفال': 'filling',
    'حشوة معدنية': 'filling',
    'وتد+حشوة': 'filling',

    // تعويضات
    'تاج خزف': 'prosthetic',
    'تاج زيركون': 'prosthetic',
    'تاج emax': 'prosthetic',
    venner: 'prosthetic',
    'وتد مصبوب casted post': 'prosthetic',
    'تاج cad-cam': 'prosthetic',
};

export const TREATMENT_NAME_TO_ROOT_TYPE: Record<string, RootTreatmentType> = {
    'معالجة جذور لب حي': 'vital',
    'معالجة جذور لب عفنة': 'necrotic',
    'معالجة جذور أطفال بتر لب': 'pulpotomy',
    'معالجة جذور إعادة معالجة': 'retreatment',
};
export const TREATMENT_NAME_TO_PROSTHETIC_TYPE: Record<
    string,
    ProstheticTreatmentType
> = {
    'تاج خزف': 'khazaf',
    'تاج زيركون': 'zircon',
    'تاج emax': 'emax',
    venner: 'venner',
    'وتد مصبوب': 'casted',
    'تاج cad-cam': 'cadcam',
};
export const TREATMENT_NAME_TO_FILLING_TYPE: Record<
    string,
    FillingTreatmentType
> = {
    'حشوة ضوئية': 'light',
    'حشوة معدنية': 'metal',
    'حشوة تجميلية': 'cosmetic',
    'Direct venner': 'directvenner',
    'حشوة أطفال': 'child',
    'وتد+حشوة': 'withcast',
};
// ربط الفئة بالكلاس
export const TREATMENT_CATEGORY_STYLES: Record<TreatmentCategory, string> = {
    extraction: 'tooth-extraction',
    root: 'tooth-root',
    filling: 'tooth-filling',
    prosthetic: 'tooth-prosthetic',
    surgery: 'tooth-surgery',
    default: 'tooth-default',
};
//ربط معالجات الجذور
export const ROOT_TREATMENT_STYLES: Record<RootTreatmentType, string> = {
    vital: 'vital',
    necrotic: 'necrotic',
    pulpotomy: 'pulpotomy',
    retreatment: 'retreatment',
};

export const PROSTHETIC_TREATMENT_STYLES: Record<
    ProstheticTreatmentType,
    string
> = {
    khazaf: 'khazaf',
    zircon: 'zircon',
    emax: 'emax',
    venner: 'venner',
    casted: 'casted',
    cadcam: 'cadcam',
};
export const FILLING_TREATMENT_STYLES: Record<FillingTreatmentType, string> = {
    light: 'light',
    metal: 'metal',
    cosmetic: 'cosmetic',
    directvenner: 'directvenner',
    child: 'child',
    withcast: 'withcast',
};

export function getTreatmentStyleFromName(treatmentName: string): string {
    const category = TREATMENT_NAME_TO_CATEGORY[treatmentName] ?? 'default';

    if (category === 'root') {
        const rootType = TREATMENT_NAME_TO_ROOT_TYPE[treatmentName];

        if (rootType) {
            return `tooth-root ${ROOT_TREATMENT_STYLES[rootType]}`;
        }
    }

    if (category === 'prosthetic') {
        const prostheticType = TREATMENT_NAME_TO_PROSTHETIC_TYPE[treatmentName];

        if (prostheticType) {
            return `tooth-prosthetic ${PROSTHETIC_TREATMENT_STYLES[prostheticType]}`;
        }
    }

    if (category === 'filling') {
        const fillingType = TREATMENT_NAME_TO_FILLING_TYPE[treatmentName];

        if (fillingType) {
            return `tooth-filling ${FILLING_TREATMENT_STYLES[fillingType]}`;
        }
    }

    return TREATMENT_CATEGORY_STYLES[category];
}
