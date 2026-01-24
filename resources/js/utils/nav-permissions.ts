import type { NavItem } from '@/types';

type Role = 'admin' | 'doctor' | 'receptionist';

export function filterNavByRole(
    items: NavItem[],
    userRoles: Role[]
): NavItem[] {
    return items.filter(item => {
        if (!item.roles || item.roles.length === 0) return true;

        return item.roles.some(role => userRoles.includes(role));
    });
}
