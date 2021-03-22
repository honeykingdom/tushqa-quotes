import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";

const options: InitOptions = {
  providers: [
    Providers.Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.SECRET,
  // database: process.env.DATABASE_URL,
  jwt: {
    // signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    // You can also specify a public key for verification if using public/private key (but private only is fine)
    // verificationKey: process.env.JWT_SIGNING_PUBLIC_KEY,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
