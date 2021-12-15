import { Router, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt'
import prisma from '../prisma'

import { IGetUserAuthInfoRequest } from '../definitionFile';

const router = Router();

router.post('/register', (req, res) => {
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
                    const newUser = await prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            password: hashedPassword,
                        }
                    })
                    res.send(newUser)
                }
            })
    }
})

router.post('/login', (req: IGetUserAuthInfoRequest, res: Response, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(400).send(err);
        }
        if (user) {
            // req.logIn(user, err => {
                res.send({
                    message: `${user.name} connected`,
                    data: user
                });
            // })
        } else {
            res.status(400).send(info);
        }
    })(req, res, next);
})

// router.get('/user', (req, res) => {
    // res.send(req.user);
// })

export default router;