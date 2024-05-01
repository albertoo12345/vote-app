"use client";

import QRScanner from "@/components/qrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { cn, nationalIdSchema } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VoterVote() {
  const [qrOpen, setQrOpen] = useState(false);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const { errors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);
  const router = useRouter();

  if (modalType === "manual") {
    const handleSubmit = async (data: FormData) => {
      const nationalId = data.get("nationalId");
      router.push(`/voterVote/${nationalId}`);
    };

    return (
      <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
        <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Votante</Label>
        <Input type="text" id="nationalId" name="nationalId" className={cn(errors?.nationalId ? "ring ring-destructive" : "")} defaultValue={""} />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-0" />}
        <Button>Buscar Votante por Cédula</Button>
      </form>
    );
  }

  const handleQRScan = async (data: string) => {
    setQrOpen(false);

    const nationalId = data.split("|")[0];
    router.push(`/voterVote/${nationalId}`);
  };

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
