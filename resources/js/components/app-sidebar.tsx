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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    FaCalendarAlt,
    FaChartPie,
    FaFileMedical,
    FaHospitalUser,
    FaLayerGroup,
    FaMoneyBill,
    FaSyringe,
    FaTooth,
    FaUserMd,
} from 'react-icons/fa';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard(),
        icon: FaChartPie,
    },
    {
        title: 'المستخدمون',
        href: '/users',
        icon: FaUserMd,
    },
    {
        title: 'المرضى',
        href: '/patients',
        icon: FaHospitalUser,
    },
    {
        title: 'الدفعات',
        href: '/payments',
        icon: FaMoneyBill,
    },
    {
        title: 'المواعيد',
        href: '/appointments',
        icon: FaCalendarAlt,
    },
    {
        title: 'الإجراءات',
        href: '/procedures',
        icon: FaSyringe,
    },
    {
        title: 'السجلات الطبية',
        href: '/medical-records',
        icon: FaFileMedical,
    },
    {
        title: 'الأسنان',
        href: '/teeth',
        icon: FaTooth,
    },
    {
        title: 'الخدمات الطبية',
        href: '/services',
        icon: FaUserMd,
    },
    {
        title: 'فئات الخدمات الطبية',
        href: '/service-categories',
        icon: FaLayerGroup,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
