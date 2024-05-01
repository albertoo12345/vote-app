import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createVoter, deleteVoter, updateVoter } from "@/lib/api/voters/mutations";
import { voterIdSchema, insertVoterParams, updateVoterParams } from "@/lib/db/schema/voters";
import { CheerioCrawler, Dataset, RequestQueue } from "crawlee";

export async function GET(req: Request) {
  try {
    const crawler = new CheerioCrawler({
      async requestHandler({ $, request }) {
        const title = $("title").text();
        console.log(`The title of "${request.url}" is: ${title}.`);
      },
    });

    // Start the crawler with the provided URLs
    const result = await crawler.run(["https://crawlee.dev"]);
    console.log(result);
    const form = new FormData();
    form.append("cedula", "8-970-599");
    const res = await fetch("https://verificate.votopanama.net/search.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: form,
    });

    const data = await res.text();
    console.log(res);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request) {
  try {
    const validatedData = insertVoterParams.parse(await req.json());
    const { success } = await createVoter(validatedData);

    revalidatePath("/voters"); // optional - assumes you will have named route same as entity

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

    const validatedData = updateVoterParams.parse(await req.json());
    const validatedParams = voterIdSchema.parse({ id });

    const { success } = await updateVoter(validatedParams.id, validatedData);

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

    const validatedParams = voterIdSchema.parse({ id });
    const { success } = await deleteVoter(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
