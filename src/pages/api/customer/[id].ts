import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (id) return res.status(400).end(`Customer id not founded.`);

  if (req.method === "GET") {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (customer) return res.status(200).json(customer);

    return res.status(404).json({ error: "Customer not found" });
  } else if (req.method === "PUT") {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { name },
    });

    return res.status(200).json(updatedCustomer);
  } else if (req.method === "DELETE") {
    await prisma.customer.delete({ where: { id } });
    return res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
