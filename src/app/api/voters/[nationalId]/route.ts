import { createVoter } from "@/lib/api/voters/mutations";
import { getVoterById, getVoterByNationalId } from "@/lib/api/voters/queries";
import { NewVoterParams } from "@/lib/db/schema/voters";
import { getPanamanianData } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request, context: { params: { nationalId: string } }) {
  try {
    const { nationalId } = context.params;
    const { leaderId } = (await req.json()) as { leaderId: string };

    if (!nationalId) {
      return NextResponse.json({ error: "Cédula Invalida" }, { status: 400 });
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
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}
