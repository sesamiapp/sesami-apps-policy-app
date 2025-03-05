export const fetchPolicy = async (shopId: string) => {
    const response = await fetch(
        `http://localhost:3000/policy?shopId=${shopId}`,
    );
    if (!response.ok) throw new Error('Failed to fetch policy');
    return response.json();
};

export const login = async (shopId: string) => {
    const response = await fetch('http://localhost:3000/policy/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId }),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
};

export const sendPolicy = async (
    shopId: string,
    policy: string,
    token: string,
) => {
    const response = await fetch('http://localhost:3000/policy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopId, policy }),
    });
    if (!response.ok) throw new Error('Failed to update policy');
    return response.json();
};
