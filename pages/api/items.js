import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/database";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          batch: {
            userId: session.user.id,
          },
        },
        select: {
          itemName: true,
        },
        distinct: ['itemName'],
      });

      const earnings = await prisma.earning.findMany({
        where: {
          batch: {
            userId: session.user.id,
          },
        },
        select: {
          itemName: true,
        },
        distinct: ['itemName'],
      });

      const expenseItems = expenses.map(e => e.itemName);
      const earningItems = earnings.map(e => e.itemName);

      const allItems = [...new Set([...expenseItems, ...earningItems])];

      res.status(200).json(allItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
