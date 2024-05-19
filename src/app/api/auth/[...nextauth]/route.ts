import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OPERATIONS_DASHBOARD_DATABASE,
} from "../../../../config";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongodbDbConnections from "../../../../database/server-side-interactions/connection/mongodb";

const mongoAdapter = MongoDBAdapter(
  mongodbDbConnections[OPERATIONS_DASHBOARD_DATABASE as string],
  {
    databaseName: OPERATIONS_DASHBOARD_DATABASE,
    collections: {
      Accounts: "authProviderAccounts",
      Sessions: "operatorSessions",
      Users: "operators",
      VerificationTokens: "authVerificationToken",
    },
  }
);

const handler = NextAuth({
  adapter: mongoAdapter,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      return (
        account?.provider === "google" &&
        !!profile?.email?.endsWith("@weminetogether.com")
      );
    },
  },
});

export { handler as GET, handler as POST };
