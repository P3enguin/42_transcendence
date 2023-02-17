import { profile } from "console";
import NextAuth, { Awaitable } from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";
import { User } from "next-auth";

export const authOption = {
    secret: process.env.AUTH_SECRET,
    providers:[
        FortyTwoProvider({
            id: '42',
            clientId: process.env.PUBLIC_ID,
            clientSecret: process.env.SECRET_ID,
            profile: (profile,token):Awaitable<User> => {
                const userProfile = {
                    id: profile.id.toString(),
                    email: profile.email,
                    name: profile.usual_full_name,
                    image: profile.image.link,
                  };
                return userProfile;
            }
        }),
    ],
    
   
}

export default NextAuth(authOption);