import NextAuth from "next-auth";
import { signIn } from "next-auth/client";
import Providers from "next-auth/providers";

import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user",
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;
      try {
       await fauna.query(
         q.If(
           q.Not(
             q.Exists(
               q.Match(
                 q.Index('user_by_email'),
                 q.Casefold(user.email)
               )
             )
           ),
           q.Create(
             q.Collection('users'),
             {data:{email}}
           ),
           q.Get(
             q.Match(
               q.Index('user_by_email'),
               q.Casefold(user.email)
             )
           )
         )
       )
        return true;
      } catch {
        return false;
      }
    },
  },
});
