import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Grid, Box, CircularProgress } from '@mui/material';
import { GET_DASHBOARD_STATS } from '../graphql/queries';

import EntityDistribution from '../components/dashboard/EntityDistribution';
import ConnectionDensity from '../components/dashboard/ConnectionDensity';
import StatCard from '../components/dashboard/StatCard';

const Dashboard = () => {
    const { data, loading } = useQuery(GET_DASHBOARD_STATS);

    const stats = useMemo(() => {
        const clients = data?.['clients'] || [];
        const contacts = data?.['contacts'] || [];
        return {
            clients: clients.length,
            contacts: contacts.length,
            totalLinks: clients.reduce((sum, c) => sum + (c.linkedContactsCount || 0), 0),
            clientTrend: [2, 5, 3, 8, 12, 10, clients.length],
            contactTrend: [10, 15, 8, 20, 25, 22, contacts.length],
        };
    }, [data]);

    if (loading) return <Box sx={{ display: 'flex', p: 5, justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3, bgcolor: '#fdfdfd', minHeight: '100vh' }}>
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><StatCard title="Total Clients" value={stats.clients} percentage={25} data={stats.clientTrend} color="#2e7d32" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><StatCard title="Total Contacts" value={stats.contacts} percentage={-12} data={stats.contactTrend} color="#d32f2f" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}><StatCard title="Active Links" value={stats.totalLinks} percentage={5} data={[2, 4, 6, 8, 10, 12, 14]} color="#0288d1" /></Grid>

            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <EntityDistribution clients={stats.clients} contacts={stats.contacts} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ConnectionDensity
                        clientsData={data?.['clients']}
                        contactsData={data?.['contacts']}
                        stats={stats}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;