import React from 'react';
import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Build from './components/Build';
import './app.css';
import QuestionsProvider from "./providers/questions/provider";

export default function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Header />
            <Switch>
                <Route path='/build'>
                    <QuestionsProvider>
                        <Build />
                    </QuestionsProvider>
                </Route>
            </Switch>
        </Router>
    );
}
