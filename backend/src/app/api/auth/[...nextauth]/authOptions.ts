import {
  NextAuthOptions,
  User as AuthUser,
  Session as NextAuthSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { AdminValues } from "@/Types/Layout";

interface CustomUser extends AuthUser {
  email: string;
}
interface CustomToken extends Record<string, any> {
  user?: CustomUser;
}
interface UserSession extends NextAuthSession {
  user: AdminValues;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToMongoDB();
        try {
          const admin = await Admin.findOne({ email: credentials?.email });
          if (admin && credentials?.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              admin.password
            );
            if (isPasswordCorrect) {
              return admin;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "google") {
        try {
          await connectToMongoDB();
          const adminExists = await Admin.findOne({ email: user.email });

          if (!adminExists) {
            const newUser = new Admin({
              name: user.name,
              email: user.email,
              image: user?.image,
            });
            const savedUser = await newUser.save();
            return savedUser;
          }
          return adminExists;
        } catch (error) {
          console.log("Error storing onto the db : ", error);
          return false;
        }
      }
    },
    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        token.user = user as CustomUser;
      }
      return token;
    },
    async session({ session, token }) {
      await connectToMongoDB();
      if ((token as CustomToken).user) {
        const userExists = await Admin.findOne({
          email: (token as CustomToken).user?.email,
        });
        if (userExists) {
          session.user = userExists;
        }
      }
      return session as UserSession;
    },
  },
};
