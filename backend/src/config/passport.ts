import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "./config.js";
import prisma from "./prismaClient.js";

/**
 * {
 * _json: 
 *      {
            sub: '',
            name: '',
            given_name: '',
            picture: '' 
            email: '@gmail.com',
            email_verified: true
        }
    }
 */
passport.use(
    new GoogleStrategy({
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL,
    }, 
    async (_accessToken, _refreshToken, profile, done) => {

        try{
            const user = {
                googleId: profile._json.sub,
                name: profile._json.name!,
                email: profile._json.email!,
                avatar_url: profile._json.picture!
            }

            const userObj = await prisma.user.upsert({
                where: {googleId: profile._json.sub},
                update: {},
                create: user,
                omit: {
                    created_at: true,
                    updated_at: true,
                    avatar_url: true
                }
            })

            done(null, userObj);
        }
        catch(err){
            done(err as Error)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id: string, done) => {

    try{
        const userObj = await prisma.user.findUnique({
            where: {id},
            omit: {
                created_at: true,
                updated_at: true,
                avatar_url: true
            }
        })

        if(!userObj) return done(null, false);

        done(null, userObj);
    }
    catch(err){
        done(err as Error);
    }
})

export default passport;