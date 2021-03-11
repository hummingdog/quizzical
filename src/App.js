import React from 'react';
import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Build from './components/Build';
import './app.css';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
});

export default function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Header />
            <Switch>
                <Route path='/build'>
                    <ApolloProvider client={client}>
                        <Build />
                    </ApolloProvider>
                </Route>
            </Switch>
        </Router>
    );
}
