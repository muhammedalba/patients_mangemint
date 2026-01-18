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

const mainNavItems: NavItem[] = [
    {
        title: 'جدول اليوم',
        href: '/today',
        icon: FaChartPie,
        color:"red",
    },
    {
        title: 'المستخدمون',
        href: '/users',
        icon: FaUserMd ,
        color:"blue",
    },
    {
        title: 'المرضى',
        href: '/patients',
        icon: FaHospitalUser,
        color:"green",
    },
    {
        title: 'الدفعات',
        href: '/payments',
        icon: FaMoneyBill,
        color:"yellow",
    },
    {
        title: 'المصروفات',
        href: '/expenses',
        icon: FaReceipt,
        color:"purple",
    },
    {
        title: 'المواعيد',
        href: '/appointments',
        icon: FaCalendarAlt,
        color:"orange",
    },
    {
        title: 'الإجراءات',
        href: '/procedures',
        icon: FaSyringe,
        color:"indigo",
    },
    {
        title: 'السجلات الطبية',
        href: '/medical-records',
        icon: FaFileMedical,
        color:"violet",
    },
    {
        title: 'الأسنان',
        href: '/teeth',
        icon: FaTooth,
        color:"blue",
    },
    {
        title: 'فئات المصروفات',
        href: '/expense-categories',
        icon: FaTags,
        color:"red",
    },
    {
        title: 'الخدمات الطبية',
        href: '/services',
        icon: FaUserMd,
        color:"green",
    },
    {
        title: 'فئات الخدمات الطبية',
        href: '/service-categories',
        icon: FaLayerGroup,
        color:"lime",
    },
    {
        title: 'الإحصائيات',
        href: dashboard(),
        icon: FaChartBar,
        color:"fuchsia",
    },
    {
        title: 'إغلاق الشهر',
        href: '/month-closures',
        icon: FaArchive,
        color:"purple",
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
