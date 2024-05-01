"use client";
import Loading from "@/app/loading";
import QRScanner from "@/components/qrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { cn, nationalIdSchema } from "@/lib/utils";
import { Leader, Voter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LeaderVotePage(props: { params: { nationalId: string } }) {
  const [qrOpen, setQrOpen] = useState(false);
  const [leader, setLeader] = useState<Leader | undefined>(undefined);
  const [modalType, setModalType] = useState<"qr" | "manual" | "">("");
  const { errors, hasErrors, handleChange } = useValidatedForm<{ nationalId: string }>(nationalIdSchema);
  const router = useRouter();
  const { nationalId } = props.params;
  useEffect(() => {
    async function getLeader() {
      const response = await fetch(`/api/leaders/${nationalId}`);
      const responseData = (await response.json()) as { success: true; leader: Leader };
      setLeader(responseData.leader);
    }
    getLeader();
  }, [nationalId]);

  if (!leader) {
    return <Loading />;
  }

  const handleQRScan = async (data: string) => {
    setQrOpen(false);
    const nationalId = data.split("|")[0];
    const response = await fetch(`/api/voters/${nationalId}`, {
      method: "POST",
      body: JSON.stringify({ leaderId: leader.id }),
    });
    const responseData = (await response.json()) as { success: true; voter: Voter };
    console.log(responseData);
  };
  const handleSubmit = async (data: FormData) => {
    const nationalId = data.get("nationalId");
    const response = await fetch(`/api/voters/${nationalId}`, {
      method: "POST",
      body: JSON.stringify({ leaderId: leader.nationalId }),
    });
    const responseData = (await response.json()) as { success: true; voter: Voter };
    console.log(responseData);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-5">
      <div className="text-center">
        <h1 className="text-xl font-bold">
          Dirigente: {leader.name} {leader.lastName}
        </h1>
        <span className="italic">Cédula: {leader?.nationalId}</span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-center">Ingresar Votante</h2>
        {qrOpen && <QRScanner components={{ tracker: qrOpen }} onResult={handleQRScan} />}
        {modalType === "manual" && (
          <form action={handleSubmit} onChange={handleChange} className="flex flex-col justify-center items-center h-full gap-3">
            <Label className={cn("mb-3 inline-block", errors?.nationalId ? "text-destructive" : "")}>Cedula del Votante</Label>
            <Input
              type="text"
              id="nationalId"
              name="nationalId"
              className={cn(errors?.nationalId ? "ring ring-destructive" : "")}
              defaultValue={""}
            />
            {errors?.nationalId ? <p className="text-xs text-destructive mt-2">{errors.nationalId[0]}</p> : <div className="h-0" />}
            <Button>Buscar Votante por Cédula</Button>
          </form>
        )}
        <Button
          onClick={() => {
            setModalType("qr");
            setQrOpen(true);
          }}
          className="text-wrap"
        >
          Buscar por Código QR
        </Button>
        {modalType !== "manual" && (
          <>
            <Button
              onClick={() => {
                setModalType("manual");
                setQrOpen(false);
              }}
              className="text-wrap"
            >
              Ingresar Cédula manualmente
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
