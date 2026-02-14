import React, { useState, useMemo } from 'react';
import { 
    Typography, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, Box, Divider 
} from '@mui/material';

// MOCK DATA
const MOCK_CLIENTS = [
    { name: 'First National Bank', code: 'FNB001', contactCount: 5 },
    { name: 'Protea', code: 'PRO001', contactCount: 0 },
];

const Clients = () => {
    const [clients, setClients] = useState(MOCK_CLIENTS);
    const [isCreating, setIsCreating] = useState(false);
    const [nameInput, setNameInput] = useState('');

    // Logic for TGM001, JOS001, ITA001
    const generateCode = (name) => {
        if (!name.trim()) return '';
        const words = name.trim().split(/\s+/);
        let alpha = "";

        if (words.length >= 3) {
            alpha = words[0][0] + words[1][0] + words[2][0];
        } else if (words.length === 2) {
            const secondPart = words[1].length >= 2 ? words[1].substring(0, 2) : words[1] + "A";
            alpha = words[0][0] + secondPart;
        } else {
            alpha = words[0].replace(/[^a-zA-Z]/g, '').padEnd(3, 'A').substring(0, 3);
        }

        const prefix = alpha.toUpperCase();
        const count = clients.filter(c => c.code.startsWith(prefix)).length;
        return prefix + (count + 1).toString().padStart(3, '0');
    };

    const clientCode = useMemo(() => generateCode(nameInput), [nameInput, clients]);

    const sortedClients = useMemo(() => 
        [...clients].sort((a, b) => a.name.localeCompare(b.name)), [clients]);

    const handleSave = () => {
        if (!nameInput) return;
        setClients([...clients, { name: nameInput, code: clientCode, contactCount: 0 }]);
        setNameInput('');
        setIsCreating(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Clients</Typography>
                {!isCreating && (
                    <Button variant="contained" onClick={() => setIsCreating(true)}>Add Client</Button>
                )}
            </Box>

            {isCreating ? (
                <Paper sx={{ p: 3, maxWidth: 500 }}>
                    <Typography variant="h6" gutterBottom>New Client</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField 
                            label="Name" 
                            fullWidth 
                            value={nameInput} 
                            onChange={(e) => setNameInput(e.target.value)} 
                        />
                        <TextField 
                            label="Client Code" 
                            fullWidth 
                            value={clientCode} 
                            InputProps={{ readOnly: true }} 
                            helperText="Read-only: Auto-generated from name"
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                            <Button variant="outlined" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#fafafa' }}>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Client Code</TableCell>
                                <TableCell align="center">No. of linked contacts</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No client(s) found.</TableCell>
                                </TableRow>
                            ) : (
                                sortedClients.map((client) => (
                                    <TableRow key={client.code}>
                                        <TableCell align="left">{client.name}</TableCell>
                                        <TableCell align="left">{client.code}</TableCell>
                                        <TableCell align="center">{client.contactCount}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Clients;