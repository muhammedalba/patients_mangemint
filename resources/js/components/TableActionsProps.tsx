import { memo } from 'react';
import { Link as InertiaLink } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Pencil, Eye, Trash2 } from 'lucide-react';

import { usePermission } from '@/hooks/use-permission';
import ConfirmDialog from './ConfirmDialog';
import { IconTooltip } from './IconToolTip';

interface TableActionsProps {
    item: {
        id: number;
    };
    routes: {
        edit?: string;
        view?: string;
        delete?: string;
    };
    showEdit?: boolean;
    showView?: boolean;
    showDelete?: boolean;
    confirmMessage?: string;
    onDelete?: (id: number) => void;
    isDeleting?: boolean;
}

function TableActions({
    item,
    routes,
    showEdit = true,
    showView = true,
    showDelete = true,
    confirmMessage = 'Are you sure you want to delete this item?',
    onDelete,
    isDeleting=false,
}: TableActionsProps) {
    const { canDelete } = usePermission();

    return (
        <div className="flex items-start gap-2 px-2 py-1">
            
            {/* Edit */}
            {showEdit && routes.edit && (
                <IconTooltip label="تعديل">
                    <InertiaLink
                        href={isDeleting ? '#' : route(routes.edit, item.id)}
                        className="rounded-md p-1.5 text-slate-600 transition
                                   hover:bg-indigo-50 hover:text-indigo-600
                                   focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        aria-label="Edit"
                    >
                        <Pencil className=" text-blue-400 hover:text-blue-600 transition-colors" size={20} />
                    </InertiaLink>
                </IconTooltip>
            )}

            {/* View */}
            {showView && routes.view && (
                <IconTooltip label="عرض">
                    <InertiaLink
                        href={isDeleting ? '#' : route(routes.view, item.id)}
                        className="rounded-md p-1.5 text-slate-600 transition
                                   hover:bg-sky-50 hover:text-sky-600
                                   focus:outline-none focus:ring-2 focus:ring-sky-300"
                        aria-label="View"
                    >
                        <Eye className=" text-green-400 hover:text-green-600 transition-colors" size={20} />
                    </InertiaLink>
                </IconTooltip>
            )}

            {/* Delete */}
            {showDelete && canDelete && routes.delete && onDelete && (
                <ConfirmDialog
                
                    title="تأكيد الحذف"
                    description={confirmMessage}
                    onConfirm={() => onDelete(item.id)}
                >
                    <IconTooltip label="حذف">
                        <button
                        disabled={isDeleting}
                            type="button"
                            className="rounded-md p-1.5 text-rose-600 transition
                                       hover:bg-rose-50 hover:text-rose-700
                                       focus:outline-none focus:ring-2 focus:ring-rose-300"
                            aria-label="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                    </IconTooltip>
                </ConfirmDialog>
            )}
        </div>
    );
}

export default memo(TableActions);
