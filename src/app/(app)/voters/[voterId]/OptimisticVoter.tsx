"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/voters/useOptimisticVoters";
import { type Voter } from "@/lib/db/schema/voters";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import VoterForm from "@/components/voters/VoterForm";
import { type Leader, type LeaderId } from "@/lib/db/schema/leaders";

export default function OptimisticVoter({ 
  voter,
  leaders,
  leaderId 
}: { 
  voter: Voter; 
  
  leaders: Leader[];
  leaderId?: LeaderId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Voter) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVoter, setOptimisticVoter] = useOptimistic(voter);
  const updateVoter: TAddOptimistic = (input) =>
    setOptimisticVoter({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VoterForm
          voter={optimisticVoter}
          leaders={leaders}
        leaderId={leaderId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVoter}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticVoter.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticVoter.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticVoter, null, 2)}
      </pre>
    </div>
  );
}
