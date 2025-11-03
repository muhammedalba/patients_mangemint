import { Link as InertiaLink } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ConfirmDialog from './ConfirmDialog';

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
}

export default function TableActions({
  item,
  routes,
  showEdit = true,
  showView = true,
  showDelete = true,
  confirmMessage = 'Are you sure you want to delete this item?',
  onDelete,
}: TableActionsProps) {
  return (
    <div className="flex gap-2 px-2 py-1 text-center">
      {showEdit && routes.edit && (
        <InertiaLink
          href={route(routes.edit, item.id)}
          className="text-xs font-bold text-gray-700"
        >
          <i className="material-icons">edit</i>
        </InertiaLink>
      )}

      {showView && routes.view && (
        <InertiaLink
          href={route(routes.view, item.id)}
          className="text-xs font-bold text-blue-500"
        >
          <i className="material-icons">visibility</i>
        </InertiaLink>
      )}

      {showDelete && routes.delete && onDelete && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={() => onDelete(item.id)}
          trigger={
            <button className="cursor-pointer text-xs font-bold text-red-500">
              <i className="material-icons">delete</i>
            </button>
          }
        />
      )}
    </div>
  );
}
