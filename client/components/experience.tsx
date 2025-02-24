import { useSesami_ExperienceIBForm } from '../hooks';
import { useEffect, useState } from 'react';

/*
    This is a sample page for your extension inside the Experience(instant booking form target).
    It uses CSS for styling to make it lighter, but you can use whatever tech that you want.
*/

const fetchPolicy = async (shopId: string) => {
    const response = await fetch(
        `http://localhost:3000/policy?shopId=${shopId}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch policy');
    }

    return response.json();
};

export const Experience = () => {
    const Sesami = useSesami_ExperienceIBForm();
    const [policyText, setPolicyText] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [shopId, setShopId] = useState<string | null>(null);

    useEffect(() => {
        if (Sesami) {
            setShopId(Sesami.getShopId());
        }
    }, [Sesami]);

    useEffect(() => {
        if (shopId) {
            (async () => {
                const policy = await fetchPolicy(shopId as string);
                setPolicyText(policy.text);
            })();
        }
    }, [shopId]);

    return Sesami ? (
        <div
            style={{
                fontSize: 18,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}
        >
            <span className="label-text">
                By continuing, you confirm that you have read and accepted the{' '}
                <a
                    href={`/privacy-policy?policy=${encodeURIComponent(policyText as string)}`}
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
