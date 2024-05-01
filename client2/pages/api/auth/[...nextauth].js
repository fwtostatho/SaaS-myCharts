import NextAuth from  "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: "removed for safety reasons",
            clientSecret: "removed for safety"
        })
    ],
    session :{
        strategy: 'jwt'
    }
};
export default NextAuth(authOptions);