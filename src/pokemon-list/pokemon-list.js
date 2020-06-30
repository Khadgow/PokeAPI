import React from 'react';
import PokeApiService from "../services/pokeapi-service";
import {Component} from 'react';
import PokemonDetails from "../pokemon-details/pokemon-details";
import './pokemon-list.scss'
import Filter from "../filter";
import Spinner from "../spinner";

export default class PokemonList extends Component{
    pokeApi = new PokeApiService();

    _isMounted= false;

    state = {
        pokemons: null,
        loading: true,
        next: null,
        filter: null,
        count: null,
        allWasLoaded: false
    };

    updatePokemons() {
        this.pokeApi.getAllPokemons().then((pokemons)=>{
            if(this._isMounted) this.setState({next: pokemons.next, count: pokemons.results.length});
                pokemons.results.forEach((pokemon) => {
                    const idRegExp = /\/([0-9]*)\/$/;
                    const id = pokemon.url.match(idRegExp)[1];
                    this.pokeApi.getPokemonStats(id).then(({attack, defence, hp}) => {
                            if (this._isMounted) {
                                this.pokemonWithStat(pokemon, attack, defence, hp);
                            }
                        }
                    ).then(() => {
                        if (this.state.count === this.state.pokemons.length && this._isMounted) {
                            this.setState({loading: false});
                        }
                    })
                });
        })
    }

    pokemonWithStat = (pokemon, attack, defence, hp) => {
        if(this._isMounted) this.setState(({pokemons}) => {
            if(!pokemons){
                return {pokemons: [{...pokemon, attack, defence, hp}]}
            }
            const newArr = [...pokemons, {...pokemon, attack, defence, hp}];
            return {pokemons: newArr}
        })
    };

    renderItems(arr) {
        return arr.map(({name, url}) => {
            const idRegExp =/\/([0-9]*)\/$/;
            const  id =url.match(idRegExp)[1];
            return <PokemonDetails name = {name} id = {id} key = {id} />
        })
    }


    onFilterChange= (filter) =>{
        if(this._isMounted) this.setState({filter});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.filter !== prevState.filter || this.state.pokemons !== prevState.pokemons){
            if(this.state.filter){
                if(this._isMounted) this.setState(({pokemons, filter}) => {
                        const sortArr = pokemons.sort((a, b) => {
                            return b[filter].base_stat - a[filter].base_stat;
                        });
                        return ({
                            pokemons: sortArr
                        });
                    })
            }
        }
    }


    componentDidMount() {
        this._isMounted = true;
        this.updatePokemons();
       window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        if ( document.getElementById("list").scrollHeight * 0.9 < window.scrollY + window.innerHeight && !this.state.loading && !this.state.allWasLoaded){
            if(this._isMounted) this.setState({loading: true});
                this.pokeApi.loadMorePokemons(this.state.next).then((pokemons) => {
                    if(pokemons === null) this.setState({allWasLoaded: true});
                    if(!this.state.allWasLoaded) {
                        if (this._isMounted) this.setState(({count}) => {
                            return {
                                next: pokemons.next,
                                count: count + pokemons.results.length
                            }
                        });
                        pokemons.results.forEach((pokemon) => {
                            const idRegExp = /\/([0-9]*)\/$/;
                            const id = pokemon.url.match(idRegExp)[1];
                            this.pokeApi.getPokemonStats(id).then(({attack, defence, hp}) => {
                                    this.pokemonWithStat(pokemon, attack, defence, hp);
                                }
                            ).then(() => {
                                if (this.state.count === this.state.pokemons.length && this._isMounted) {
                                    this.setState({loading: false});
                                }
                            })
                        })
                    }
            })
        }
    };


    render() {

        const {pokemons, filter, allWasLoaded} = this.state;
        if (!pokemons){
            return <Spinner/>;
        }

        const endElement = allWasLoaded? <div className="end">All pokemons was loaded</div> : null;

        const elements = this.renderItems(pokemons);

        return (
            <div>
                <Filter filter={filter} onFilterChange = {this.onFilterChange}/>
                <div id="list" className="pokemonList" onScroll={this.handleScroll}>
                    {elements}
                </div>
                {endElement}
            </div>
        )


    }
};



