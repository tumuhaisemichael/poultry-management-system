import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";  // Fixed path
import { prisma } from "../../../lib/database";  // Fixed path

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { itemName, quantity, costPerUnit, total, category, isRecurring, batchId, attachment, attachmentName } = req.body;

      // Verify user owns the batch
      const batch = await prisma.batch.findFirst({
        where: {
          id: batchId,
          userId: session.user.id,
        },
      });

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      const expense = await prisma.expense.create({
        data: {
          itemName,
          quantity,
          costPerUnit,
          total,
          category,
          isRecurring,
          batchId,
          attachment,
          attachmentName,
        },
      });

      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}