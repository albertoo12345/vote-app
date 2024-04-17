import * as z from "zod";
import { CompleteVoter, relatedVoterSchema } from "./index";

export const leaderSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  nationalId: z.string(),
  email: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteLeader extends z.infer<typeof leaderSchema> {
  voters: CompleteVoter[];
}

/**
 * relatedLeaderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedLeaderSchema: z.ZodSchema<CompleteLeader> = z.lazy(() =>
  leaderSchema.extend({
    voters: relatedVoterSchema.array(),
  })
);
