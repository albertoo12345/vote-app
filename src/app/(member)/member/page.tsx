"use client";
import QRScanner from "@/components/qrScanner";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { cn, nationalIdSchema } from "@/lib/utils";
import { Leader } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LeaderVote from "./LeaderVote";
import VoterVote from "./VoterVote";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  const [modalTitle, setModalTitle] = useState("Agregar Voto con Dirigente");
  const [modalType, setModalType] = useState<"leader" | "voter">("leader");

  useEffect(() => {
    if (modalType === "leader") {
      setModalTitle("Agregar Voto con Dirigente");
    }
    if (modalType === "voter") {
      setModalTitle("Agregar Voto Suelto");
    }
  }, [modalType]);

  const openModal = (type: "leader" | "voter") => {
    setModalType(type);
    setOpen(true);
  };
  return (
    <>
      <Modal open={open} setOpen={setOpen} title={modalTitle}>
        {modalType === "leader" ? <LeaderVote /> : <VoterVote />}
      </Modal>
      <div className="flex flex-col justify-center items-center h-full gap-7">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Vielka Cortés</h1>
          <span className="italic">Registro de Votos</span>
        </div>
        <Button onClick={() => openModal("leader")} className="h-fit text-wrap">
          Agregar Voto con Dirigente
        </Button>
        <Button onClick={() => openModal("voter")} className="h-fit text-wrap">
          Agregar Voto Suelto
        </Button>
      </div>
    </>
  );
}
