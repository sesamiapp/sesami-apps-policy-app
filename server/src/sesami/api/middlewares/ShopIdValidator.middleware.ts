import { logger } from '../../logger';
import { NextFunction, Request, Response } from 'express';
import { InvalidShopId, ShopNotFoundById } from '../../exceptions';
import { ShopRepository } from '../../installation';
import { isValidMongoId } from '../../utils/IsMongoId.helper';

const shopRepository = new ShopRepository();

export async function ShopIdValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { shop_id: sesamiShopId } = req.params;
        if (!sesamiShopId) {
            throw new InvalidShopId();
        }
        const { error } = isValidMongoId(sesamiShopId);
        if (error) {
            throw new InvalidShopId();
        }

        const shopExists = await shopRepository.getBySesamiId(sesamiShopId);
        if (!shopExists) {
            throw new ShopNotFoundById();
        } else {
            req.params.internalShopId = shopExists.id;
        }
        next();
    } catch (err) {
        if (err == 'P2023') {
            next(new InvalidShopId());
        }
        logger.error(err);
        next(err);
    }
}
