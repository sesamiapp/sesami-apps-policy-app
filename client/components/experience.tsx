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
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">
                    I agree to the{' '}
                    <a
                        href={`/privacy-policy?policy=${encodeURIComponent(policyText as string)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        privacy policy
                    </a>
                </span>
            </label>

            <style>
                {`
          .checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            }

          .checkbox-container input {
            display: none;
          }

          .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.3s;
          }

          .checkbox-container input:checked + .checkmark {
            background: black;
          }

          .checkbox-container input:checked + .checkmark::after {
            content: "✔";
            color: white;
            font-size: 14px;
          }

          .label-text {
            margin-left: 8px;
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
