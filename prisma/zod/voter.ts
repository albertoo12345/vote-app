import * as z from "zod"
import { CompleteLeader, relatedLeaderSchema } from "./index"

export const voterSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  nationalId: z.string(),
  school: z.string(),
  township: z.string(),
  leaderId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteVoter extends z.infer<typeof voterSchema> {
  leader: CompleteLeader
}

/**
 * relatedVoterSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVoterSchema: z.ZodSchema<CompleteVoter> = z.lazy(() => voterSchema.extend({
  leader: relatedLeaderSchema,
}))
