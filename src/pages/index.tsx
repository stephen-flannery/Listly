import Head from 'next/head';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Todos } from '@features/todos';

export default function Home() {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const [email, setEmail] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let { data, error } = await supabaseClient.auth.signInWithOtp({
            email: email,
        });
    }

    return (
        <>
            <Head>
                <title>Listly</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-screen overflow-hidden">
                <div className="w-full max-w-4xl mx-auto h-full flex flex-col relative">
                    <div className="pt-6 px-6 pb-2 sticky top-0 left-0 z-50 bg-white">
                        <h1 className="text-3xl text-gray-700">Listly</h1>
                    </div>
                    {user ? (
                        <Todos />
                    ) : (
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            className="flex flex-col gap-6 bg-gray-300 py-2 px-2 rounded"
                        >
                            <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-200"
                                />
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 text-blue-50 border border-blue-50 leading-normal py-1 px-4 rounded-full hover:bg-blue-700"
                                    type="submit"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return {
        props: {},
    };
};
