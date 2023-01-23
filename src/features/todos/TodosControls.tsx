import {
    ArrowPathIcon,
    CheckIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { TodoType } from 'types';
import * as Tooltip from '@radix-ui/react-tooltip';

type Props = {
    todo: TodoType;
    handleEdit: () => void;
    handleUndone: () => void;
    handleDone: () => void;
    handleDelete: () => void;
};

export function TodosControls({
    todo,
    handleEdit,
    handleUndone,
    handleDone,
    handleDelete,
}: Props) {
    const queryClient = useQueryClient();

    return (
        <div className="relative flex items-center gap-2">
            <Tooltip.Provider delayDuration={150}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        {todo.isCompleted ? (
                            <button
                                onClick={handleUndone}
                                className="text-gray-700 hover:text-white hover:bg-orange-500 rounded p-1"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleDone}
                                className="text-gray-700 hover:text-white hover:bg-green-500 rounded p-1"
                            >
                                <CheckIcon className="h-5 w-5" />
                            </button>
                        )}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="rounded px-2 py-4 leading-none bg-gray-50 shadow-lg select-none relative text-xs text-gray-600 font-semibold"
                            sideOffset={5}
                        >
                            Mark as{' '}
                            {todo.isCompleted ? 'not completed' : 'completed'}
                            <Tooltip.Arrow className="fill-gray-50 w-4 h-2" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider delayDuration={150}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <button
                            onClick={handleEdit}
                            className="text-gray-700 hover:text-white hover:bg-blue-500 rounded p-1"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="rounded px-2 py-4 leading-none bg-gray-50 shadow-lg select-none relative text-xs text-gray-600 font-semibold"
                            sideOffset={5}
                        >
                            Edit
                            <Tooltip.Arrow className="fill-gray-50 w-4 h-2" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider delayDuration={150}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <button
                            onClick={handleDelete}
                            className="text-gray-700 hover:text-white hover:bg-red-500 rounded p-1"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="rounded px-2 py-4 leading-none bg-gray-50 shadow-lg select-none relative text-xs text-gray-600 font-semibold"
                            sideOffset={5}
                        >
                            Delete
                            <Tooltip.Arrow className="fill-gray-50 w-4 h-2" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
}
