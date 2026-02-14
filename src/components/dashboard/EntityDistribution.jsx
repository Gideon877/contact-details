import React from 'react';
import { Paper, Typography, Stack, Box, Divider } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const EntityDistribution = ({ clients, contacts }) => {
    const total = clients + contacts;
    const clientRatio = total > 0 ? ((clients / total) * 100).toFixed(0) : 0;

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3 }}>Entity Distribution</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box sx={{ flexShrink: 0 }}>
                    <PieChart
                        series={[{
                            data: [
                                { id: 0, value: clients, label: 'Clients', color: '#0288d1' },
                                { id: 1, value: contacts, label: 'Contacts', color: '#01579b' },
                            ],
                            innerRadius: 70, outerRadius: 100, paddingAngle: 5, cornerRadius: 5,
                        }]}
                        width={220} height={220} slotProps={{ legend: { hidden: true } }}
                    />
                </Box>
                <Stack direction="column" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>DATABASE COMPOSITION</Typography>
                        <LegendItem color="#0288d1" label="Clients" value={clients} />
                        <LegendItem color="#01579b" label="Contacts" value={contacts} />
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="caption">
                            Database is <strong>{clientRatio}%</strong> Clients. Grow contacts for better coverage.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
};

const LegendItem = ({ color, label, value }) => (
    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="body2">{label}</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Stack>
);

export default EntityDistribution;