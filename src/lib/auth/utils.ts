import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const getUserAuth = async () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId, sessionClaims } = auth();
  const { firstName, lastName } = await clerkClient.users.getUser(userId!);

  if (userId) {
    return {
      session: {
        user: {
          id: userId,
          name: `${firstName} ${lastName}`,
          email: sessionClaims?.email,
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};

export const checkAuth = async () => {
  const { userId, sessionId } = auth();
  if (!userId) redirect("/sign-in");
  const session = await clerkClient.sessions.getSession(sessionId);
  const memberships = await clerkClient.users.getOrganizationMembershipList({ userId });
  let role;
  if (memberships.length > 0) {
    role = memberships[0].role;
  } else {
    role = "member";
  }
  return {
    userId,
    session,
    role,
  };
};
