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
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}