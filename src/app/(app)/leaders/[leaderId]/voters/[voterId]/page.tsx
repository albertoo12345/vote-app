import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getVoterById } from "@/lib/api/voters/queries";
import { getLeaders } from "@/lib/api/leaders/queries";import OptimisticVoter from "@/app/(app)/voters/[voterId]/OptimisticVoter";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function VoterPage({
  params,
}: {
  params: { voterId: string };
}) {

  return (
    <main className="overflow-auto">
      <Voter id={params.voterId} />
    </main>
  );
}

const Voter = async ({ id }: { id: string }) => {
  
  const { voter } = await getVoterById(id);
  const { leaders } = await getLeaders();

  if (!voter) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="voters" />
        <OptimisticVoter voter={voter} leaders={leaders}
        leaderId={voter.leaderId} />
      </div>
    </Suspense>
  );
};
