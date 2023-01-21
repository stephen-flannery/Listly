import { useUser } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function fetchTodos({ userId }: { userId?: string }) {
    try {
        const res = await axios.get(`/api/todos/`, {
            data: {
                author: userId,
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default function useTodos({
    userId,
    initialData,
}: {
    userId?: string;
    initialData?: any;
}) {
    const user = useUser();

    return useQuery(['todos'], () => fetchTodos({ userId }), {
        enabled: !!userId,
        initialData,
    });
}
