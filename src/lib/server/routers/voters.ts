import { getVoterById, getVoters } from "@/lib/api/voters/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  voterIdSchema,
  insertVoterParams,
  updateVoterParams,
} from "@/lib/db/schema/voters";
import { createVoter, deleteVoter, updateVoter } from "@/lib/api/voters/mutations";

export const votersRouter = router({
  getVoters: publicProcedure.query(async () => {
    return getVoters();
  }),
  getVoterById: publicProcedure.input(voterIdSchema).query(async ({ input }) => {
    return getVoterById(input.id);
  }),
  createVoter: publicProcedure
    .input(insertVoterParams)
    .mutation(async ({ input }) => {
      return createVoter(input);
    }),
  updateVoter: publicProcedure
    .input(updateVoterParams)
    .mutation(async ({ input }) => {
      return updateVoter(input.id, input);
    }),
  deleteVoter: publicProcedure
    .input(voterIdSchema)
    .mutation(async ({ input }) => {
      return deleteVoter(input.id);
    }),
});
