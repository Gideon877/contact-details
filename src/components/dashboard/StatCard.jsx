import React from 'react';
import { Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

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
                    sx={{ borderRadius: 1, fontWeight: 'bold', bgcolor: percentage > 0 ? '#e8f5e9' : '#ffebee' }}
                />
            </Stack>
            <Typography variant="caption" color="text.secondary">Last 30 days</Typography>
            <Box sx={{ height: 50, mt: 2 }}>
                <SparkLineChart data={data} height={50} showTooltip showHighlight colors={[color]} />
            </Box>
        </CardContent>
    </Card>
);

export default StatCard;