import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import prisma from '../prisma'

const localStrategy = passportLocal.Strategy

export default function (passport) {
    passport.use(new localStrategy((email: string, password: string, done) => {
        prisma.user.findUnique({
            where: {
                email: email
            }
        })
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        prisma.user.findUnique({
            where: {
                id: id
            }
        })
        .then((user) => {
            done(user);
        })
    });
}