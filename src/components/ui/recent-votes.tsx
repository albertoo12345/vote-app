import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLeaders } from "@/lib/api/leaders/queries";
import { getVoters } from "@/lib/api/voters/queries";

export async function RecentVotes() {
  const { voters } = await getVoters();
  const { leaders } = await getLeaders();

  const leadersWithVoters = leaders.map((leader) => {
    return {
      ...leader,
      voters: voters.filter((voter) => voter.leaderId === leader.id),
    };
  });

  return (
    <div className="space-y-8">
      {leadersWithVoters.map((leader) => {
        return (
          <div key={leader.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                {leader.name[0]}
                {leader.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {leader.name} {leader.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{leader.nationalId}</p>
            </div>
            <div className="ml-auto font-medium">{voters.length}</div>
          </div>
        );
      })}
    </div>
  );
}
