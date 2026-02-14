import { gql } from '@apollo/client';

export const CREATE_CLIENT = gql`
    mutation CreateClient($input: CreateClientInput!) {
        createClient(input: $input) {
            id
            name
            code
            linkedContactsCount
        }
    }
`;

export const CREATE_CONTACT = gql`
    mutation CreateContact($input: CreateContactInput!) {
        createContact(input: $input) {
            id
            firstName
            lastName
            email
            phone
            linkedClientsCount
        }
    }
`;

export const LINK_CONTACT_TO_CLIENT = gql`
    mutation LinkContactToClient($contactId: String!, $clientCode: String!) {
        linkContactToClient(contactId: $contactId, clientCode: $clientCode) {
            id
            linkedClients {
                id
                name
                code
            }
            linkedClientsCount
        }
    }
`;

export const UNLINK_CONTACT_FROM_CLIENT = gql`
    mutation UnlinkContactFromClient($contactId: String!, $clientCode: String!) {
        unlinkContactFromClient(contactId: $contactId, clientCode: $clientCode) {
            id
            linkedClientsCount
        }
    }
`;