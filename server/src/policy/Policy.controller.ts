import { NextFunction, Request, Response } from 'express';

import {
    createOrUpdatePolicy,
    getShopPolicy,
    generateJWT,
} from './Policy.service';

export async function retrieve(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { shopId } = req.query;
        if (!shopId)
            return res.status(400).json({ message: 'Invalid request' });

        const policyInformation = await getShopPolicy(shopId as string);

        if (policyInformation) {
            return res.status(200).json(policyInformation);
        } else {
            return res.status(400).json({ message: 'Invalid request' });
        }
    } catch (err) {
        next(err);
    }
}

export async function createOrUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { shopId, policy } = req.body;
        if (!shopId || !policy)
            return res.status(400).json({ message: 'Invalid request' });

        const shop = await createOrUpdatePolicy(
            shopId as string,
            policy as string,
        );
        return res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { shopId } = req.body;

        if (!shopId)
            return res.status(400).json({ message: 'Invalid request' });

        const token = await generateJWT(shopId);
        if (token) return res.status(200).json(token);
        else return res.status(400).json({ message: 'Invalid request' });
    } catch (err) {
        next(err);
    }
}
