"use server";

import { revalidatePath } from "next/cache";
import {
  createVoter,
  deleteVoter,
  updateVoter,
} from "@/lib/api/voters/mutations";
import {
  VoterId,
  NewVoterParams,
  UpdateVoterParams,
  voterIdSchema,
  insertVoterParams,
  updateVoterParams,
} from "@/lib/db/schema/voters";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVoters = () => revalidatePath("/voters");

export const createVoterAction = async (input: NewVoterParams) => {
  try {
    const payload = insertVoterParams.parse(input);
    await createVoter(payload);
    revalidateVoters();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVoterAction = async (input: UpdateVoterParams) => {
  try {
    const payload = updateVoterParams.parse(input);
    await updateVoter(payload.id, payload);
    revalidateVoters();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVoterAction = async (input: VoterId) => {
  try {
    const payload = voterIdSchema.parse({ id: input });
    await deleteVoter(payload.id);
    revalidateVoters();
  } catch (e) {
    return handleErrors(e);
  }
};