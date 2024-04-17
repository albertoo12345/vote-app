import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLeader,
  deleteLeader,
  updateLeader,
} from "@/lib/api/leaders/mutations";
import { 
  leaderIdSchema,
  insertLeaderParams,
  updateLeaderParams 
} from "@/lib/db/schema/leaders";

export async function POST(req: Request) {
  try {
    const validatedData = insertLeaderParams.parse(await req.json());
    const { success } = await createLeader(validatedData);

    revalidatePath("/leaders"); // optional - assumes you will have named route same as entity

    return NextResponse.json(success, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateLeaderParams.parse(await req.json());
    const validatedParams = leaderIdSchema.parse({ id });

    const { success } = await updateLeader(validatedParams.id, validatedData);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = leaderIdSchema.parse({ id });
    const { success } = await deleteLeader(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
