"use client";
import LoadingIcon from "@/components/LoadingIcon";
import LeaderForm from "@/components/leaders/LeaderForm";
import QRScanner from "@/components/qrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { cn, nationalIdSchema } from "@/lib/utils";
import { Leader } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LeaderVote() {
  const [qrOpen, setQrOpen] = useState(false);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadVoteForm, setLoadVoteForm] = useState(false);
  const { errors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);
  const router = useRouter();

  if (modalType === "manual") {
    const handleSubmit = async (data: FormData) => {
      // setIsLoading(true);
      const nationalId = data.get("nationalId");

      try {
        const response = await fetch(`/api/leaders/${nationalId}`, {
          method: "POST",
        });
        const responseData = (await response.json()) as { success: true; leader: Leader };
        console.log(responseData);

        if (response.status === 400) {
          const error = responseData as unknown as { error: string };
          setError("No se pudo Registrar al Votante. Razon: " + error.error);
          if (error.error === "notFoundIn3rdApp") {
            toast.error("No se pudo encontrar al votante en el sistema de votopanama.net");
            setError("Ha ocurrido un error al registrar al votante. Por favor ingresa los datos manualmentew.");
            setLoadVoteForm(true);
            return;
          }
        }

        setIsLoading(false);

        router.push(`/leaderVote/${responseData.leader.nationalId}`);
      } catch (e) {
        const error = e as { error: string };
        setError("No se pudo Registrar al Votante. Razon: " + error.error);
        if (error.error === "notFoundIn3rdApp") {
          toast.error("No se pudo encontrar al votante en el sistema de votopanama.net");
          setError("Ha ocurrido un error al registrar al votante. Por favor ingresa los datos manualmentew.");
          setLoadVoteForm(true);
          return;
        }
      }
    };

    if (loadVoteForm) {
      return (
        <>
          <div className="bg-red-500 p-4 w-full mb-5">
            <h3 className="font-bold">Error!</h3>
            <span>{error}</span>
          </div>
          <h3 className="my-3 font-bold text-3xl">Ingresar Activista</h3>
          <LeaderForm withoutQR leaderVote />
        </>
      );
    }

    return (
      <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
        <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Activista</Label>
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
              Registrar Activista por Cédula
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
    setQrOpen(false);

    const nationalId = data.split("|")[0];
    try {
      const response = await fetch(`/api/leaders/${nationalId}`, {
        method: "POST",
      });

      const responseData = (await response.json()) as { success: true; leader: Leader };

      setIsLoading(false);
      router.push(`/leaderVote/${responseData.leader.nationalId}`);
    } catch (e) {
      const error = e as { error: string };
      setError("No se pudo Registrar al Votante. Razon: " + error.error);
      if (error.error === "notFoundIn3rdApp") {
        toast.error("No se pudo encontrar al votante en el sistema de votopanama.net");
        setError("Ha ocurrido un error al registrar al votante. Por favor ingresa los datos manualmentew.");
        setLoadVoteForm(true);
        return;
      }
    }
  };

  if (loadVoteForm) {
    return (
      <>
        <div className="bg-red-500 p-4 w-1/2">
          <h3 className="font-bold">Error!</h3>
          <span>{error}</span>
        </div>
        <LeaderForm withoutQR />
      </>
    );
  }
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
