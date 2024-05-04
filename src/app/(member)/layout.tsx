import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar, { UserDetails } from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = await checkAuth();
  if (auth.role === "org:admin") {
    return redirect("/dashboard");
  }
  const session = await getUserAuth();
  return (
    <main>
      <ClerkProvider>
        <TrpcProvider cookies={cookies().toString()}>
          <div className="flex h-screen">
            {/* <UserDetails session={session} /> */}
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">{children}</main>
          </div>
        </TrpcProvider>
      </ClerkProvider>

      <Toaster richColors />
    </main>
  );
}
