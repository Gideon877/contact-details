import React, { useState, useMemo } from 'react';
import {
    Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TextField,
    Box, Divider
} from '@mui/material';
import { generateClientCode } from '../utils/helpers';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');

    // Sort clients by Name Ascending
    const sortedClients = useMemo(() => {
        return [...clients].sort((a, b) => a.name.localeCompare(b.name));
    }, [clients]);

    // Calculate the code based on name input
    const autoCode = useMemo(() => {
        if (!newName) return '';

        // We generate the prefix first to check for duplicates in the existing list
        const tempCode = generateClientCode(newName, 0);
        const prefix = tempCode.substring(0, 3);

        // Count how many existing clients share this specific 3-letter prefix
        const matchCount = clients.filter(c => c.code.startsWith(prefix)).length;

        return generateClientCode(newName, matchCount);
    }, [newName, clients]);

    const handleSave = () => {
        const newClient = {
            name: newName,
            code: autoCode,
            contactsCount: 0 // Default for new client
        };
        setClients([...clients, newClient]);
        setNewName('');
        setShowForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Clients</Typography>
                {!showForm && (
                    <Button variant="contained" onClick={() => setShowForm(true)}>
                        Create New Client
                    </Button>
                )}
            </Box>

            {showForm ? (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" mb={2}>Create Client</Typography>
                    <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <TextField
                            label="Client Code"
                            variant="outlined"
                            value={autoCode}
                            InputProps={{ readOnly: true }}
                            helperText="Automatically generated based on name"
                        />
                        <Box display="flex" gap={2}>
                            <Button variant="contained" color="primary" onClick={handleSave}>Save Client</Button>
                            <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Typography color="textSecondary">
                        Note: Use the Contacts section in the Drawer to link multiple clients to contacts.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="left"><strong>Name</strong></TableCell>
                                <TableCell align="left"><strong>Client Code</strong></TableCell>
                                <TableCell align="center"><strong>No. of Linked Contacts</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No client(s) found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedClients.map((client, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">{client.name}</TableCell>
                                        <TableCell align="left">{client.code}</TableCell>
                                        <TableCell align="center">{client.contactsCount}</TableCell>
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