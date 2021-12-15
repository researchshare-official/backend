import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import prisma from '../prisma'

export default function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
            (email, password, next) => {
                prisma.user.findUnique({
                    where: {
                        email: email
                    }
                })
                    .then((user) => {
                        if (!user) {
                            return next(null, false, { message: 'Incorrect email.' });
                        }
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) {
                                return next(err);
                            }
                            if (!isMatch) {
                                return next(null, false, { message: 'Incorrect password.' });
                            }
                            return next(null, user);
                        });
                    })
            }))

    passport.serializeUser((user, next) => {
        next(null, user.id);
    });

    passport.deserializeUser(async (id, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            next(null, user);
        } catch (err) {
            next(err);
        }
    });
}