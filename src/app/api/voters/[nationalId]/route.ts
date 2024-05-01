import { getLeaderById, getLeaders } from "@/lib/api/leaders/queries";
import { createVoter } from "@/lib/api/voters/mutations";
import { getVoterById, getVoterByNationalId } from "@/lib/api/voters/queries";
import { NewVoterParams } from "@/lib/db/schema/voters";
import { getPanamanianData } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request, context: { params: { nationalId: string } }) {
  try {
    const { nationalId } = context.params;
    if (!nationalId) {
      return NextResponse.json({ error: "Cédula Invalida" }, { status: 400 });
    }

    let { leaderId } = (await req.json()) as { leaderId: string };
    if (leaderId === "noExist") {
      const { leaders } = await getLeaders();
      const noExistLeader = leaders.filter((leader) => leader.name === "noExist");

      leaderId = noExistLeader[0].id;
    }

    const { leader } = await getLeaderById(leaderId);
    if (!leader) {
      return NextResponse.json({ error: "El Lider no existe" }, { status: 400 });
    }

    const { voter: dbVoter } = await getVoterByNationalId(nationalId);

    if (!dbVoter) {
      const voterCrawledData = await getPanamanianData(nationalId);
      const name = voterCrawledData.name.split(" ")[0];
      const lastName = voterCrawledData.name.split(" ")[2];

      const data: NewVoterParams = {
        nationalId: voterCrawledData.nationalId,
        name: name,
        lastName: lastName,
        township: voterCrawledData.township,
        school: voterCrawledData.school,
        desk: voterCrawledData.desk,
        leaderId,
      };
      const { voter: newVoter, success } = await createVoter(data);

      if (success) {
        return NextResponse.json({ voter: newVoter, success }, { status: 201 });
      }
    } else {
      return NextResponse.json({ error: "El votante ya existe" }, { status: 400 });
    }
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Error al llenar los campos", zodErrors: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Error Desconocido", err }, { status: 500 });
    }
  }
}

export async function GET(req: Request, context: { params: { nationalId: string } }) {
  try {
    const { nationalId } = context.params;
    if (!nationalId) {
      return NextResponse.json({ error: "Cédula Invalida" }, { status: 400 });
    }

    const { voter } = await getVoterByNationalId(nationalId);

    if (voter) {
      return NextResponse.json({ voter }, { status: 200 });
    } else {
      return NextResponse.json({ error: "El votante no existe" }, { status: 400 });
    }
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Error al llenar los campos", zodErrors: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Error Desconocido", err }, { status: 500 });
    }
  }
}
