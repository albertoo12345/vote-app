import { getUserByEmail } from "@/lib/api/users/queries";
import { lucia } from "@/lib/auth/lucia";
import { authenticationSchema } from "@/lib/db/schema/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  try {
    const validatedData = await authenticationSchema.parse(await req.json());
    const { user } = await getUserByEmail(validatedData.email);
    if (!user) {
      return NextResponse.json(
        {
          error: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
