import './App.css'
import { ApolloProvider } from "@apollo/client/react"
import Router from "./router"
import { client } from './graphql/graphqlClient'

function App() {
    return (
        <ApolloProvider client={client}>
            <Router />
        </ApolloProvider>
    )
}

export default App

