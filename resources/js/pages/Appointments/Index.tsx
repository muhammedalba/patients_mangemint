import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Appointment, PageProps, PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import Pagination from '@/components/Pagination';
import { MoreHorizontal } from 'lucide-react';
import { route } from 'ziggy-js';

const StatusBadge = ({ status }: { status: Appointment['status'] }) => {
    const statusClasses = {
        scheduled: 'bg-blue-500',
        completed: 'bg-green-500',
        canceled: 'bg-red-500',
    };
    return (
        <Badge className={`${statusClasses[status]} text-white`}>
            {status}
        </Badge>
    );
};

export default function Index({
    appointments,
}: PageProps<{ appointments: PaginatedData<Appointment> }>) {
    console.log(appointments, 'appointments.data');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            router.delete(route('appointments.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Appointments</CardTitle>
                    <Button asChild>
                        <Link href={route('appointments.create')}>
                            Add Appointment
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Patient
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Doctor
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Procedure
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.data.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appointment.patient?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.doctor?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.procedure?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(appointment.appointment_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.times?.join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <StatusBadge status={appointment.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('appointments.edit', appointment.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(appointment.id)} className="text-red-600">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    </div>
                    <Pagination links={appointments.links} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
