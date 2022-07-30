import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  let userid;

  if (session.user.userLevel == "role-hcvd7ol5qnpscw") {
    userid = session.user.id;
  } else if (session.user.userLevel == "role-hcvd2swl5wiuit9") {
    let u;

    u = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        childRelation: {
          select: {
            parrentRelation: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    console.log(u.childRelation[0].parrentRelation.id_u);

    userid = u.childRelation[0].parrentRelation.id;
  }

  if (req.method === "GET") {
    const role = await prisma.role.findMany({
      where : {
        id_u : {
          not : 'role-hcvd7ol5qnpscw'
        }
      }
    });

    res.status(200).json({ ok: true, role: role });
  }

  const disconnect = await prisma.$disconnect();

  res.end();
}
