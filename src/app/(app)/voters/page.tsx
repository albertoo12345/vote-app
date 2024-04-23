import { Suspense } from "react";

import Loading from "@/app/loading";
import VoterList from "@/components/voters/VoterList";
import { getVoters } from "@/lib/api/voters/queries";
import { getLeaders } from "@/lib/api/leaders/queries";
import VotersTable from "@/components/voters/VotersTable";

export const revalidate = 0;

export default async function VotersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Voters</h1>
        </div>
        <Voters />
      </div>
    </main>
  );
}

const Voters = async () => {
  const { voters } = await getVoters();
  const { leaders } = await getLeaders();
  return (
    <Suspense fallback={<Loading />}>
      <VotersTable />
      {/* <VoterList voters={voters} leaders={leaders} /> */}
    </Suspense>
  );
};
