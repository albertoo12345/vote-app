
import { type Leader, type CompleteLeader } from "@/lib/db/schema/leaders";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Leader>) => void;

export const useOptimisticLeaders = (
  leaders: CompleteLeader[],
  
) => {
  const [optimisticLeaders, addOptimisticLeader] = useOptimistic(
    leaders,
    (
      currentState: CompleteLeader[],
      action: OptimisticAction<Leader>,
    ): CompleteLeader[] => {
      const { data } = action;

      

      const optimisticLeader = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLeader]
            : [...currentState, optimisticLeader];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLeader } : item,
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

  return { addOptimisticLeader, optimisticLeaders };
};
