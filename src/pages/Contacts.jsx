import React, { useState, useMemo } from 'react';
import { 
    Typography, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, Box, Link, Dialog, 
    DialogTitle, DialogContent, DialogActions, MenuItem 
} from '@mui/material';

// MOCK DATA - This would be your GraphQL Query result later
const ALL_CLIENTS = [
    { name: 'First National Bank', code: 'FNB001' },
    { name: 'Protea', code: 'PRO123' },
    { name: 'IT Solutions', code: 'ITA001' },
    { name: 'Global Tech', code: 'GLO001' },
    { name: 'Standard Bank', code: 'STD002' }
];

const Contacts = () => {
    const [contacts, setContacts] = useState([
        { firstName: 'Thabang', lastName: 'Magaola', email: 'thabang@example.com', linkedClients: ['FNB001'] }
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

    // State for Linking Dialog
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [activeContactEmail, setActiveContactEmail] = useState(null);
    const [selectedClientCode, setSelectedClientCode] = useState('');

    // 1. Identify the current contact being edited to filter available options
    const activeContact = useMemo(() => 
        contacts.find(c => c.email === activeContactEmail), 
    [contacts, activeContactEmail]);

    // 2. Filter available clients: exclude those already linked to this contact
    const filteredClientOptions = useMemo(() => {
        if (!activeContact) return ALL_CLIENTS;
        return ALL_CLIENTS.filter(client => 
            !activeContact.linkedClients.includes(client.code)
        );
    }, [activeContact]);

    const sortedContacts = useMemo(() => {
        return [...contacts].sort((a, b) => {
            const fullNameA = `${a.lastName} ${a.firstName}`;
            const fullNameB = `${b.lastName} ${b.firstName}`;
            return fullNameA.localeCompare(fullNameB);
        });
    }, [contacts]);

    const handleOpenLinkDialog = (email) => {
        setActiveContactEmail(email);
        setLinkDialogOpen(true);
    };

    const handleConfirmLink = () => {
        if (!selectedClientCode) return;
        
        setContacts(prev => prev.map(contact => {
            if (contact.email === activeContactEmail) {
                return { 
                    ...contact, 
                    linkedClients: [...contact.linkedClients, selectedClientCode] 
                };
            }
            return contact;
        }));
        
        // Reset state
        setLinkDialogOpen(false);
        setSelectedClientCode('');
        setActiveContactEmail(null);
    };

    const handleUnlink = (email, clientCode) => {
        setContacts(prev => prev.map(contact => 
            contact.email === email 
            ? { ...contact, linkedClients: contact.linkedClients.filter(code => code !== clientCode) }
            : contact
        ));
    };

    const handleSaveContact = () => {
        setContacts([...contacts, { ...form, linkedClients: [] }]);
        setForm({ firstName: '', lastName: '', email: '' });
        setIsCreating(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Contacts</Typography>
                {!isCreating && (
                    <Button variant="contained" onClick={() => setIsCreating(true)}>Add Contact</Button>
                )}
            </Box>

            {isCreating ? (
                <Paper sx={{ p: 3, maxWidth: 500 }}>
                    <Typography variant="h6" gutterBottom>New Contact</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="First Name" fullWidth value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} />
                        <TextField label="Surname" fullWidth value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} />
                        <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                            <Button variant="contained" onClick={handleSaveContact}>Save</Button>
                            <Button variant="outlined" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <>
                    {sortedContacts.length === 0 ? (
                        <Typography variant="body1">No contact(s) found.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell align="left">Full Name</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="center">No. of linked clients</TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedContacts.map((contact) => (
                                        <TableRow key={contact.email}>
                                            <TableCell align="left">{`${contact.lastName} ${contact.firstName}`}</TableCell>
                                            <TableCell align="left">{contact.email}</TableCell>
                                            <TableCell align="center">{contact.linkedClients.length}</TableCell>
                                            <TableCell align="left">
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                                    {contact.linkedClients.map(code => (
                                                        <Link 
                                                            key={code}
                                                            component="button"
                                                            onClick={() => handleUnlink(contact.email, code)}
                                                            sx={{ fontSize: '0.75rem', color: 'error.main', textDecoration: 'none' }}
                                                        >
                                                            Unlink {code}
                                                        </Link>
                                                    ))}
                                                    <Link 
                                                        component="button" 
                                                        onClick={() => handleOpenLinkDialog(contact.email)}
                                                        sx={{ fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}
                                                    >
                                                        + Link Client
                                                    </Link>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}

            {/* Selection Dialog for Linking */}
            <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
                <DialogTitle>Link to Client</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                        Showing only clients not currently linked to {activeContact?.firstName}.
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        label="Choose Client"
                        value={selectedClientCode}
                        onChange={(e) => setSelectedClientCode(e.target.value)}
                        variant="standard"
                        sx={{ mt: 2 }}
                    >
                        {filteredClientOptions.length > 0 ? (
                            filteredClientOptions.map((option) => (
                                <MenuItem key={option.code} value={option.code}>
                                    {option.name} ({option.code})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No more clients available</MenuItem>
                        )}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleConfirmLink}
                        disabled={!selectedClientCode}
                    >
                        Confirm Link
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Contacts;