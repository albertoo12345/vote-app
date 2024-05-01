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
        <Button onClick={() => openModal("leader")} className="h-fit text-xl text-wrap">
          Agregar Voto con Dirigente
        </Button>
        <Button onClick={() => openModal("voter")} className="h-fit text-xl text-wrap">
          Agregar Voto Suelto
        </Button>
      </div>
    </>
  );
}

function VoterVote() {
  const [qrOpen, setQrOpen] = useState(false);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);

  const handleQRScan = (data: string) => {
    console.log("QR Data", data);
    setQrOpen(false);
  };

  const handleSubmit = (data: FormData) => {
    console.log(data.get("nationalId"));
  };

  if (modalType === "manual") {
    return (
      <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
        <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Votante</Label>
        <Input type="text" id="nationalId" name="nationalId" className={cn(errors?.nationalId ? "ring ring-destructive" : "")} defaultValue={""} />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-0" />}
        <Button>Buscar Votante por Cédula</Button>
      </form>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center h-full gap-7">
      {qrOpen && <QRScanner components={{ tracker: qrOpen }} onResult={handleQRScan} />}
      <Button
        onClick={() => {
          setModalType("qr");
          setQrOpen(true);
        }}
        className="text-lg text-wrap"
      >
        Buscar por Código QR
      </Button>
      <Button
        onClick={() => {
          setModalType("manual");
          setQrOpen(false);
        }}
        className="text-lg text-wrap"
      >
        Ingresar Cédula manualmente
      </Button>
    </div>
  );
}

function LeaderVote() {
  const [qrOpen, setQrOpen] = useState(false);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const { errors, hasErrors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);
  const router = useRouter();
  const handleQRScan = async (data: string) => {
    console.log("QR Data", data);
    setQrOpen(false);
    const nationalId = data.split("|")[0];
    const response = await fetch(`/api/leaders/${nationalId}`, {
      method: "POST",
    });
    const responseData = (await response.json()) as { success: true; leader: Leader };
    console.log(responseData);

    router.push(`/leaderVote/${responseData.leader.nationalId}`);
  };
  const handleSubmit = async (data: FormData) => {
    const nationalId = data.get("nationalId");
    const response = await fetch(`/api/leaders/${nationalId}`, {
      method: "POST",
    });
    const responseData = (await response.json()) as { success: true; leader: Leader };
    router.push(`/leaderVote/${responseData.leader.nationalId}`);
  };

  if (modalType === "manual") {
    return (
      <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
        <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Dirigente</Label>
        <Input type="text" id="nationalId" name="nationalId" className={cn(errors?.nationalId ? "ring ring-destructive" : "")} defaultValue={""} />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-0" />}
        <Button>Buscar Dirigente por Cédula</Button>
      </form>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center h-full gap-7">
      {qrOpen && <QRScanner components={{ tracker: qrOpen }} onResult={handleQRScan} />}
      <Button
        onClick={() => {
          setModalType("qr");
          setQrOpen(true);
        }}
        className="text-lg text-wrap"
      >
        Buscar por Código QR
      </Button>
      <Button
        onClick={() => {
          setModalType("manual");
          setQrOpen(false);
        }}
        className="text-lg text-wrap"
      >
        Ingresar Cédula manualmente
      </Button>
    </div>
  );
}
