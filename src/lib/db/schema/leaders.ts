import { leaderSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getLeaders } from "@/lib/api/leaders/queries";


// Schema for leaders - used to validate API requests
const baseSchema = leaderSchema.omit(timestamps)

export const insertLeaderSchema = baseSchema.omit({ id: true });
export const insertLeaderParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateLeaderSchema = baseSchema;
export const updateLeaderParams = updateLeaderSchema.extend({})
export const leaderIdSchema = baseSchema.pick({ id: true });

// Types for leaders - used to type API request params and within Components
export type Leader = z.infer<typeof leaderSchema>;
export type NewLeader = z.infer<typeof insertLeaderSchema>;
export type NewLeaderParams = z.infer<typeof insertLeaderParams>;
export type UpdateLeaderParams = z.infer<typeof updateLeaderParams>;
export type LeaderId = z.infer<typeof leaderIdSchema>["id"];
    
// this type infers the return from getLeaders() - meaning it will include any joins
export type CompleteLeader = Awaited<ReturnType<typeof getLeaders>>["leaders"][number];

