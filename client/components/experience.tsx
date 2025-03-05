import { useSesami_ExperienceIBForm } from '../hooks';
import { useEffect, useState } from 'react';

export const Experience = () => {
    const Sesami = useSesami_ExperienceIBForm();
    const [shopId, setShopId] = useState<string | null>(null);

    useEffect(() => {
        if (Sesami) {
            setShopId(Sesami.getShopId());
        }
    }, [Sesami]);

    return Sesami ? (
        <div
            style={{
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}
        >
            <span className="label-text">
                By continuing, you confirm that you have read and accepted the{' '}
                <a
                    href={`/privacy-policy?shopId=${encodeURIComponent(shopId as string)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    privacy policy
                </a>
            </span>

            <style>
                {`
          .label-text {
            color: black;
          }
        `}
            </style>
        </div>
    ) : (
        <></>
    );
};

export default Experience;
