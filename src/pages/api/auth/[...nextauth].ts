import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";

const options: NextAuthOptions = {
  providers: [
    Providers.Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.SECRET,
  // database: process.env.DATABASE_URL,
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
