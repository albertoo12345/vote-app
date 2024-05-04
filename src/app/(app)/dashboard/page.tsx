import { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { MainNav } from "@/components/ui/main-nav";
import { Overview } from "@/components/ui/overview";
import { RecentVotes } from "@/components/ui/recent-votes";
import { Search } from "@/components/ui/search";
import TeamSwitcher from "@/components/ui/team-switcher";
import { UserNav } from "@/components/ui/user-nav";
import { getVoters } from "@/lib/api/voters/queries";
import { getLeaders } from "@/lib/api/leaders/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const { voters } = await getVoters();
  const { leaders } = await getLeaders();

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voters.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activistas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaders.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Votos por Activista</CardTitle>
                <CardDescription>Votos registrados por cada activista.</CardDescription>
              </CardHeader>
              <CardContent>
                {voters.length ? <RecentVotes /> : <div className="text-center text-muted-foreground">No hay votos registrados</div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
