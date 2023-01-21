import {
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { TodoType } from 'types';

type Props = {
    todo: TodoType;
};

export function TodosControls({ todo }: Props) {
    return (
        <div className="flex items-center gap-2">
            <button>
                <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
            <button>
                <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button>
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
    );
}
