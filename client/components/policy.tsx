import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const fetchPolicy = async (shopId: string) => {
    try {
        const response = await fetch(
            `http://localhost:3000/policy?shopId=${shopId}`,
        );

        if (!response.ok) {
            throw new Error('Failed to fetch policy');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching policy:', error);
        return { text: '<p>Error loading policy</p>' };
    }
};

const Policy = () => {
    const location = useLocation();
    const shopId = new URLSearchParams(location.search).get('shopId');

    const [policyText, setPolicyText] = useState<string | null>(null);

    useEffect(() => {
        if (shopId) {
            (async () => {
                const policy = await fetchPolicy(shopId as string);
                setPolicyText(policy.text);
            })();
        }
    }, [shopId]);

    return (
        <div className="container">
            <div
                className="policyBox"
                dangerouslySetInnerHTML={{
                    __html: policyText || '<p>No policy found</p>',
                }}
            />

            <style jsx>{`
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 20px;
                    background-color: #f9f9f9;
                }

                .policyBox {
                    max-width: 50%;
                    width: 100%;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                    height: 95vh;
                    overflow: auto;
                }

                @media (max-width: 768px) {
                    .policyBox {
                        max-width: 100%;
                        padding: 15px;
                        border-radius: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Policy;
