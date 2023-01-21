import { PlusSmallIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import { useUser } from '@supabase/auth-helpers-react';

export function TodosAdd() {
    const queryClient = useQueryClient();
    const user = useUser();
    const inputRef = useRef<HTMLInputElement>(null);
    const [todoText, setTodoText] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    async function addTodo({ author, text }: { author: string; text: string }) {
        if (!user) throw new Error('No user found');

        const res = axios.post('/api/todos', {
            author: user.id,
            text: todoText,
        });

        return res;
    }

    const addTodoMutation = useMutation({
        mutationFn: addTodo,
        onMutate: (variables) => {
            // A mutation is about to happen!
            setIsAdding(true);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setIsAdding(false);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            setIsAdding(false);
            setTodoText('');

            if (inputRef?.current) {
                inputRef.current.value = '';
            }
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
            setIsAdding(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user) throw new Error('No user found');

        addTodoMutation.mutate({
            author: user.id,
            text: todoText,
        });
    }

    return (
        <div>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex items-center gap-2"
            >
                <div className="flex-1 relative">
                    {isAdding && (
                        <div className="bg-white/60 absolute top-0 left-0 w-full h-full z-10"></div>
                    )}
                    <label htmlFor="todo" className="sr-only">
                        Add Todo
                    </label>
                    <input
                        type="text"
                        id="todo"
                        name="todo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Add Todo..."
                        required
                        onChange={(e) => setTodoText(e.target.value)}
                        ref={inputRef}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5"
                    >
                        {isAdding ? (
                            <>
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Adding...
                            </>
                        ) : (
                            <>
                                <PlusSmallIcon className="w-5 h-5" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
