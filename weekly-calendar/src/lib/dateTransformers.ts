import type { Day } from "../types/days"

export const transformDayToNumber =(day: Day): number => {
    switch(day) {
        case 'Vasárnap':
            return 0;
        case 'Hétfő':
            return 1;
        case 'Kedd':
            return 2;
        case 'Szerda':
            return 3;
        case 'Csütörtök':
            return 4;
        case 'Péntek':
            return 5;
        case 'Szombat':
            return 6;
        default:
            return -1;
    }
}