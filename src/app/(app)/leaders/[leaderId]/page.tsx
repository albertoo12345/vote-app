import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLeaderByIdWithVoters } from "@/lib/api/leaders/queries";
import OptimisticLeader from "./OptimisticLeader";
import VoterList from "@/components/voters/VoterList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function LeaderPage({
  params,
}: {
  params: { leaderId: string };
}) {
  return (
    <main className="overflow-auto">
      <Leader id={params.leaderId} />
    </main>
  );
}

const Leader = async ({ id }: { id: string }) => {
  const { leader, voters } = await getLeaderByIdWithVoters(id);

  if (!leader) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="leaders" />
        <OptimisticLeader leader={leader} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {leader.name}&apos;s Voters
        </h3>
        <VoterList leaders={[]} leaderId={leader.id} voters={voters} />
      </div>
    </Suspense>
  );
};
