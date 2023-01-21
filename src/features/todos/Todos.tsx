import { useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { TodoType } from 'types';
import { TodosAdd } from './TodosAdd';
import { TodosControls } from './TodosControls';
import { TodosToolbar } from './TodosToolbar';
import useTodos from './useTodos';

export function Todos() {
    const queryClient = useQueryClient();
    const user = useUser();
    const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        isSuccess,
        isLoading,
        isError,
        data: todos,
        error,
    } = useTodos({
        userId: user?.id,
    });

    function handleSelected(id: string) {
        // Todo - add shift and control to multi select
        if (!selectedTodos.find((checkedTodo) => checkedTodo === id)) {
            setSelectedTodos((prevState) => [...prevState, id]);
        } else {
            console.log(id);
            setSelectedTodos((prevState) => [
                ...prevState.filter((checkedTodo) => checkedTodo !== id),
            ]);
        }
    }

    async function deleteTodos({ todos }: { todos: string[] }) {
        if (!user) throw new Error('No user found');

        const res = axios.delete('/api/todos', {
            data: {
                todos,
            },
        });

        return res;
    }

    const deleteTodosMutation = useMutation({
        mutationFn: deleteTodos,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsDeleting(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsDeleting(false);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsDeleting(false);
            setSelectedTodos([]);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsDeleting(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleDelete() {
        deleteTodosMutation.mutate({
            todos: selectedTodos,
        });
    }

    return (
        <div className="flex-1 h-full flex flex-col overflow-hidden">
            <div>
                <TodosToolbar
                    hasSelection={selectedTodos?.length > 0}
                    handleClick={handleDelete}
                />
            </div>

            {isSuccess && (
                <div className="overflow-y-auto flex flex-col-reverse relative flex-1 hidden-scrollbar">
                    <ul className="px-4">
                        {todos.map((todo: TodoType) => {
                            const isChecked: boolean = !!selectedTodos.find(
                                (selectedTodo) => selectedTodo === todo.id
                            );

                            return (
                                <li
                                    className={`relative p-4 border-t border-gray-300 text-gray-800 flex items-center gap-6 z-10 hover:shadow-lg hover:z-20 ${
                                        isChecked ? 'bg-blue-100' : 'bg-white'
                                    } group`}
                                    key={todo.id}
                                >
                                    <div className="flex items-center">
                                        <input
                                            id="default-checkbox"
                                            type="checkbox"
                                            value={todo.id}
                                            checked={isChecked}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={() => {
                                                handleSelected(todo.id);
                                            }}
                                        />
                                    </div>

                                    <span className="">{todo.text}</span>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100">
                                        <TodosControls todo={todo} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            <div className="p-6 border-t border-gray-300 bg-white">
                <TodosAdd />
            </div>
        </div>
    );
}
