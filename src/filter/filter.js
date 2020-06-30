import React, {Component} from "react";
import './filter.scss'
export default class Filter extends Component{

    buttons = [
        {name: "attack", label: "Attack"},
        {name: "defence", label: "Defence"},
        {name: "hp", label: "Hp"},
    ];


    render() {
        const {filter, onFilterChange} = this.props;
        const buttons = this.buttons.map(({name, label})=>{
            const isActive = filter===name;
            const clazz = isActive ? 'button-active' : 'button-unactivated';
           return(
               <button type="button" className={`filter-button ${clazz}`} onClick={() => onFilterChange(name)} key={name}>{label}</button>
           )
        });
        return(
            <div className="buttons-group">
                {buttons}
            </div>
        )
    }

}
