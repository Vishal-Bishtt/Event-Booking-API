import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
// ✅ FIXED: Use shared Prisma instance
import prisma from "./prisma.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async(accessTocken, refershTocken, profile, done)=>{
            try{
                const userExists = await prisma.user.findUnique({
                    where:{email: profile.emails[0].value},
                });
                if (userExists) return done(null, userExists);
                const newUser = await prisma.user.create({
                    data:{
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        provider: "google",
                    },
                });
                done(null,newUser);
            }catch(err){
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id,done)=>{
    const user = await prisma.user.findUnique({where:{id}});
    done(null, user);
});

export default passport;