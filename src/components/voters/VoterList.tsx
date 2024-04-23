"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Voter, CompleteVoter } from "@/lib/db/schema/voters";
import Modal from "@/components/shared/Modal";
import { type Leader, type LeaderId } from "@/lib/db/schema/leaders";
import { useOptimisticVoters } from "@/app/(app)/voters/useOptimisticVoters";
import { Button } from "@/components/ui/button";
import VoterForm from "./VoterForm";
import { PlusIcon } from "lucide-react";
import VotersTable from "./VotersTable";

type TOpenModal = (voter?: Voter) => void;

export default function VoterList({ voters, leaders, leaderId }: { voters: CompleteVoter[]; leaders: Leader[]; leaderId?: LeaderId }) {
  const { optimisticVoters, addOptimisticVoter } = useOptimisticVoters(voters, leaders);
  const [open, setOpen] = useState(false);
  const [activeVoter, setActiveVoter] = useState<Voter | null>(null);
  const openModal = (voter?: Voter) => {
    setOpen(true);
    voter ? setActiveVoter(voter) : setActiveVoter(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal open={open} setOpen={setOpen} title={activeVoter ? "Edit Voter" : "Create Voter"}>
        <VoterForm voter={activeVoter} addOptimistic={addOptimisticVoter} openModal={openModal} closeModal={closeModal} leaders={leaders} leaderId={leaderId} />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticVoters.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <>
          <VotersTable voters={optimisticVoters} />
          <ul>
            {optimisticVoters.map((voter) => (
              <Voter voter={voter} key={voter.id} openModal={openModal} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const Voter = ({ voter, openModal }: { voter: CompleteVoter; openModal: TOpenModal }) => {
  const optimistic = voter.id === "optimistic";
  const deleting = voter.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("voters") ? pathname : pathname + "/voters/";

  return (
    <li className={cn("flex justify-between my-2", mutating ? "opacity-30 animate-pulse" : "", deleting ? "text-destructive" : "")}>
      <div className="w-full">
        <div>{voter.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + voter.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No voters</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new voter.</p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Voters{" "}
        </Button>
      </div>
    </div>
  );
};
