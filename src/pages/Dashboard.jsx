import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Grid, Paper, Typography, Box, Card, CardContent,
    CircularProgress, Chip, Stack, Button,
    Divider
} from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { GET_DASHBOARD_STATS } from '../graphql/queries';

// Helper component for the small Stat Cards
const StatCard = ({ title, value, percentage, data, color }) => (
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
        <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                <Chip
                    label={`${percentage}%`}
                    size="small"
                    color={percentage > 0 ? "success" : "error"}
                    variant="soft"
                    sx={{ borderRadius: 1, fontWeight: 'bold', bgcolor: percentage > 0 ? '#e8f5e9' : '#ffebee' }}
                />
            </Stack>
            <Typography variant="caption" color="text.secondary">Last 30 days</Typography>
            <Box sx={{ height: 50, mt: 2 }}>
                <SparkLineChart
                    data={data}
                    height={50}
                    showTooltip
                    showHighlight
                    colors={[color]}
                />
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { data, loading } = useQuery(GET_DASHBOARD_STATS);

    const stats = useMemo(() => {
        const clientCount = data?.clients?.length || 0;
        const contactCount = data?.contacts?.length || 0;

        // Mocking trend data based on your real counts
        return {
            clients: clientCount,
            contacts: contactCount,
            totalLinks: data?.clients?.reduce((sum, c) => sum + c.linkedContactsCount, 0) || 0,
            // Example data for charts
            clientTrend: [2, 5, 3, 8, 12, 10, clientCount],
            contactTrend: [10, 15, 8, 20, 25, 22, contactCount],
        };
    }, [data]);

    if (loading) return <Box sx={{ display: 'flex', p: 5, justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3, bgcolor: '#fdfdfd', minHeight: '100vh' }}>
            {/* Top Stat Grid */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Clients" value={stats.clients} percentage={+25} data={stats.clientTrend} color="#2e7d32" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Contacts" value={stats.contacts} percentage={-12} data={stats.contactTrend} color="#d32f2f" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Active Links" value={stats.totalLinks} percentage={+5} data={[2, 4, 6, 8, 10, 12, 14]} color="#0288d1" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, bgcolor: '#1a2027', color: 'white' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Explore your data</Typography>
                            <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                Uncover performance and connection insights between entities.
                            </Typography>
                            <Button disabled variant="contained" size="small" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#eee' } }}>
                                Get insights
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Charts Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }} >
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Entity Distribution
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* The Donut Chart */}
                            <Box sx={{ flexShrink: 0 }}>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: stats.clients, label: 'Clients', color: '#0288d1' },
                                                { id: 1, value: stats.contacts, label: 'Contacts', color: '#01579b' },
                                            ],
                                            innerRadius: 70,
                                            outerRadius: 100,
                                            paddingAngle: 5,
                                            cornerRadius: 5,
                                            startAngle: -45,
                                            endAngle: 225,
                                        }
                                    ]}
                                    width={220}
                                    height={220}
                                    slotProps={{ legend: { hidden: true } }}
                                />
                            </Box>

                            {/* Information Panel */}
                            <Stack direction="column" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        Database Composition
                                    </Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#0288d1' }} />
                                            <Typography variant="body2">Clients</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{stats.clients}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#01579b' }} />
                                            <Typography variant="body2">Contacts</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{stats.contacts}</Typography>
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                        <strong>Ratio Analysis:</strong>
                                    </Typography>
                                    <Typography variant="caption" color="text.primary">
                                        Your database is currently <strong>{((stats.clients / (stats.clients + stats.contacts)) * 100).toFixed(0)}%</strong> Clients.
                                        Ideally, your Contact count should grow at a higher rate to ensure account coverage.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} >
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Network Connection Density
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={4}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* The Dual-Ring Pie Chart */}
                            <Box sx={{ flexShrink: 0 }}>
                                <PieChart
                                    series={[
                                        {
                                            // Inner Ring: Clients
                                            innerRadius: 0,
                                            outerRadius: 80,
                                            id: 'clients-series',
                                            data: [
                                                {
                                                    label: 'Linked Clients',
                                                    value: data?.clients?.filter(c => c.linkedContactsCount > 0).length || 0,
                                                    color: '#1976d2'
                                                },
                                                {
                                                    label: 'Unlinked Clients',
                                                    value: data?.clients?.filter(c => c.linkedContactsCount === 0).length || 0,
                                                    color: '#bbdefb'
                                                },
                                            ],
                                        },
                                        {
                                            // Outer Ring: Contacts
                                            innerRadius: 100,
                                            outerRadius: 130,
                                            id: 'contacts-series',
                                            data: [
                                                {
                                                    label: 'Linked Contacts',
                                                    value: data?.contacts?.filter(c => c.linkedClientsCount > 0).length || 0,
                                                    color: '#01579b'
                                                },
                                                {
                                                    label: 'Unlinked Contacts',
                                                    value: data?.contacts?.filter(c => c.linkedClientsCount === 0).length || 0,
                                                    color: '#e3f2fd'
                                                },
                                            ],
                                        },
                                    ]}
                                    width={400}
                                    height={350}
                                    slotProps={{
                                        legend: { hidden: true } // We'll create a custom descriptive legend
                                    }}
                                />
                            </Box>

                            {/* Dynamic Legend / Data Details */}
                            <Stack direction="column" spacing={2} sx={{ width: { xs: '100%', md: '40%' } }}>
                                <Box>
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                                        INNER RING: CLIENTS
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Clients: {stats.clients}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 'bold', color: '#01579b' }}>
                                        OUTER RING: CONTACTS
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Contacts: {stats.contacts}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                        Tip: Click on a segment to see the exact entity count for linked vs. standalone records.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;