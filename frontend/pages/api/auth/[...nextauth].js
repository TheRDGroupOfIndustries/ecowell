import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongoDB } from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
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
          const user = await User.findOne({ email: credentials?.email });
          if (user && user?.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      if (account.provider === "google") {
        try {
          await connectToMongoDB();
          const userExists = await User.findOne({ email: user?.email });

          if (!userExists) {
            const newUser = new User({
              first_name: user?.name.split(" ")[0],
              last_name: user?.name.split(" ")[1],
              email: user?.email,
              profile_image: user?.image,
            });
            const savedUser = await newUser.save();
            return savedUser;
          }
          return userExists;
        } catch (error) {
          console.log("Error storing onto the db : ", error);
          return false;
        }
      }
    },
    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      await connectToMongoDB();

      if (typeof token?.user !== "undefined") {
        const userExists = await User.findOne({ email: token?.user?.email });

        if (userExists) {
          session.user = {
            authUser: token.user,
            user: userExists,
          };
          return session.user;
        } else {
          session.user = { user: token.user };
          return session.user;
        }
      }
      return session.user;
    },
  },
};

export default NextAuth(authOptions);