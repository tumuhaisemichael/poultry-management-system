import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";  // Fixed path
import { prisma } from "../../../lib/database";  // Fixed path

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { itemName, quantity, costPerUnit, total, category, isRecurring } = req.body;

      // Verify user owns the expense
      const expense = await prisma.expense.findFirst({
        where: {
          id,
          batch: {
            userId: session.user.id,
          },
        },
      });

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: {
          itemName,
          quantity,
          costPerUnit,
          total,
          category,
          isRecurring,
        },
      });

      res.status(200).json(updatedExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      // Verify user owns the expense
      const expense = await prisma.expense.findFirst({
        where: {
          id,
          batch: {
            userId: session.user.id,
          },
        },
      });

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      await prisma.expense.delete({
        where: { id },
      });

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}