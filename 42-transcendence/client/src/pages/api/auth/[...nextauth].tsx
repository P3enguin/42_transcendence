import NextAuth from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";


export const authOption = {
    state: process.env.STATE,
    providers:[
        FortyTwoProvider({
            clientId:process.env.PUBLIC_ID,
            clientSecret:process.env.SECRET_ID,
        }),
    ],
}

export default NextAuth(authOption);