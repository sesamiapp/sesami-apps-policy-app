import { prisma } from '../application';

export async function upsertPolicy(shopId: string, policyText: string) {
    const updatedShop = await prisma.shop.update({
        where: { shopId },
        data: {
            policy: {
                text: policyText,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        },
    });
    return updatedShop;
}

export async function getPolicy(shopId: string) {
    const shop = await prisma.shop.findUnique({
        where: { shopId },
        select: { policy: true },
    });
    return shop?.policy || null; // Return null if no policy exists
}

export async function doesShopExist(shopId: string): Promise<boolean> {
    const shop = await prisma.shop.findUnique({
        where: { shopId },
        select: { id: true },
    });

    return shop !== null;
}
