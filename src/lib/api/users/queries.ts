import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type UserId, userIdSchema } from "@/lib/db/schema/users";

export const getUsers = async () => {
  const { session } = await getUserAuth();
  const u = await db.user.findMany({ where: {userId: session?.user.id!}});
  return { users: u };
};

export const getUserById = async (id: UserId) => {
  const { session } = await getUserAuth();
  const { id: userId } = userIdSchema.parse({ id });
  const u = await db.user.findFirst({
    where: { id: userId, userId: session?.user.id!}});
  return { user: u };
};


