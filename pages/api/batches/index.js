// pages/api/batches/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../../lib/database";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      let batches;
      if (session.user.role === "ADMIN") {
        batches = await prisma.batch.findMany({
          include: {
            expenses: true,
            earnings: true,
          },
        });
      } else {
        batches = await prisma.batch.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            expenses: true,
            earnings: true,
          },
        });
      }

      res.status(200).json(batches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, startDate, notes } = req.body;

      const batch = await prisma.batch.create({
        data: {
          name,
          startDate: new Date(startDate),
          notes,
          userId: session.user.id,
        },
      });

      res.status(201).json(batch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}