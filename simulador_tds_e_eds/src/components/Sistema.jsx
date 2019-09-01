import React, { Component } from 'react';
import EDS from './Eds'
import TDS from './Tds'

export default class Sistema extends Component {

    constructor(props){
        super(props);
        this.state = { tds: true, eds: false }
    }

    tdsActiveNotify = () => {
        this.setState({ tds: true, eds: false })
    }

    edsActiveNotify = () => {
        this.setState({ tds: false, eds: true })
    }

    render() {
        return (
            this.state.tds ?
                <TDS activeNotify={ () => this.edsActiveNotify } /> :
                <EDS activeNotify={ () => this.tdsActiveNotify } />
        );
    }
}