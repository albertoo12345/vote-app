import { Suspense } from "react";

import Loading from "@/app/loading";
import VoterList from "@/components/voters/VoterList";
import { getVoters } from "@/lib/api/voters/queries";
import { getLeaders } from "@/lib/api/leaders/queries";
import VotersTable from "@/components/voters/VotersTable";

export const revalidate = 0;

export default async function VotersPage(props: { searchParams: { leaderId?: string } }) {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Votantes</h1>
        </div>
        <Voters leaderId={props.searchParams.leaderId} />
      </div>
    </main>
  );
}

const Voters = async (props: { leaderId?: string }) => {
  const { voters } = await getVoters();
  const { leaders } = await getLeaders();
  return (
    <Suspense fallback={<Loading />}>
      <VoterList voters={voters} leaders={leaders} />
    </Suspense>
  );
};
