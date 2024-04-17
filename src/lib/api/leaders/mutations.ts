import { db } from "@/lib/db/index";
import {
  LeaderId,
  NewLeaderParams,
  UpdateLeaderParams,
  updateLeaderSchema,
  insertLeaderSchema,
  leaderIdSchema,
} from "@/lib/db/schema/leaders";

export const createLeader = async (leader: NewLeaderParams) => {
  const newLeader = insertLeaderSchema.parse(leader);
  try {
    const l = await db.leader.create({ data: newLeader });
    return { leader: l, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLeader = async (
  id: LeaderId,
  leader: UpdateLeaderParams
) => {
  const { id: leaderId } = leaderIdSchema.parse({ id });
  const newLeader = updateLeaderSchema.parse(leader);
  try {
    const l = await db.leader.update({
      where: { id: leaderId },
      data: newLeader,
    });
    return { leader: l, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLeader = async (id: LeaderId) => {
  const { id: leaderId } = leaderIdSchema.parse({ id });
  try {
    const l = await db.leader.delete({ where: { id: leaderId } });
    return { leader: l, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
