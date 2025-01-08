import { NotificationType } from '@sesamiapp/app-message';
import { useServices } from '../api';
import { AntdProvider, useSesami_AdminAppLoader } from '../hooks';
import { Button, Typography } from 'antd';
import { Service } from 'types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const AdminContent = () => {
    //services:
    const Sesami = useSesami_AdminAppLoader();
    const { data, isLoading, isError } = useServices(1);
    const services = data?.items;

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
                My App's Main Page(inside iframe)
            </Title>

            <div>
                <a>Context from parent</a>
                <ul>
                    <li>shopId: {Sesami.getShopId()}</li>
                    <li>locale: {Sesami.getLocale()}</li>
                </ul>
            </div>

            <div>
                <a>Shop services(directly fetched from admin with token)</a>
                <ul>
                    {services?.map((service: Service) => (
                        <li key={service.id}>{service.title}</li>
                    ))}
                </ul>
            </div>

            <Button
                type="primary"
                size="large"
                onClick={() => {
                    Sesami.showNotification(
                        'This is from Admin!',
                        NotificationType.SUCCESS,
                    );
                }}
            >
                Show Notification on Admin
            </Button>
        </div>
    );
};

export default Admin;
