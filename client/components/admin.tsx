import { NotificationType } from '@sesamiapp/app-message';
import { useServices } from '../api';
import { AntdProvider, useSesami_AdminAppLoader } from '../hooks';
import { Button, Typography, Input } from 'antd';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const { Title } = Typography;

/*
    This is a sample home page for your app inside the Admin Portal.
    It uses React and Ant Design(with a custom theme) to match the design of the Admin,
    but you can use whatever tech that you want.
*/

const queryClient = new QueryClient();

export const Admin = () => (
    <QueryClientProvider client={queryClient}>
        <AntdProvider>
            <AdminContent />
        </AntdProvider>
    </QueryClientProvider>
);

const fetchPolicy = async (shopId: string) => {
    const response = await fetch(
        `http://localhost:3000/policy?shopId=${shopId}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch policy');
    }

    return response.json();
};

const login = async (shopId: string) => {
    const response = await fetch('http://localhost:3000/policy/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
};

const send = async (shopId: string, policy: string, token: string) => {
    const response = await fetch('http://localhost:3000/policy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopId, policy }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
};

const AdminContent = () => {
    const Sesami = useSesami_AdminAppLoader();
    const { data, isLoading, isError } = useServices(1);

    const [token, setToken] = useState<string | null>(null);
    const { TextArea } = Input;
    const [policyText, setPolicyText] = useState('');
    const [shopId, setShopId] = useState<string | null>(null);

    useEffect(() => {
        if (Sesami) {
            setShopId(Sesami.getShopId());
        }
    }, [Sesami]);

    useEffect(() => {
        const storedToken = localStorage.getItem('sesami-app-policy-jwtToken');

        if (storedToken) {
            setToken(storedToken);
            return;
        }
    }, []);

    const {
        data: policyData,
        isLoading: isPolicyLoading,
        isError: isPolicyError,
    } = useQuery({
        queryKey: ['policy', shopId],
        queryFn: () => fetchPolicy(shopId as string),
        enabled: !!shopId,
    });

    const {
        data: loginData,
        isLoading: isLoginLoading,
        isError: isLoginError,
    } = useQuery({
        queryKey: ['login', shopId],
        queryFn: () => login(shopId as string),
        enabled: () => !!shopId && !token,
    });

    useEffect(() => {
        if (policyData) {
            setPolicyText(policyData.text);
        }
    }, [policyData]);

    useEffect(() => {
        if (loginData) {
            localStorage.setItem('sesami-app-policy-jwtToken', loginData);
            setToken(loginData);
        }
    }, [loginData]);

    return isLoading || !Sesami ? (
        'loading...'
    ) : isError ? (
        'error'
    ) : (
        <div
            style={{
                fontSize: 18,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
            }}
        >
            <Title level={3} style={{ margin: 0 }}>
                Privacy Policy Manager
            </Title>

            <TextArea
                rows={6}
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
            />

            <Button
                type="primary"
                size="large"
                onClick={async () =>
                    shopId &&
                    token &&
                    (await send(shopId, policyText, token)
                        .then(() =>
                            Sesami.showNotification(
                                'policy was updated',
                                NotificationType.SUCCESS,
                            ),
                        )
                        .catch(() =>
                            Sesami.showNotification(
                                'there was a problem in updating the policy',
                                NotificationType.ERROR,
                            ),
                        ))
                }
            >
                Save
            </Button>
        </div>
    );
};

export default Admin;
