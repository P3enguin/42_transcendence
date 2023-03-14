import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42';


@Injectable() 
export class Auth42Strategy extends PassportStrategy(Strategy){
    constructor()
    {
        super({
            clientID: process.env.FORTYTWO_APP_UID,
            clientSecret:process.env.FORTYTWO_APP_SECRET,
            callbackURL: process.env.FORTYTWO_CALLBACK_URL,
        })
    }

    async validate (accessToken: string, refreshToken: string, 
                        profile: any, done: any): Promise<any> {
        

        const { name, emails,username,_json} = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: _json.image.link,
            coins:_json.wallet,
            accessToken
        }
        done(null, user);
    }

}

