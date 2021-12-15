import { Router, Response } from 'express';
import prisma from '../prisma'

const router = Router();

router.get('/', async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        prisma.user.findUnique({
            where: {
                email: req.user.email
            },
        }).then(user => {
            res.send(user)
        })
    }
})

router.patch('/', async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        prisma.user.findUnique({
            where: {
                email: req.user.email
            },
        }).then((user: any) => {
            prisma.profile.upsert({
                where: {
                    userId: user.id
                },
                data: {
                    avatar: req.body.avatar,
                    bio: req.body.bio,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                },
            })
        })
    }
})
// router.get('/:email', (req, res) => {

// })

export default router
