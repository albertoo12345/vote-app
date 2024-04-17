import { voterSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getVoters } from "@/lib/api/voters/queries";


// Schema for voters - used to validate API requests
const baseSchema = voterSchema.omit(timestamps)

export const insertVoterSchema = baseSchema.omit({ id: true });
export const insertVoterParams = baseSchema.extend({
  leaderId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateVoterSchema = baseSchema;
export const updateVoterParams = updateVoterSchema.extend({
  leaderId: z.coerce.string().min(1)
})
export const voterIdSchema = baseSchema.pick({ id: true });

// Types for voters - used to type API request params and within Components
export type Voter = z.infer<typeof voterSchema>;
export type NewVoter = z.infer<typeof insertVoterSchema>;
export type NewVoterParams = z.infer<typeof insertVoterParams>;
export type UpdateVoterParams = z.infer<typeof updateVoterParams>;
export type VoterId = z.infer<typeof voterIdSchema>["id"];
    
// this type infers the return from getVoters() - meaning it will include any joins
export type CompleteVoter = Awaited<ReturnType<typeof getVoters>>["voters"][number];

