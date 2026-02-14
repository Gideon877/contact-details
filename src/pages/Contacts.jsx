import React, { useState, useMemo } from 'react';
import { 
    Typography, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, Box, Link, Dialog, 
    DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress 
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client/react';

import { GET_CONTACTS, GET_CLIENTS } from '../graphql/queries';
import { 
    CREATE_CONTACT, 
    LINK_CONTACT_TO_CLIENT, 
    UNLINK_CONTACT_FROM_CLIENT 
} from '../graphql/mutations';

import ConfirmDialog from '../components/ConfirmDialog';

const Contacts = () => {
    const { data: contactsData, loading: contactsLoading, refetch } = useQuery(GET_CONTACTS, {
        fetchPolicy: 'cache-and-network'
    });
    const { data: clientsData } = useQuery(GET_CLIENTS);

    const contacts = useMemo(() => contactsData?.contacts || [], [contactsData]);
    const allClients = useMemo(() => clientsData?.clients || [], [clientsData]);

    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });

    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [activeContactId, setActiveContactId] = useState(null);
    const [selectedClientCode, setSelectedClientCode] = useState('');

    const [confirmState, setConfirmState] = useState({
        open: false,
        contactId: null,
        clientCode: null,
        clientName: ''
    });

    const [createContact] = useMutation(CREATE_CONTACT, { 
        onCompleted: () => { 
            refetch(); 
            setIsCreating(false); 
            setForm({ firstName: '', lastName: '', email: '', phone: '' }); 
        } 
    });

    const [linkClient] = useMutation(LINK_CONTACT_TO_CLIENT, { 
        refetchQueries: [{ query: GET_CONTACTS }, { query: GET_CLIENTS }],
        onCompleted: () => { 
            setLinkDialogOpen(false); 
            setSelectedClientCode(''); 
        } 
    });

    const [unlinkClient] = useMutation(UNLINK_CONTACT_FROM_CLIENT, { 
        refetchQueries: [{ query: GET_CONTACTS }, { query: GET_CLIENTS }]
    });

    const filteredClientOptions = useMemo(() => {
        const activeContact = contacts.find(c => c.id === activeContactId);
        if (!activeContact) return allClients;
        const linkedCodes = activeContact.linkedClients.map(c => c.code);
        return allClients.filter(client => !linkedCodes.includes(client.code));
    }, [contacts, activeContactId, allClients]);

    const handleOpenLinkDialog = (id) => {
        setActiveContactId(id);
        setLinkDialogOpen(true);
    };

    const handleConfirmLink = () => {
        if (!selectedClientCode || !activeContactId) return;
        linkClient({ variables: { contactId: activeContactId, clientCode: selectedClientCode } });
    };

    const handleOpenConfirmUnlink = (contactId, clientCode, clientName) => {
        setConfirmState({ open: true, contactId, clientCode, clientName });
    };

    const handleExecuteUnlink = () => {
        unlinkClient({ 
            variables: { 
                contactId: confirmState.contactId, 
                clientCode: confirmState.clientCode 
            } 
        });
        setConfirmState(prev => ({ ...prev, open: false }));
    };

    const handleSaveContact = () => {
        if (!form.firstName || !form.lastName || !form.email) return;
        createContact({ variables: { input: form } });
    };

    if (contactsLoading && !isCreating) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

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
                        <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                            <Button variant="contained" onClick={handleSaveContact}>Save</Button>
                            <Button variant="outlined" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#fafafa' }}>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Linked Clients</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center">No contact(s) found.</TableCell></TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow key={contact.id}>
                                        <TableCell>{`${contact.lastName}, ${contact.firstName}`}</TableCell>
                                        <TableCell>{contact.email}</TableCell>
                                        <TableCell align="center">{contact.linkedClientsCount}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {contact.linkedClients.map(client => (
                                                    <Link 
                                                        key={client.code} 
                                                        component="button" 
                                                        onClick={() => handleOpenConfirmUnlink(contact.id, client.code, client.name)}
                                                        sx={{ fontSize: '0.75rem', color: 'error.main', textDecoration: 'none' }}
                                                    >
                                                        Unlink {client.code}
                                                    </Link>
                                                ))}
                                                <Link 
                                                    component="button" 
                                                    onClick={() => handleOpenLinkDialog(contact.id)}
                                                    sx={{ fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}
                                                >
                                                    + Link Client
                                                </Link>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
                <DialogTitle>Link to Client</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    <TextField
                        select
                        fullWidth
                        label="Choose Client"
                        value={selectedClientCode}
                        onChange={(e) => setSelectedClientCode(e.target.value)}
                        variant="standard"
                        sx={{ mt: 2 }}
                    >
                        {filteredClientOptions.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                                {option.name} ({option.code})
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmLink} disabled={!selectedClientCode}>
                        Confirm Link
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog 
                open={confirmState.open}
                title="Unlink Client"
                message={`Are you sure you want to unlink ${confirmState.clientName} (${confirmState.clientCode})?`}
                confirmText="Unlink"
                color="error"
                onConfirm={handleExecuteUnlink}
                onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
            />
        </Box>
    );
};

export default Contacts;