import { db } from "@/lib/db/index";
import { type VoterId, voterIdSchema } from "@/lib/db/schema/voters";

export const getVoters = async () => {
  const v = await db.voter.findMany({ include: { leader: true } });
  return { voters: v };
};

export const getVoterById = async (id: VoterId) => {
  const { id: voterId } = voterIdSchema.parse({ id });
  const v = await db.voter.findFirst({
    where: { id: voterId },
    include: { leader: true },
  });
  return { voter: v };
};
export const getVoterByNationalId = async (nationalId: string) => {
  const v = await db.voter.findFirst({
    where: { nationalId },
    include: { leader: true },
  });
  return { voter: v };
};
