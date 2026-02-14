import React from 'react';
import { Paper, Typography, Stack, Box, Divider } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const ConnectionDensity = ({ clientsData, contactsData, stats }) => {
    const linkedClients = clientsData?.filter(c => c.linkedContactsCount > 0).length || 0;
    const unlinkedClients = (stats.clients - linkedClients);
    const linkedContacts = contactsData?.filter(c => c.linkedClientsCount > 0).length || 0;
    const unlinkedContacts = (stats.contacts - linkedContacts);

    return (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Network Connection Density</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                <PieChart
                    series={[
                        {
                            innerRadius: 0, outerRadius: 80,
                            data: [
                                { label: 'Linked Clients', value: linkedClients, color: '#1976d2' },
                                { label: 'Unlinked Clients', value: unlinkedClients, color: '#bbdefb' },
                            ],
                        },
                        {
                            innerRadius: 100, outerRadius: 130,
                            data: [
                                { label: 'Linked Contacts', value: linkedContacts, color: '#01579b' },
                                { label: 'Unlinked Contacts', value: unlinkedContacts, color: '#e3f2fd' },
                            ],
                        },
                    ]}
                    width={400} height={350} slotProps={{ legend: { hidden: true } }}
                />
                <Stack spacing={2} sx={{ width: { xs: '100%', md: '40%' } }}>
                    <Box>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>INNER RING: CLIENTS</Typography>
                        <Typography variant="body2" color="text.secondary">Total: {stats.clients}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#01579b' }}>OUTER RING: CONTACTS</Typography>
                        <Typography variant="body2" color="text.secondary">Total: {stats.contacts}</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default ConnectionDensity;