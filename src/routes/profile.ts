import { Router, Response } from 'express';
import prisma from '../prisma'

const router = Router();

router.get('/', async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        prisma.user.findUnique({
            where: {
                email: req.user.email
            },
        }).then(async (user: any) => {
            res.send(await prisma.profile.findUnique({
                where: {
                    userId: user.id
                }
            }))
        })
    }
})

router.post('/', async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        prisma.user.findUnique({
            where: {
                email: req.user.email
            },
        }).then((user: any) => {
            prisma.profile.update({
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
        res.end()
    }
})
// router.get('/:email', (req, res) => {

// })

export default router
