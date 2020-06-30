import React from "react";
import PokeApiService from "../services/pokeapi-service";
import {Component} from 'react';
import './pokemon-details.scss';
import {withRouter} from 'react-router-dom';

class PokemonDetails extends Component {
 PokeApi = new PokeApiService();

 _isMounted= false;

 state = {
     stats: null,
     sprite: null
 };

    componentDidMount() {
        this._isMounted= true;
        this.PokeApi.getPokemon(this.props.id).then((p) =>{
            if(this._isMounted) this.setState({
                stats: p.stats,
                sprite: p.sprites.front_default
            });
        })
    }

    componentWillUnmount() {
        this._isMounted= false;
    }


 render() {

     const {name, history, id} = this.props;
     const { sprite} = this.state;
     if(sprite) {
         return (
             <div className="container">
                 <div className="pokemonCard" onClick={() => {
                     history.push(`/pokemons/${id}`)
                 }}>
                     <img src={sprite} alt="Pokemon sprite"/>
                     <p>{name}</p>
                 </div>
             </div>
         )
     } else{
         return null;
     }
 }
}

export default withRouter(PokemonDetails);
