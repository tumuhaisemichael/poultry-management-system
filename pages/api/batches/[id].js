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
      let batch;
      if (session.user.role === "ADMIN") {
        batch = await prisma.batch.findUnique({
          where: {
            id,
            user: {
              id: session.user.id,
            },
          },
          include: {
            expenses: true,
            earnings: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
      } else {
        batch = await prisma.batch.findUnique({
          where: {
            id,
            userId: session.user.id,
          },
          include: {
            expenses: true,
            earnings: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
      }

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      res.status(200).json(batch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, status, startDate, endDate, notes } = req.body;
      const updatedBatch = await prisma.batch.update({
        where: {
          id,
          userId: session.user.id,
        },
        data: {
          name,
          status,
          startDate,
          endDate,
          notes,
        },
      });
      res.status(200).json(updatedBatch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.batch.delete({
        where: {
          id,
          userId: session.user.id,
        },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}