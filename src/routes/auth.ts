import { Router, Response, Request, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt'
import prisma from '../prisma'

import { IGetUserAuthInfoRequest } from '../definitionFile';

const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    const name: string = req.body.name || null
    const email: string = req.body.email || null
    const password: string = req.body.password || null
    if (!email || !password) {
        res.status(400).send('Please provide email and password')
    } else {
        prisma.user.findUnique({
            where: {
                email: email
            }
        })
            .then(async (user) => {
                if (user) {
                    res.status(400).send('User already exists')
                } else {
                    const hashedPassword: string = await bcrypt.hash(password, 10)
                    const profile = await prisma.profile.create({
                        data: null
                    })
                    const newUser = await prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            password: hashedPassword,
                            Profile: profile
                        }
                    })
                    req.login(newUser, (err) => {
                        res.send(newUser)
                    })
                }
            })
    }
})

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(400).send(err);
        }
        if (user) {
            req.login(user, err => {
                res.send({
                    message: `${user.name} connected`,
                    data: user
                });
            })
        } else {
            res.status(400).send(info);
        }
    })(req, res, next);
})

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    res.end();
})

router.get('/user', (req, res) => {
    res.send(req.user)
})

export default router;
