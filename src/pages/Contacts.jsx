import React, { useState, useMemo } from 'react';
import { 
    Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, TextField, 
    Box, Link 
} from '@mui/material';

const Contacts = () => {
    const [contacts, setContacts] = useState([]); // Array of { firstName, lastName, email, linkedClients: [] }
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

    // Sort: Surname Name ASC
    const sortedContacts = useMemo(() => {
        return [...contacts].sort((a, b) => {
            const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
            const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }, [contacts]);

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName) return;
        setContacts([...contacts, { ...formData, linkedClients: [] }]);
        setFormData({ firstName: '', lastName: '', email: '' });
        setShowForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Contacts</Typography>
                {!showForm && (
                    <Button variant="contained" onClick={() => setShowForm(true)}>
                        Create New Contact
                    </Button>
                )}
            </Box>

            {showForm ? (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" mb={2}>Create Contact</Typography>
                    <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
                        <TextField 
                            label="First Name" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                        <TextField 
                            label="Surname" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                        <TextField 
                            label="Email Address" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Box display="flex" gap={2} mt={1}>
                            <Button variant="contained" onClick={handleSave}>Save Contact</Button>
                            <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <>
                    {sortedContacts.length === 0 ? (
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                            No contact(s) found.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell align="left">Full Name</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="center">No. of Linked Clients</TableCell>
                                        <TableCell align="left" /> {/* Action Column No Header */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedContacts.map((contact, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">
                                                {`${contact.lastName} ${contact.firstName}`}
                                            </TableCell>
                                            <TableCell align="left">{contact.email}</TableCell>
                                            <TableCell align="center">
                                                {contact.linkedClients?.length || 0}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Link 
                                                    component="button" 
                                                    variant="body2" 
                                                    onClick={() => {/* Unlink logic */}}
                                                    sx={{ color: 'error.main', textDecoration: 'none' }}
                                                >
                                                    Unlink
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Box>
    );
};

export default Contacts;