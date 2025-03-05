import { NotificationType } from '@sesamiapp/app-message';
import { useServices } from '../api';
import { AntdProvider, useSesami_AdminAppLoader } from '../hooks';
import { Button, Typography } from 'antd';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchPolicy, login, sendPolicy } from './api'; // API functions

const { Title } = Typography;
const queryClient = new QueryClient();

export const Admin = () => (
    <QueryClientProvider client={queryClient}>
        <AntdProvider>
            <AdminContent />
        </AntdProvider>
    </QueryClientProvider>
);

const AdminContent = () => {
    const Sesami = useSesami_AdminAppLoader();
    const { data, isLoading, isError } = useServices(1);
    const [policyText, setPolicyText] = useState('');
    const [shopId, setShopId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Fetch shop ID from Sesami when it's available
    useEffect(() => {
        if (Sesami) {
            setShopId(Sesami.getShopId());
        }
    }, [Sesami]);

    useEffect(() => {
        const storedToken = localStorage.getItem('sesami-app-policy-jwtToken');
        if (storedToken) setToken(storedToken);
    }, []);

    const { data: policyData } = useQuery({
        queryKey: ['policy', shopId],
        queryFn: () => fetchPolicy(shopId as string),
        enabled: !!shopId,
    });

    const { data: loginData } = useQuery({
        queryKey: ['login', shopId],
        queryFn: () => login(shopId as string),
        enabled: () => !!shopId && !token,
    });

    // Set policy text when policy data is fetched
    useEffect(() => {
        if (policyData) setPolicyText(policyData.text);
    }, [policyData]);

    // Store login token when fetched
    useEffect(() => {
        if (loginData) {
            localStorage.setItem('sesami-app-policy-jwtToken', loginData);
            setToken(loginData);
        }
    }, [loginData]);

    // Handle Save Policy
    const handleSave = async () => {
        if (!shopId || !token) return;

        try {
            await sendPolicy(shopId, policyText, token);
            Sesami?.showNotification(
                'Policy was updated',
                NotificationType.SUCCESS,
            );
        } catch {
            Sesami?.showNotification(
                'There was a problem updating the policy',
                NotificationType.ERROR,
            );
        }
    };

    if (isLoading || !Sesami) return <p>Loading...</p>;
    if (isError) return <p>Error loading data</p>;

    return (
        <div className="admin-container">
            <div className="header">
                <Title level={3}>Privacy Policy Manager</Title>
                <Button type="primary" size="large" onClick={handleSave}>
                    Save
                </Button>
            </div>

            <ReactQuill
                theme="snow"
                value={policyText}
                onChange={setPolicyText}
                className="richText"
            />

            <style>
                {`
                .admin-container {
                    font-size: 18px;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .header{
                    display: flex;
                    align-items: center;
                    justify-content: space-between 
                }
                .header h3{
                    margin:0 !important;
                }
                .richText{
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .Button{
                    width: fit-content;
                    align-self: flex-end;
                }
                `}
            </style>
        </div>
    );
};

export default Admin;
