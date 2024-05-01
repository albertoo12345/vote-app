"use client";
import LoadingIcon from "@/components/LoadingIcon";
import QRScanner from "@/components/qrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { cn, nationalIdSchema } from "@/lib/utils";
import { Leader } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LeaderVote() {
  const [qrOpen, setQrOpen] = useState(false);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const { errors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);
  const router = useRouter();

  if (modalType === "manual") {
    const handleSubmit = async (data: FormData) => {
      setIsLoading(true);
      const nationalId = data.get("nationalId");
      const response = await fetch(`/api/leaders/${nationalId}`, {
        method: "POST",
      });
      const responseData = (await response.json()) as { success: true; leader: Leader };
      setIsLoading(false);

      router.push(`/leaderVote/${responseData.leader.nationalId}`);
    };

    return (
      <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
        <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Dirigente</Label>
        <Input
          type="text"
          id="nationalId"
          name="nationalId"
          disabled={isLoading}
          className={cn(errors?.nationalId ? "ring ring-destructive" : "")}
          defaultValue={""}
        />
        {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-0" />}

        {!isLoading ? (
          <>
            <Button type="submit" disabled={isLoading}>
              Registrar Dirigente por Cédula
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              onClick={() => {
                setModalType("qr");
                setQrOpen(true);
              }}
              className="h-fit"
            >
              Buscar por Código QR
            </Button>
          </>
        ) : (
          <LoadingIcon />
        )}
      </form>
    );
  }

  const handleQRScan = async (data: string) => {
    setIsLoading(true);
    setQrOpen(false);

    const nationalId = data.split("|")[0];
    const response = await fetch(`/api/leaders/${nationalId}`, {
      method: "POST",
    });
    const responseData = (await response.json()) as { success: true; leader: Leader };
    setIsLoading(false);

    router.push(`/leaderVote/${responseData.leader.nationalId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-7">
      {qrOpen && <QRScanner components={{ tracker: qrOpen, audio: false }} onResult={handleQRScan} />}
      <Button
        onClick={() => {
          setModalType("manual");
          setQrOpen(false);
        }}
        className="h-fit"
      >
        Ingresar Cédula manualmente
      </Button>
      {!qrOpen && (
        <Button
          onClick={() => {
            setModalType("qr");
            setQrOpen(true);
          }}
          className="h-fit"
        >
          Buscar por Código QR
        </Button>
      )}
    </div>
  );
}
