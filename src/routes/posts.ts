import { Router, Response } from 'express';
import { serializeUser } from 'passport';
import prisma from '../prisma'

const router = Router();

router.get('/', (req: any, res: Response) => {
    res.end()
})

router.post('/', async (req: any, res: Response) => {
    const elasticId = null
    if (!req.isAuthenticated()) {
        res.status(400).send('Not logged')
    }
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        },
    })
    if (!user.isScientific) {
        res.status(400).send('Not a scientific')
    }
    const scientific = await prisma.scientific.findUnique({
        where: {
            userId: user.id
        },
    })
    prisma.post.create({
        data: {
            title: req.body.title,
            content: req.body.content,
            url: req.body.url,
            elasticId: elasticId
        },
    })

    res.end()
})



export default router
