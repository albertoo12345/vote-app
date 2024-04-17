import { getLeaderById, getLeaders } from "@/lib/api/leaders/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  leaderIdSchema,
  insertLeaderParams,
  updateLeaderParams,
} from "@/lib/db/schema/leaders";
import { createLeader, deleteLeader, updateLeader } from "@/lib/api/leaders/mutations";

export const leadersRouter = router({
  getLeaders: publicProcedure.query(async () => {
    return getLeaders();
  }),
  getLeaderById: publicProcedure.input(leaderIdSchema).query(async ({ input }) => {
    return getLeaderById(input.id);
  }),
  createLeader: publicProcedure
    .input(insertLeaderParams)
    .mutation(async ({ input }) => {
      return createLeader(input);
    }),
  updateLeader: publicProcedure
    .input(updateLeaderParams)
    .mutation(async ({ input }) => {
      return updateLeader(input.id, input);
    }),
  deleteLeader: publicProcedure
    .input(leaderIdSchema)
    .mutation(async ({ input }) => {
      return deleteLeader(input.id);
    }),
});
