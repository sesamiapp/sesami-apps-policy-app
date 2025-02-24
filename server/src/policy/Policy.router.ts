import { Router, Request, Response, NextFunction } from 'express';
import { createOrUpdate, retrieve, login } from './Policy.controller';
import { jwtAuthenticate } from './JwtAuthentication.middleware';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    return retrieve(req, res, next);
});

router.post(
    '/',
    jwtAuthenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        return createOrUpdate(req, res, next);
    },
);

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    return login(req, res, next);
});

export default router;
