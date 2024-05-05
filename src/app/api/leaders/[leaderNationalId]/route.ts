import { createLeader } from "@/lib/api/leaders/mutations";
import { getLeaderByNationalId } from "@/lib/api/leaders/queries";
import { NewLeaderParams } from "@/lib/db/schema/leaders";
import { getPanamanianData } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request, { params }: { params: { leaderNationalId: string } }) {
  try {
    const { leaderNationalId } = params;
    if (!leaderNationalId) {
      return NextResponse.json({ error: "ID de Activista Vacío" }, { status: 400 });
    }

    const { leader: dbLeader } = await getLeaderByNationalId(leaderNationalId);
    if (!dbLeader) {
      const leaderCrawledData = await getPanamanianData(leaderNationalId);
      const name = leaderCrawledData.name.split(" ")[0];
      const lastName = leaderCrawledData.name.split(" ")[2];

      const data: NewLeaderParams = {
        nationalId: leaderCrawledData.nationalId,
        name: name,
        lastName: lastName,
        email: "",
      };

      const { leader: newLeader, success } = await createLeader(data);

      if (success) {
        return NextResponse.json({ leader: newLeader, success }, { status: 201 });
      }
    }

    return NextResponse.json({ leader: dbLeader, success: true }, { status: 201 });
  } catch (err) {
    console.log(err);
    if ((err as { message: string }).message === "notFoundIn3rdApp") {
      return NextResponse.json({ error: "notFoundIn3rdApp" }, { status: 400 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Error al llenar los campos de los Activistas", zodErrors: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Error Desconocido", err }, { status: 500 });
    }
  }
}

export async function GET(req: Request, { params }: { params: { leaderNationalId: string } }) {
  try {
    const { leaderNationalId } = params;
    if (!leaderNationalId) {
      return NextResponse.json({ error: "ID del Activista Vacío" }, { status: 400 });
    }

    const { leader: dbLeader } = await getLeaderByNationalId(leaderNationalId);

    if (!dbLeader) {
      return NextResponse.json({ error: "El Líder no fue encontrado" }, { status: 404 });
    }

    return NextResponse.json({ leader: dbLeader, success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Error al llenar los campos", zodErrors: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Error Desconocido", err }, { status: 500 });
    }
  }
}
