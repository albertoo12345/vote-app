import { type Leader } from "@/lib/db/schema/leaders";
import { type Voter, type CompleteVoter } from "@/lib/db/schema/voters";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Voter>) => void;

export const useOptimisticVoters = (
  voters: CompleteVoter[],
  leaders: Leader[]
) => {
  const [optimisticVoters, addOptimisticVoter] = useOptimistic(
    voters,
    (
      currentState: CompleteVoter[],
      action: OptimisticAction<Voter>,
    ): CompleteVoter[] => {
      const { data } = action;

      const optimisticLeader = leaders.find(
        (leader) => leader.id === data.leaderId,
      )!;

      const optimisticVoter = {
        ...data,
        leader: optimisticLeader,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVoter]
            : [...currentState, optimisticVoter];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVoter } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticVoter, optimisticVoters };
};
