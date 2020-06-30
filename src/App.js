import React from 'react';
import './App.scss';
import PokemonList from "./pokemon-list";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import PokemonPage from "./pokemon-page";
import Header from "./header";

const App = () => {

    return(
        <div id="page">
            <Header/>
            <Router>
            <Route path="/" component={PokemonList} exact />
            <Route path="/pokemons/:id" render={({match}) => {
                const {id} = match.params;
                return <PokemonPage itemId = {id}/>;
            }}/>
            </Router>
        </div>
        );

};

export default App;
