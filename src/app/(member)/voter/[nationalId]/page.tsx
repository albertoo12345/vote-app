"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Leader, Voter } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VoterDetailsPage(props: { params: { nationalId: string } }) {
  const [leader, setLeader] = useState<Leader | undefined>(undefined);
  const [voter, setVoter] = useState<Voter | undefined>(undefined);
  const { nationalId } = props.params;

  useEffect(() => {
    async function getVoter() {
      const response = await fetch(`/api/voters/${nationalId}`);
      const responseData = (await response.json()) as { success: true; voter: Voter & { leader: Leader } };
      setVoter(responseData.voter);
      const leaderResponse = await fetch(`/api/leaders/${responseData.voter.leader.nationalId}`);
      const leaderData = (await leaderResponse.json()) as { success: true; leader: Leader };
      setLeader(leaderData.leader);
    }
    getVoter();
  }, [nationalId]);

  if (!voter || !leader) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col justify-center items-center h-full gap-5">
      <div className="text-center">
        <h1 className="text-xl font-bold">¡Nuevo Voto!</h1>
        <span className="italic">Datos del Votante</span>
      </div>
      <ul>
        <li>
          <b>Nombre: </b>
          <span>
            {voter.name} {voter.lastName}
          </span>
        </li>
        <li>
          <b>Cédula: </b>
          <span>{voter.nationalId}</span>
        </li>

        <li>
          <b>Corregimiento: </b>
          <span>{voter.township}</span>
        </li>
        <li>
          <b>Escuela: </b>
          <span>{voter.school}</span>
        </li>
        <li>
          <b>Mesa: </b>
          <span>{voter.desk}</span>
        </li>
        <li className="mt-3">
          <b>Activista: </b>
          <span>
            {leader.name} {leader.lastName} - {leader.nationalId}
          </span>
        </li>
      </ul>
      <Button>
        <Link href="/member">Volver al Inicio</Link>
      </Button>
    </div>
  );
}
