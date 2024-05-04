"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Leader, CompleteLeader } from "@/lib/db/schema/leaders";
import Modal from "@/components/shared/Modal";

import { useOptimisticLeaders } from "@/app/(app)/leaders/useOptimisticLeaders";
import { Button } from "@/components/ui/button";
import LeaderForm from "./LeaderForm";
import { PlusIcon } from "lucide-react";
import LeadersTable from "./LeadersTable";

type TOpenModal = (leader?: Leader) => void;

export default function LeaderList({ leaders }: { leaders: CompleteLeader[] }) {
  const { optimisticLeaders, addOptimisticLeader } = useOptimisticLeaders(leaders);
  const [open, setOpen] = useState(false);
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);
  const openModal = (leader?: Leader) => {
    setOpen(true);
    leader ? setActiveLeader(leader) : setActiveLeader(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal open={open} setOpen={setOpen} title={activeLeader ? "Editar Activista" : "Crear Activista"}>
        <LeaderForm leader={activeLeader} addOptimistic={addOptimisticLeader} openModal={openModal} closeModal={closeModal} />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLeaders.length === 0 ? <EmptyState openModal={openModal} /> : <LeadersTable leaders={optimisticLeaders} />}
    </div>
  );
}

const Leader = ({ leader, openModal }: { leader: CompleteLeader; openModal: TOpenModal }) => {
  const optimistic = leader.id === "optimistic";
  const deleting = leader.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("leaders") ? pathname : pathname + "/leaders/";

  return (
    <li className={cn("flex justify-between my-2", mutating ? "opacity-30 animate-pulse" : "", deleting ? "text-destructive" : "")}>
      <div className="w-full">
        <div>{leader.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + leader.id}>Editar</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No hay activistas</h3>
      <p className="mt-1 text-sm text-muted-foreground">Crea un nuevo activista aqui.</p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> Nuevo Activista{" "}
        </Button>
      </div>
    </div>
  );
};
