import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    FaArchive,
    FaCalendarAlt,
    FaChartBar,
    FaChartPie,
    FaFileMedical,
    FaHospitalUser,
    FaLayerGroup,
    FaMoneyBill,
    FaReceipt,
    FaSyringe,
    FaTags,
    FaTooth,
    FaUserMd,
} from 'react-icons/fa';
import AppLogo from './app-logo';

type Role = 'admin' | 'doctor' | 'reception';

type NavItem = {
    title: string;
    href: string | ReturnType<typeof dashboard>;
    icon?: React.ElementType;
    color?: string;
    roles?: Role[];
};
type PageAuthProps = {
    auth: {
        user: {
            roles: Role[];
        };
    };
};

const mainNavItems: NavItem[] = [
    {
        title: 'جدول اليوم',
        href: '/today',
        icon: FaChartPie,
        color: 'red',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'المستخدمون',
        href: '/users',
        icon: FaUserMd,
        color: 'blue',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'المرضى',
        href: '/patients',
        icon: FaHospitalUser,
        color: 'green',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'المواعيد',
        href: '/appointments',
        icon: FaCalendarAlt,
        color: 'orange',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'الإجراءات',
        href: '/procedures',
        icon: FaSyringe,
        color: 'indigo',
        roles: ['admin', 'doctor', 'reception'],
    },
        {
        title: 'الدفعات',
        href: '/payments',
        icon: FaMoneyBill,
        color: 'yellow',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'السجلات الطبية',
        href: '/medical-records',
        icon: FaFileMedical,
        color: 'violet',
        roles: ['admin', 'doctor', 'reception'],
    },
    {
        title: 'المصروفات',
        href: '/expenses',
        icon: FaReceipt,
        color: 'purple',
        roles: ['admin'],
    },
    {
        title: 'فئات المصروفات',
        href: '/expense-categories',
        icon: FaTags,
        color: 'red',
        roles: ['admin'],
    },
    {
        title: 'الخدمات الطبية',
        href: '/services',
        icon: FaUserMd,
        color: 'green',
        roles: ['admin', 'doctor'],
    },
    {
        title: 'فئات الخدمات الطبية',
        href: '/service-categories',
        icon: FaLayerGroup,
        color: 'lime',
        roles: ['admin', 'doctor'],
    },
        {
        title: 'الأسنان',
        href: '/teeth',
        icon: FaTooth,
        color: 'blue',
    },
    {
        title: 'الإحصائيات',
        href: dashboard(),
        icon: FaChartBar,
        color: 'fuchsia',
        roles: ['admin'],
    },
    {
        title: 'إغلاق الشهر',
        href: '/month-closures',
        icon: FaArchive,
        color: 'purple',
        roles: ['admin'],
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageAuthProps>().props;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (!item.roles) return true;

        return item.roles.some((role) => auth.user.roles.includes(role));
    });

    return (
        <Sidebar collapsible="icon" variant="inset" dir="rtl">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
