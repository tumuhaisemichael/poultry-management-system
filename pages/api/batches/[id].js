import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/database";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      let batch = await prisma.batch.findUnique({
        where: {
          id,
          userId: session.user.id,
        },
        include: {
          expenses: true,
          earnings: true,
          user: { select: { name: true, email: true } },
        },
      });

      if (!batch && session.user.role === 'ADMIN') {
        // If batch not found for user, and user is admin, try finding by id alone
        batch = await prisma.batch.findUnique({
          where: { id },
          include: {
            expenses: true,
            earnings: true,
            user: { select: { name: true, email: true } },
          },
        });
      }

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // If there are earnings, fetch their subtractions separately
      if (batch.earnings && batch.earnings.length > 0) {
        const earningIds = batch.earnings.map(e => e.id);

        const subtractions = await prisma.earningSubtraction.findMany({
          where: { earningId: { in: earningIds } },
        });

        const subtractionsByEarningId = subtractions.reduce((acc, sub) => {
          if (!acc[sub.earningId]) {
            acc[sub.earningId] = [];
          }
          acc[sub.earningId].push(sub);
          return acc;
        }, {});

        batch.earnings.forEach(earning => {
          earning.subtractions = subtractionsByEarningId[earning.id] || [];
        });
      }

      res.status(200).json(batch);
    } catch (error) {
      console.error("Error fetching batch:", error);
      res.status(500).json({ error: "An error occurred while fetching batch details." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}