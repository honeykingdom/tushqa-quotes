import { MiddlewareFn } from "type-graphql";
import { Context } from "../../types";

const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const userId = await context.getUserId();

  if (!userId) {
    throw Error("Not authenticated");
  }

  return next();
};

export default isAuth;
