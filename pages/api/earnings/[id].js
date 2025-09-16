import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/database";  // Fixed path

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const {
        itemName, quantity, amountPerUnit, total, category,
        transactionDate
      } = req.body;

      // Verify user owns the earning
      const earning = await prisma.earning.findFirst({
        where: {
          id,
          batch: {
            userId: session.user.id,
          },
        },
      });

      if (!earning) {
        return res.status(404).json({ error: "Earning not found" });
      }

      const updatedEarning = await prisma.earning.update({
        where: { id },
        data: {
          itemName,
          quantity,
          amountPerUnit,
          total,
          category,
          transactionDate: transactionDate ? new Date(transactionDate) : null,
        },
      });

      res.status(200).json(updatedEarning);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      // Verify user owns the earning
      const earning = await prisma.earning.findFirst({
        where: {
          id,
          batch: {
            userId: session.user.id,
          },
        },
      });

      if (!earning) {
        return res.status(404).json({ error: "Earning not found" });
      }

      await prisma.earning.delete({
        where: { id },
      });

      res.status(200).json({ message: "Earning deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}