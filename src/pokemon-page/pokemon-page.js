import React, {Component} from "react";
import PokeApiService from "../services/pokeapi-service";
import './pokemon-page.scss'

export default class PokemonPage extends Component{
PokeApi = new PokeApiService();

_isMounted = false;

state = {
    loading: true,
    name: null,
    stats: null,
    sprite: null,
    height: null,
    weight: null
};

componentDidMount() {
    this._isMounted = true;
    this.PokeApi.getPokemon(this.props.itemId).then((p) => {
        if( this._isMounted) {
            this.setState({
                loading: false,
                name: p.name,
                stats: p.stats,
                sprite: p.sprites.front_default,
                height: p.height,
                weight: p.weight
            })
        }
    })
}

componentWillUnmount() {
    this._isMounted = false;
}

    renderStats(arr) {
    return  arr.map(({base_stat, stat}) => {
        return <p key={stat.name}>{stat.name}: {base_stat}</p>
    })
}

    render() {

    const {loading ,name, stats, sprite, height, weight} = this.state;

    if(loading){
        return <h1>Loading...</h1>
    }

    const statEl = this.renderStats(stats);

        return(
          <div className="pokemon-page">
              <p style={{fontSize: "40px"}}>{name}</p>
              <img src={sprite} alt="Pokemon sprite"/>
              <p>height: {height}</p>
              <p>weight: {weight}</p>
              {statEl}
          </div>
        );
    }
}
