import { logger } from '../sesami/logger';
import { upsertPolicy, getPolicy, doesShopExist } from './Policy.database';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './Policy.config';

export async function getShopPolicy(shopId: string): Promise<any> {
    try {
        const policy = await getPolicy(shopId);
        return policy;
    } catch (error) {
        logger.error(`Error in getShopPolicy: ${error}`);
        throw error;
    }
}

export async function createOrUpdatePolicy(shopId: string, policy: string) {
    try {
        const shop = await upsertPolicy(shopId, policy);
        return shop;
    } catch (error) {
        logger.error(`createOrUpdatePolicy: ${error}`);
        throw error;
    }
}

export async function generateJWT(shopId: string) {
    try {
        const shop = await doesShopExist(shopId);
        if (!shop) return false;

        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is not defined in environment variables.');
            return false;
        }

        const token = jwt.sign({ shopId }, JWT_SECRET, { expiresIn: '7d' });

        return token;
    } catch (error) {
        logger.error(`createOrUpdatePolicy: ${error}`);
        throw error;
    }
}
