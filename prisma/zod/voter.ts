import * as z from "zod"
import { CompleteLeader, relatedLeaderSchema } from "./index"

export const voterSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  nationalId: z.string(),
  school: z.string(),
  township: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  leaderId: z.string().nullish(),
})

export interface CompleteVoter extends z.infer<typeof voterSchema> {
  Leader?: CompleteLeader | null
}

/**
 * relatedVoterSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVoterSchema: z.ZodSchema<CompleteVoter> = z.lazy(() => voterSchema.extend({
  Leader: relatedLeaderSchema.nullish(),
}))
