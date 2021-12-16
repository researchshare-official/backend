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

router.patch('/', async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        await prisma.user.update({
            where: {
                email: req.user.email
            },
            data: {
                Profile: {
                    update: {
                        avatar: req.body.avatar,
                        bio: req.body.bio,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    }
                }
            }
        })
        res.end()
    }
})

router.get('/:name', async (req: any, res: Response) => {
    prisma.user.findUnique({
        where: {
            name: req.params.name
        },
    }).then(async (user: any) => {
        prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        })
        .then((user) => {
            if (user) {
                res.send(user)
            } else {
                res.status(404).send('No user named ' +  req.params.name)
            }
        })
    })
})

export default router
