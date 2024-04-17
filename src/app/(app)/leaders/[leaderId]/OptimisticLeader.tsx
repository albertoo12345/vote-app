"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/leaders/useOptimisticLeaders";
import { type Leader } from "@/lib/db/schema/leaders";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LeaderForm from "@/components/leaders/LeaderForm";


export default function OptimisticLeader({ 
  leader,
   
}: { 
  leader: Leader; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Leader) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLeader, setOptimisticLeader] = useOptimistic(leader);
  const updateLeader: TAddOptimistic = (input) =>
    setOptimisticLeader({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LeaderForm
          leader={optimisticLeader}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLeader}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticLeader.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLeader.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticLeader, null, 2)}
      </pre>
    </div>
  );
}
