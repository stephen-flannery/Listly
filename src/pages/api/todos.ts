// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const todos = await prisma.todo.findMany();
                return res.status(200).json(todos);
            } catch (error) {
                return res.status(500).send({
                    error: error || 'An issue occured while getting todos',
                });
            }
        case 'POST':
            try {
                const newTodo = await prisma.todo.create({
                    data: req.body,
                });
                return res.status(200).json(newTodo);
            } catch (error) {
                console.error(error);
                return res.status(500).send({
                    error: error || 'An issue occured while getting todos',
                });
            }
        case 'DELETE':
            try {
                //
                return null;
            } catch (error) {
                //
            }
        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
