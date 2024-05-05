"use client";
import Loading from "@/app/loading";
import VoterForm from "@/components/voters/VoterForm";
import { Voter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VoterVote(props: { params: { nationalId: string } }) {
  const [voter, setVoter] = useState<Voter | undefined>(undefined);
  const { nationalId } = props.params;
  const [error, setError] = useState("");
  const router = useRouter();
  const [loadVoteForm, setLoadVoteForm] = useState(false);
  useEffect(() => {
    async function createVoter() {
      try {
        const response = await fetch(`/api/voters/${nationalId}`, {
          method: "POST",
          body: JSON.stringify({ leaderId: "noExist" }),
        });
        const responseData = (await response.json()) as { error: string } | { success: true; voter: Voter };

        if (response.status === 400) {
          const error = responseData as { error: string };
          console.log("error", error);

          setError("No se pudo Registrar al Votante. Razon: " + error.error);
          setVoter({ id: "noVoter" } as Voter);

          if (error.error === "notFoundIn3rdApp") {
            toast.error("No se pudo encontrar al votante en el sistema de votopanama.net");
            setError("Ha ocurrido un error al registrar al votante. Por favor ingresa los datos manualmentew.");
            setLoadVoteForm(true);
            return;
          }
          setTimeout(() => {
            router.push("/member");
          }, 4000);
          toast.error("Error al registrar al votante: " + error.error || "error desconocido.");
        } else {
          toast.success("Votante Registrado!");
          const voter = (responseData as { success: true; voter: Voter }).voter;
          setVoter((responseData as { success: true; voter: Voter }).voter);
          router.push(`/voter/${voter.nationalId}`);
        }
      } catch (e) {
        const error = e as { error: string };
        setError("No se pudo Registrar al Votante. Razon: " + error.error);
        setVoter({ id: "noVoter" } as Voter);
        if (error.error === "notFoundIn3rdApp") {
          toast.error("No se pudo encontrar al votante en el sistema de votopanama.net");
          setError("Ha ocurrido un error al registrar al votante. Por favor ingresa los datos manualmentew.");
          setLoadVoteForm(true);
          return;
        }
        setTimeout(() => {
          router.push("/member");
        }, 4000);
      }
    }
    createVoter();
  }, [nationalId, router]);

  if (!voter && !error) {
    return <Loading />;
  }

  if (loadVoteForm) {
    return (
      <>
        <div className="bg-red-500 p-4 w-1/2">
          <h3 className="font-bold">Error!</h3>
          <span>{error}</span>
        </div>
        <VoterForm leaders={[]} voterVote withoutQR />
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-5">
        <div className="text-center">
          <h1 className="text-xl font-bold">Votante Inválido</h1>
          <span className="italic">{error}</span>
        </div>
      </div>
    );
  } else {
  }
}
