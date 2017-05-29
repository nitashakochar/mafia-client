import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Nav from './nav';
import { healPlayer } from '../actions';

class DoctorSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.renderSelection = this.renderSelection.bind(this);
    this.onDoctorHeal = this.onDoctorHeal.bind(this);
    this.onHealClicked = this.onHealClicked.bind(this);
    this.onTestClicked = this.onTestClicked.bind(this);
  }

  componentDidMount() {
    this.props.fetch(this.props.game.id);
  }

  onDoctorHeal() {
    console.log('doctorheal');
    if (localStorage.getItem('role') === 'doctor') {
      console.log(document.querySelector('input[name="doctor"]:checked'));
      console.log(document.querySelector('input[name="doctor"]:checked').value);
      const doctor = document.querySelector('input[name="doctor"]:checked').value;
      this.props.healPlayer(doctor);
    }
    this.props.updateStage(this.props.game.id, 6);
  }

  onHealClicked() {
    this.onDoctorHeal();
  }

  onTestClicked() {
    this.props.updateStage(this.props.game.id, 6);
  }

  renderSelection() {
    if (!localStorage.getItem('role')) { // this just checks if data has been fetched and mapped to props yet
      return '';
    } else if (localStorage.getItem('role') === 'doctor') {
      return (
        this.props.players.map((player) => {
          if (player.status) {
            return (
              <div className="players_container">
                <div>
                  <input type="radio" name="doctor" value={player.id} />
                  <div className="playerAliveName">{player.name}</div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="players_container">
                <div>
                  <input type="radio" name="doctor" value={player.id} />
                  <div className="playerDeadName">{player.name}</div>
                </div>
              </div>
            );
          }
        })
      );
    } else {
      console.log('whatuppppp');
      return (
        <div className="wait">Waiting for the doctor to save someone...
        </div>
      );
    }
  }


  render() {
    console.log('Entered doctor selection');
    if (localStorage.getItem('role') === 'doctor') {
      return (
        <div>
          <Nav />
          <div className="RolesContainer">
            {this.renderSelection()}
            <button onClick={this.onHealClicked}> Next </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Nav />
          <div>
            {this.renderSelection()}
            <button onClick={this.onTestClicked}> Force-next </button>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    players: state.players.all,
    game: state.game,
  }
);

export default withRouter(connect(mapStateToProps, { healPlayer })(DoctorSelection));
