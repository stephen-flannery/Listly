import { useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TodoType } from 'types';
import { TodosAdd } from './TodosAdd';
import { TodosToolbar } from './TodosToolbar';
import useTodos from './useTodos';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import TodosItem from './TodosItem';

export function Todos() {
    const queryClient = useQueryClient();
    const user = useUser();
    const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [parent] = useAutoAnimate<HTMLUListElement>();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingTodos, setUpdatingTodos] = useState<string[]>([]);
    const [selectedOnlyCompletedTodos, setSelectedOnlyCompletedTodos] =
        useState(false);

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
            setSelectedTodos((prevState) => [
                ...prevState.filter((checkedTodo) => checkedTodo !== id),
            ]);
        }
    }

    useEffect(() => {
        if (!todos) return;

        if (!selectedTodos?.length) return setSelectedOnlyCompletedTodos(false);

        const detailedSelectedTodos = todos.filter((todo: TodoType) =>
            selectedTodos.includes(todo.id),
        );

        const incompletedTodos = detailedSelectedTodos.filter(
            (detailedSelectedTodo: TodoType) =>
                detailedSelectedTodo.isCompleted === false,
        );

        const hasIncompletedTodos = incompletedTodos?.length > 0;

        if (hasIncompletedTodos) {
            return setSelectedOnlyCompletedTodos(false);
        } else {
            return setSelectedOnlyCompletedTodos(true);
        }
    }, [selectedTodos, todos]);

    //
    //
    // Multi delete todos
    //
    //

    async function deleteTodos({ ids }: { ids: string[] }) {
        const deletes = ids.map(async (id: string) => {
            try {
                const res = await axios.delete(`/api/todos`, {
                    data: { id },
                });
                return res;
            } catch (error) {
                return error;
            }
        });

        try {
            const res = await Promise.all(deletes);

            return res;
        } catch (error) {
            return error;
        }
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
            setSelectedOnlyCompletedTodos(false);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsDeleting(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleDeleteClick() {
        console.log(selectedTodos);
        deleteTodosMutation.mutate({
            ids: selectedTodos,
        });
    }

    //
    //
    // Multi done todos
    //
    //

    async function doneTodos({ ids }: { ids: string[] }) {
        const updates = ids.map(async (id: string) => {
            try {
                const res = await axios.patch(`/api/todos`, {
                    id,
                    isCompleted: true,
                });
                return res;
            } catch (error) {
                return error;
            }
        });

        try {
            const res = await Promise.all(updates);

            return res;
        } catch (error) {
            return error;
        }
    }

    const doneTodosMutation = useMutation({
        mutationFn: doneTodos,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsUpdating(true);
            setUpdatingTodos(variables.ids);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsUpdating(false);
            setUpdatingTodos([]);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsUpdating(false);
            setUpdatingTodos([]);
            setSelectedTodos([]);
            setSelectedOnlyCompletedTodos(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsUpdating(false);
            setUpdatingTodos([]);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleDoneClick() {
        doneTodosMutation.mutate({ ids: selectedTodos });
    }

    //
    //
    // Multi undone todos
    //
    //

    async function undoneTodos({ ids }: { ids: string[] }) {
        const updates = ids.map(async (id: string) => {
            try {
                const res = await axios.patch(`/api/todos`, {
                    id,
                    isCompleted: false,
                });
                return res;
            } catch (error) {
                return error;
            }
        });

        try {
            const res = await Promise.all(updates);

            return res;
        } catch (error) {
            return error;
        }
    }

    const undoneTodosMutation = useMutation({
        mutationFn: undoneTodos,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsUpdating(true);
            setUpdatingTodos(variables.ids);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsUpdating(false);
            setUpdatingTodos([]);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsUpdating(false);
            setUpdatingTodos([]);
            setSelectedTodos([]);
            setSelectedOnlyCompletedTodos(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsUpdating(false);
            setUpdatingTodos([]);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleUndoneClick() {
        undoneTodosMutation.mutate({ ids: selectedTodos });
    }

    return (
        <div className="flex-1 h-full flex flex-col overflow-hidden">
            <div className="mb-2">
                <TodosToolbar
                    hasSelection={selectedTodos?.length > 0}
                    // handleClick={handleDelete}
                    handleDeleteClick={handleDeleteClick}
                    handleDoneClick={handleDoneClick}
                    handleUndoneClick={handleUndoneClick}
                    selectedOnlyCompletedTodos={selectedOnlyCompletedTodos}
                />
            </div>

            <div className="overflow-y-auto flex flex-col-reverse relative flex-1 hidden-scrollbar">
                <ul className="px-4" ref={parent}>
                    {isLoading && (
                        <>
                            {[...Array(15).keys()].map((item) => (
                                <li key={item}>
                                    <div className="p-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-full" />
                                    </div>
                                </li>
                            ))}
                        </>
                    )}
                    {isSuccess && (
                        <>
                            {todos
                                .filter((todo: TodoType) => !todo.isCompleted)
                                .map((todo: TodoType) => {
                                    return (
                                        <li key={todo.id}>
                                            <TodosItem
                                                todo={todo}
                                                isChecked={selectedTodos.includes(
                                                    todo.id,
                                                )}
                                                handleSelected={handleSelected}
                                                isUpdatingProp={updatingTodos.includes(
                                                    todo.id,
                                                )}
                                            />
                                        </li>
                                    );
                                })}
                            {todos
                                .filter((todo: TodoType) => todo.isCompleted)
                                .map((todo: TodoType) => {
                                    return (
                                        <li key={todo.id}>
                                            <TodosItem
                                                todo={todo}
                                                isChecked={selectedTodos.includes(
                                                    todo.id,
                                                )}
                                                handleSelected={handleSelected}
                                                isUpdatingProp={updatingTodos.includes(
                                                    todo.id,
                                                )}
                                            />
                                        </li>
                                    );
                                })}
                        </>
                    )}
                </ul>
            </div>
            <div className="p-6 border-t border-gray-300 bg-white">
                <TodosAdd />
            </div>
        </div>
    );
}
