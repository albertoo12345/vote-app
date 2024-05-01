"use client";
import Loading from "@/app/loading";
import { Voter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VoterVote(props: { params: { nationalId: string } }) {
  const [voter, setVoter] = useState<Voter | undefined>(undefined);
  const { nationalId } = props.params;
  const [error, setError] = useState("");
  const router = useRouter();
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

          setTimeout(() => {
            router.push("/member");
          }, 4000);

          toast.error("Error al registrar al votante: " + error.error || "error desconocido.");
        } else {
          toast.success("Votante Registrado!");
          setVoter((responseData as { success: true; voter: Voter }).voter);
          router.push("/member");
        }
      } catch (e) {
        const error = e as { error: string };
        setError("No se pudo Registrar al Votante. Razon: " + error.error);
        setVoter({ id: "noVoter" } as Voter);
        setTimeout(() => {
          router.push("/member");
        }, 4000);
      }
    }
    createVoter();
  }, [nationalId]);

  if (!voter && !error) {
    return <Loading />;
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
