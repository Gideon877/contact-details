import './App.css'
import { ApolloProvider } from "@apollo/client/react"
import Router from "./router"
import { client } from './graphql/graphqlClient'

function App() {
    <ApolloProvider client={client}>
        <Router />
    </ApolloProvider>
}

export default App

