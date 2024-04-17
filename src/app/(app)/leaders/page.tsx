import { Suspense } from "react";

import Loading from "@/app/loading";
import LeaderList from "@/components/leaders/LeaderList";
import { getLeaders } from "@/lib/api/leaders/queries";


export const revalidate = 0;

export default async function LeadersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Leaders</h1>
        </div>
        <Leaders />
      </div>
    </main>
  );
}

const Leaders = async () => {
  
  const { leaders } = await getLeaders();
  
  return (
    <Suspense fallback={<Loading />}>
      <LeaderList leaders={leaders}  />
    </Suspense>
  );
};
