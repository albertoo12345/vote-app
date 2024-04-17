"use server";

import { revalidatePath } from "next/cache";
import {
  createLeader,
  deleteLeader,
  updateLeader,
} from "@/lib/api/leaders/mutations";
import {
  LeaderId,
  NewLeaderParams,
  UpdateLeaderParams,
  leaderIdSchema,
  insertLeaderParams,
  updateLeaderParams,
} from "@/lib/db/schema/leaders";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLeaders = () => revalidatePath("/leaders");

export const createLeaderAction = async (input: NewLeaderParams) => {
  try {
    const payload = insertLeaderParams.parse(input);
    await createLeader(payload);
    revalidateLeaders();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLeaderAction = async (input: UpdateLeaderParams) => {
  try {
    const payload = updateLeaderParams.parse(input);
    await updateLeader(payload.id, payload);
    revalidateLeaders();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLeaderAction = async (input: LeaderId) => {
  try {
    const payload = leaderIdSchema.parse({ id: input });
    await deleteLeader(payload.id);
    revalidateLeaders();
  } catch (e) {
    return handleErrors(e);
  }
};