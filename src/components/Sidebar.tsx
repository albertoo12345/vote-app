import Link from "next/link";

import SidebarItems from "./SidebarItems";
import { UserButton, clerkClient } from "@clerk/nextjs";

import { AuthSession, getUserAuth } from "@/lib/auth/utils";

const Sidebar = async () => {
  const session = await getUserAuth();
  if (session.session === null) return null;

  return (
    <aside className="h-screen min-w-52 bg-muted hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold ml-4">Logo</h3>
          <SidebarItems />
        </div>
        <UserDetails session={session} />
      </div>
    </aside>
  );
};

export default Sidebar;

const UserDetails = async ({ session }: { session: AuthSession }) => {
  if (session.session === null) return null;
  const { user } = session.session;
  const clerkUser = await clerkClient.users.getUser(user.id);
  if (!user?.name || user.name.length == 0) return null;
  console.log(session);

  return (
    <Link href="/account">
      <div className="flex items-center justify-between w-full border-t border-border pt-4 px-2">
        <div className="text-muted-foreground">
          <p className="text-xs">{user.name ?? "John Doe"}</p>
          <p className="text-xs font-light pr-4">{clerkUser.emailAddresses[0].emailAddress ?? "john@doe.com"}</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </Link>
  );
};
