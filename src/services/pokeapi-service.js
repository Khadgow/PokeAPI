export default class PokeApiService {
    _apiBase = 'https://pokeapi.co/api/v2';

    getResource = async (url) =>{
        const res = await fetch(`${this._apiBase}${url}`);
        if (!res.ok){
            throw  new Error(`Could not fetch ${url}, received ${res.status}`)
        }
        return await res.json();
    };
    getAllPokemons = async () => {
        const res = await this.getResource(`/pokemon/?offset=0&limit=100`);
        return  res;
    };

    getPokemon = async (id) =>{
        return await this.getResource(`/pokemon/${id}`);
    };

    loadMorePokemons = async (url) =>{
        const res = await fetch(url);
        if (!res.ok){
            throw  new Error(`Could not fetch ${url}, received ${res.status}`)
        }

        if(res.headers.get('content-type')=== 'application/json; charset=utf-8'){
            return res.json();
        } else {
            return null;
        }

    };
    getPokemonStats = async  (id) => {
        const obj = await this.getResource(`/pokemon/${id}`);
        return {attack: obj.stats[4], defence: obj.stats[3], hp: obj.stats[5]}
    };

}
