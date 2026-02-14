import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
    query GetClients {
        clients {
            id
            name
            code
            linkedContactsCount
        }
    }
`;

export const GET_CONTACTS = gql`
    query GetContacts {
        contacts {
            id
            firstName
            lastName
            email
            phone
            linkedClientsCount
            linkedClients {
                id
                name
                code
            }
        }
    }
`;