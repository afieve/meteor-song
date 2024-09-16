import React from 'react';
import logo from './logo.svg';
import './App.css';
import QueryButton from './components/QueryButton';


function App() {
    return (
        <div className="App">
            <h1>Meteor Song</h1>
            <QueryButton queryPath={''} title={'check server response'} />
            <QueryButton queryPath={'ml'} title={'get all meteorite landings data'} />
        </div>
    );
}

export default App;
