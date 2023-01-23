import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { TodoType } from 'types';
import { TodosControls } from './TodosControls';

type Props = {
    todo: TodoType;
    isChecked?: boolean;
    handleSelected: (id: string) => void;
    isUpdatingProp?: boolean;
};

export default function TodosItem({
    todo,
    isChecked = false,
    handleSelected,
    isUpdatingProp = false,
}: Props) {
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(isUpdatingProp);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentText, setCurrentText] = useState(todo.text);

    useEffect(() => {
        setIsUpdating(isUpdatingProp);
    }, [isUpdatingProp]);

    useEffect(() => {
        if (!isEditing || !inputRef?.current) return;

        inputRef.current.focus();
    }, [isEditing]);

    function handleEdit() {
        setIsEditing(true);
    }

    function handleDoubleClick(e: MouseEvent) {
        e.preventDefault();
        setIsEditing(true);
    }

    function handleSave() {
        updateTodoMutation.mutate({ id: todo.id, text: currentText });
    }

    //
    //
    //
    //
    async function deleteTodo({ id }: { id: string }) {
        const res = axios.delete('/api/todos', {
            data: {
                id,
            },
        });

        return res;
    }

    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsDeleting(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsDeleting(false);
        },
        onSuccess: (data, variables, context) => {
            const { data: deletedTodo } = data;
            // Boom baby!
            setIsDeleting(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsDeleting(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleDelete() {
        deleteTodoMutation.mutate({
            id: todo.id,
        });
    }

    //
    //
    //
    //

    async function doneTodo({ id }: { id: string }) {
        const res = axios.patch(`/api/todos`, {
            id,
            isCompleted: true,
        });

        return res;
    }

    const doneTodoMutation = useMutation({
        mutationFn: doneTodo,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsUpdating(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsUpdating(false);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsUpdating(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsUpdating(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleDone() {
        doneTodoMutation.mutate({
            id: todo.id,
        });
    }

    //
    //
    //
    //

    async function undoneTodo({ id }: { id: string }) {
        const res = axios.patch(`/api/todos`, {
            id,
            isCompleted: false,
        });

        return res;
    }

    const undoneTodoMutation = useMutation({
        mutationFn: undoneTodo,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsUpdating(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsUpdating(false);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsUpdating(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsUpdating(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleUndone() {
        undoneTodoMutation.mutate({
            id: todo.id,
        });
    }

    //
    //
    //
    //

    async function updateTodo({ id, text }: { id: string; text: string }) {
        const res = axios.patch(`/api/todos`, {
            id,
            text,
        });

        return res;
    }

    const updateTodoMutation = useMutation({
        mutationFn: updateTodo,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsUpdating(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsUpdating(false);
            // TODO - display error
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsUpdating(false);
            setIsEditing(false);
            // console.log({ data, variables, context });
            // queryClient.setQueryData(['todos'], (old) =>
            //     old.filter((todo: TodoType) => todo.id !== deletedTodo.id)
            // );
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    return (
        <div
            className={`relative p-4 border-t border-gray-300 text-gray-800 flex items-center gap-6 hover:bg-gray-50 ${
                isChecked ? 'bg-blue-100' : 'bg-white'
            } group ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
            key={todo.id}
        >
            {isUpdating && (
                <div className="absolute top-0 left-0 h-full w-full bg-white/70 z-10 flex items-center justify-center">
                    <span className="text-lg text-gray-700">Updating...</span>
                </div>
            )}
            {isEditing ? (
                <>
                    <div className="w-full pl-8 flex items-center gap-8">
                        <textarea
                            id="todoText"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            defaultValue={todo.text}
                            ref={inputRef}
                            onChange={(e) => setCurrentText(e.target.value)}
                        />
                        <button
                            className="inline-flex items-center gap-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </>
            ) : (
                <>
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
                    <div
                        className={`relative w-full select-none ${
                            todo.isCompleted ? 'opacity-50' : 'opacity-100'
                        }`}
                        onDoubleClick={handleDoubleClick}
                        tabIndex={0}
                    >
                        {todo.isCompleted && (
                            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-900 -translate-y-1/2" />
                        )}
                        <span className="">{todo.text}</span>
                    </div>

                    <div className="ml-auto opacity-1 group-hover:opacity-100">
                        <TodosControls
                            todo={todo}
                            handleEdit={handleEdit}
                            handleDone={handleDone}
                            handleUndone={handleUndone}
                            handleDelete={handleDelete}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
