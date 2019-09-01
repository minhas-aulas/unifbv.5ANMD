import React, { Component } from 'react';
import Cliente from "./Cliente";
import Atendimento from './Atendimento';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import AutorenewIcon from '@material-ui/icons/Autorenew';

let count = 0;
const MAX_RANDOM = 8;
let atendimentoInterval = null;
let filaInterval = null;

export default class Tds extends Component {

    constructor(props){
        super(props);
        this.state = this._initialState();
    }

    _initialState = () => {
        return {
            fila: [],
            atendimento: [],
            filaLog: '',
            tamanhoDafila: '',
            paused: true,
            numeroDeAtendente: 3,
            tempoMaximoAtendimento: 10,
            tempoAtendimento: 0,
            btnText: 'Iniciar Sistema',
        };
    }

    _iniciarAtendimento = () => {
        let tempoAtendimento = this.state.tempoMaximoAtendimento;

        let incTime = () => {
            let { paused } = this.state;
            if (!paused) {
                if (tempoAtendimento === 0) {
                    this._gerenciarAtendimento();
                    tempoAtendimento = this.state.tempoMaximoAtendimento;
                }
                this.setState({ tempoAtendimento: tempoAtendimento }, () => {})
                tempoAtendimento -= 1;
            }
        }

        atendimentoInterval = setInterval(incTime, 1000);
    }

    _gerenciarAtendimento = () => {
        let { fila, paused, numeroDeAtendente } = this.state;
        // Verifica se existe o pelo menos 1 cliente na fila
        if (!paused && fila.length >= 1) {
            let loops = fila.length < numeroDeAtendente ? fila.length : numeroDeAtendente;
            // Adiciona clientes ao atendimento
            let atendimento = [];
            for (let i = 0; i < loops; ++i) {
                atendimento.push(fila[i]);
            }
            // remove os clientes em atendimento da fila
            fila.splice(0, numeroDeAtendente);
            // Seta o estado
            this.setState({
                fila: fila,
                atendimento: atendimento,
                tamanhoDafila: this._getTamanhoDafilaText()
            });
        }
    }

    _gerenciarFila = () => {
        filaInterval = setInterval(() => {
            let { fila, paused } = this.state;
            // Verifica o status do sistema
            if (!paused) {
                // Random clientes a adicionar na fila
                let random = Math.floor(Math.random() * MAX_RANDOM) + 1;
                // Adiciona os novos clientes
                for (let i = 0; i < random; ++i) {
                    count += 1;
                    fila.push(count)
                }
                // Seta o estado
                this.setState({
                    fila: fila,
                    filaLog: this._getFilaLogText(random),
                    tamanhoDafila: this._getTamanhoDafilaText()
                })
            }
        }, 3500)
    }

    _getFilaLogText = (n) => {
        let cliente = n === 1 ? 'cliente' : 'clientes';
        let entrou = n === 1 ? 'entrou' : 'entraram';
        return n + ' ' + cliente + ' ' + entrou + ' na fila.';
    }

    _getTamanhoDafilaText = (n) => {
        let cliente = n === 1 ? 'cliente' : 'clientes';
        return 'Total de ' + this.state.fila.length + ' ' + cliente + ' na fila.'
    }

    _handlerBtnOnClick = () => {
        let paused = this.state.paused
        let btnText = paused ? 'Pausar Sistema' : this._initialState().btnText;
        this.setState({
            paused: !paused,
            btnText: btnText
        })
    }

    _handlerRestartOnClick = () => {
        this.setState(this._initialState(), () => { count = 0 })
    }

    _handlerInputOnChange = (e) => {
        if (e.target.value <= 1) {
            this.setState({ numeroDeAtendente: 1 })
        } else {
            this.setState({ numeroDeAtendente: e.target.value })
        }
    }

    _handlerInputTempoMaximoAtendimentoOnChange = (e) => {
        if (e.target.value <= 1) {
            this.setState({ tempoMaximoAtendimento: 1 })
        } else {
            this.setState({ tempoMaximoAtendimento: e.target.value })
        }
    }

    componentDidMount() {
        this._gerenciarFila();
        this._iniciarAtendimento();
    }

    componentWillUnmount() {
        clearInterval(atendimentoInterval);
        clearInterval(filaInterval);
    }

    render() {
        return (
            <div className='container' style={{ marginTop: '10px' }}>
                <div className="d-inline-block" style={{ marginLeft: '5px' }}>
                    <h3>UniFBV - TDS</h3>
                    {
                        this.state.paused ?
                            <span className="form-text text-warning">
                                Sistema pausado !!!
                            </span> :
                            <span className="form-text text-success">
                                Sistema em atendimento ...
                            </span>
                    }
                </div>

                {/* Botoes */}
                <div className="float-md-right">
                    <button className='btn btn-md btn-primary'
                        onClick={this._handlerBtnOnClick}
                        style={{ marginRight: '5px', marginTop: '3px' }}>
                        {this.state.paused ? <PlayArrowIcon /> : <PauseIcon />}
                         {this.state.btnText}
                    </button>

                    <button className='btn btn-md btn-danger'
                        onClick={this._handlerRestartOnClick}
                        style={{ marginRight: '5px', marginTop: '3px' }}>
                        <AutorenewIcon /> Reinciar Sistema
                    </button>
                </div>

                <div className="float-md-right">
                    <button className='btn btn-md btn-dark disabled'
                        style={{ marginRight: '5px', marginTop: '3px' }}
                        disabled>
                        <CheckCircleIcon /> TDS
                    </button>
                    <button className='btn btn-md btn-light'
                        style={{ marginRight: '5px', marginTop: '3px' }}
                        onClick={this.props.activeNotify()}>
                        <RadioButtonUncheckedIcon /> EDS
                    </button>
                </div>

                <hr />

                <div className="row">
                    {/* Clientes em atendimento */ }
                    <div className="col-md-7">
                        <div className="">
                            <h4>Cliente(s) em atendimento:</h4>
                            {
                                this.state.atendimento.map((v, k) => (
                                    <Atendimento key={v} text={'C'+ v} />
                                ))
                            }
                            <p id="numero_atendentes" className="form-text text-muted">
                                {this.state.tempoAtendimento} segundos para iniciar o próximo atendimento.
                            </p>
                        </div>
                    </div>

                    {/* Configuracoes */}
                    <div className="col-md-5">
                        <div className="form-group">
                            <input type="number" className="form-control" id="numero_atendentes"
                                onChange={this._handlerInputOnChange}
                                value={this.state.numeroDeAtendente} />
                            <small id="numero_atendentes" className="form-text text-muted">
                                Define a quantidade de atendentes no sistema.
                            </small>
                        </div>

                        <div className="form-group">
                            <input type="number" className="form-control" id="time_max"
                                onChange={this._handlerInputTempoMaximoAtendimentoOnChange}
                                value={this.state.tempoMaximoAtendimento}
                                min="1" />
                            <small id="time_max" className="form-text text-muted">
                                Define o tempo de atendimentos em segundos
                            </small>
                        </div>
                    </div>
                </div>



                {/* Clientes em fila de espera */ }
                <div className="jumbotron">
                    <h4>{this.state.filaLog}</h4>
                    {
                        this.state.fila.map((v, k) => (
                            <Cliente
                                key={ v }
                                top='0%'
                                left={ '0%' }
                                text={ 'C' + v }
                            />
                        ))
                    }
                    <h4 className='text-primary'>{this.state.tamanhoDafila}</h4>
                </div>

                <p className='float-md-right'>Time-driven simulation (TDS) by Fabio Santos, 2019.</p>
            </div>
        );
    }
}