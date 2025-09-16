import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { earningId } = req.query;

    if (!earningId) {
      return res.status(400).json({ error: 'Earning ID is required' });
    }

    try {
      const subtractions = await prisma.earningSubtraction.findMany({
        where: {
          earningId: earningId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(subtractions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subtractions' });
    }
  } else if (req.method === 'POST') {
    const { amount, reason, earningId } = req.body;

    if (!earningId || !amount || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const newSubtraction = await prisma.earningSubtraction.create({
        data: {
          amount: parseFloat(amount),
          reason,
          earningId: earningId,
        },
      });
      res.status(201).json(newSubtraction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subtraction' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
