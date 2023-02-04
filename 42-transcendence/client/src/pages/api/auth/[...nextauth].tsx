import NextAuth from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";


export const authOption = {
    providers:[
        FortyTwoProvider({
            id: '42',
            clientId:process.env.PUBLIC_ID,
            clientSecret:process.env.SECRET_ID,
        }),
    ],
   
}

export default NextAuth(authOption);