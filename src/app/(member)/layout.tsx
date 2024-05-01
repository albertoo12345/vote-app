import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = await checkAuth();
  if (auth.role === "org:admin") {
    return null;
  }
  return (
    <main>
      <ClerkProvider>
        <TrpcProvider cookies={cookies().toString()}>
          <div className="flex h-screen">
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">{children}</main>
          </div>
        </TrpcProvider>
      </ClerkProvider>

      <Toaster richColors />
    </main>
  );
}
