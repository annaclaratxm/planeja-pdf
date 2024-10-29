import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const customers = await prisma.customer.findMany();
    return res.status(200).json(customers);
  } else if (req.method === "POST") {
    const { name, phone, email, birthdate } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "E-mail is required" });
    }
    if (!birthdate) {
      return res.status(400).json({ error: "Birthdate is required" });
    }

    const newCustomer = await prisma.customer.create({
      data: { name, phone, email, birthdate },
    });
    return res.status(201).json(newCustomer);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
