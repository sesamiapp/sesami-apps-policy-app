import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import config from './sesami/config/Build.config';
import { winstonMiddleware } from './sesami/logger';
import {
    errorHandler,
    InvalidShopId,
    UnauthenticatedError,
} from './sesami/exceptions';
import { InstallationController } from './sesami/api/installation';
import { InstallationService } from './sesami/installation';
import { webhookRoute } from './sesami/api/webhook';
import { isAuthenticatedRequest } from './sesami/authentication/helper.ts';

const app = express();

export const prisma = new PrismaClient();

if (config.environment !== 'production') {
    app.use(cors());
}

app.use(passport.initialize());
app.use(express.json());
app.use(winstonMiddleware);

app.get('/404', async (_req: Request, _res: Response, next: NextFunction) => {
    next();
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.shopId) {
        return next(new InvalidShopId());
    }
    if (
        !(await InstallationService.isShopInstalled(
            req.query.shopId as unknown as string,
        ))
    ) {
        return InstallationController.initiateInstallation(req, res, next);
    } else {
        if (!(await isAuthenticatedRequest(req, res, next))) {
            return next(new UnauthenticatedError());
        }
        next();
    }
});

app.get(
    '/oauth/call-back',
    (req: Request, res: Response, next: NextFunction) => {
        return InstallationController.authorization(req, res, next);
    },
);

app.get('/health', async (_req: Request, res: Response) => {
    res.status(200).send('Ok');
});

app.use((err: Error, _req: Request, res: Response) => {
    errorHandler.handleError(err, res);
});

app.use(webhookRoute);

export { app };
