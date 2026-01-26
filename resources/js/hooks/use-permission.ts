import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;

    const hasRole = (roles: string | string[]) => {
        const rolesToCheck = Array.isArray(roles) ? roles : [roles];
        return rolesToCheck.some((role) => auth.user.roles.includes(role));
    };

    const canDelete = hasRole(['doctor', 'admin']);

    return { hasRole, canDelete };
}
