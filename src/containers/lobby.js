import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { createGame, createPlayers, updatePlayers, fetchPlayers, getPlayers, addUserToGame, fetchGame, checkEnd, deleteGame, resetVotes } from '../actions';
import Chat from './chat';
import { socketserver } from './app';
import Players from './playersDisplay';
import DoctorSelect from './doctor_selection';
import MafiaSelect from './mafia_selection';
import PoliceSelect from './police_selection';
import Voting from './voting';
import Nav from './nav';
import CountVotes from './count_votes';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.socket = io(socketserver);

    this.socket.on('fetchAll', () => {
      console.log('fetchAll');
      this.props.fetchPlayers(this.props.game.id);
      this.props.fetchGame(this.props.game.id);
    });

    this.socket.on('connect', () => {
      if (window.location.pathname === '/lobby' || window.location.pathname === '/lobby/') {
        this.props.createGame(localStorage.getItem('token'), this.props.history)
        .then(() => {
          this.props.getPlayers(localStorage.getItem('token'), this.props.match.params.gameID);
          this.socket.emit('join', this.props.match.params.gameID);
        });
      } else {
        this.props.getPlayers(localStorage.getItem('token'), this.props.match.params.gameID);
        this.socket.emit('join', this.props.match.params.gameID);
      }
      setTimeout(() => this.props.fetchGame(this.props.match.params.gameID), 1000);
    });

    this.state = {
      game: '',
      players: [],
    };

    // this.renderPlayers = this.renderPlayers.bind(this);
    this.onPlayClicked = this.onPlayClicked.bind(this);
    this.refetchAll = this.refetchAll.bind(this);
    this.tempOnPlayClicked = this.tempOnPlayClicked.bind(this);
    this.onQuitClicked = this.onQuitClicked.bind(this);
    this.onReplayClicked = this.onReplayClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.game.stage !== nextProps.game.stage) {
      switch (nextProps.game.stage) {
        case 0:
          break;
        case 1:
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 2 });
          }, 2000);
          break;
        case 2:
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 3 });
          }, 2000);
          break;
        case 3:
          break;
        case 4:
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 5 });
          });
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          break;
        case 8:
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 9 });
          }, 8000);
          break;
        case 9:
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 10 });
          }, 2000);
          break;
        case 10:
          this.props.resetVotes(this.props.game.id);
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 11 });
          }, 2000);
          break;
        case 11:
          this.props.checkEnd(this.props.game.id);
          setTimeout(() => {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 12 });
          }, 1000);
          break;
        case 12:
          if (!nextProps.game.isOver) {
            this.socket.emit('updateStage', { id: this.props.game.id, stage: 3 });
          }
          break;
        default:
          break;
      }
    }
  }

  // Switch Stages
  // creates player objects based off of array of users
  onPlayClicked(event) {
    const playerIds = this.props.game.players.map((player) => { return player._id; });
    console.log(playerIds);
    this.props.createPlayers(this.props.game.id, playerIds);
    // this.props.advanceStage(this.props.game.id);
    this.socket.emit('updateStage', { id: this.props.game.id, stage: 1 });
  }
//  onPlayClicked, players are created.

  onQuitClicked(event) {
    this.props.deleteGame(this.props.game.id);
    this.props.history.push('/');
  }

  onReplayClicked(event) {
    this.socket.emit('updateStage', { id: this.props.game.id, stage: 2 });
  }

// must delete
  tempOnPlayClicked(event) {
    this.socket.emit('updateStage', { id: this.props.game.id, stage: 4 });
  }

  // backtoStage3() {
  //   this.props.updateStage(this.props.game.id, 3);
  // }

  refetchAll() {
    this.props.fetchPlayers(this.props.game.id);
    this.props.fetchGame(this.props.game.id);
  }

  renderPlayButton() {
    if (this.props.game.players.length >= 1 && localStorage.getItem('userID') === this.props.game.creator) {
      return (<button onClick={this.onPlayClicked} id="render-butt" className="PlayButton">Play</button>);
    } else {
      return (<div />);
    }
  }

  // Stage 0: users are stored in "players"
  renderPlayers() {
    return this.props.game.players.map((player) => {
      return (<li key={player.id}>{player.name}</li>); // this is actually a user id
    });
  }

  renderRole() {
    switch (localStorage.getItem('role')) {
      // 0: mafia, 1: doctor, 3: police, 4-6: village
      case 'mafia':
        return (
          <div className="roleAssigned">
            <h3 className="mafia-text">Mafia</h3>
            <img src="/images/mafia.png" alt="Mafia" />
          </div>
        );
      case 'doctor':
        return (
          <div className="roleAssigned">
            <h3 className="doctor-text">Doctor</h3>
            <img src="/images/doctor.png" alt="Doctor" />
          </div>
        );
      case 'police':
        return (
          <div className="roleAssigned">
            <h3 className="police-text">Police</h3>
            <img src="/images/police.png" alt="Police" />
          </div>
        );
      case 'villager':
        return (
          <div className="roleAssigned">
            <h3 className="villager-text">Villager</h3>
            <img src="/images/villager.png" alt="Villager" />
          </div>
        );
      default: return 'none. Why don\'t you have role? It\'s probably Adam\'s fault.';
    }
  }

  // Stage 0: Show Players Connected, Waiting for Players
  renderStage0() {
    return (
      <div>
        <h3>Players Connected:</h3>
        <ul>
          {this.renderPlayers()}
          {this.renderPlayButton()}
        </ul>
      </div>
    );
  }

  // Stage 1: Assigning Role Processing
  renderStage1() {
    return (
      <div>
        <h3>Assigning Roles...</h3>
        <div>
          <div className="spinny-loady" />
        </div>
      </div>
    );
  }

  // Stage 2: Dislay Assigned Roles to Individual Player
  renderStage2() {
    return (
      <div className="card">
        <h3>Roles have been assigned!</h3>
        <h2>Your role is:</h2>
        <div>{this.renderRole()}</div>
        <span>Will automatically advance stage after 10 secs</span>
      </div>
    );
  }

  // Stage 3:Display all players
  renderStage3() {
    return (
      <div className="stage3">
        <Players fetch={id => this.socket.emit('fetch', id)} />
        <button className="next-butt" onClick={this.tempOnPlayClicked}>Next</button>
      </div>
    );
  }

  // Stage 4: Night falls
  renderStage4() {
    return (
      <div className="nightFall">The Night Falls</div>
    );
  }

  // Stage 5: Mafia Kill
  renderStage5() {
    return (
      <div className="night">
        <MafiaSelect fetch={id => this.socket.emit('fetch', id)} updateStage={(id, stage) => this.socket.emit('updateStage', { id, stage: 6 })} />
      </div>
    );
  }

  // Stage 6: Doctor Heal
  renderStage6() {
    return (
      <div className="night stage">
        <DoctorSelect fetch={id => this.socket.emit('fetch', id)} updateStage={id => this.socket.emit('updateStage', { id, stage: 7 })} />
      </div>
    );
  }

  // Stage 7: Police Reveal
  renderStage7() {
    return (
      <div className="night stage">
        <PoliceSelect fetch={id => this.socket.emit('fetch', id)} updateStage={id => this.socket.emit('updateStage', { id, stage: 8 })} />
      </div>
    );
  }

  renderStage8() {
    return (
      <div>
        <h3>It is Day Time</h3>
        <Voting />
      </div>
    );
  }

  renderStage9() {
    return (
      <div>
        <CountVotes />
      </div>
    );
  }

  renderStage10() {
    return (
      <div>
        <h3>The people have spoken!</h3>
        <h5>The village has decided to kill...</h5>
        <div>{this.props.players.deadMan.name}</div>
      </div>
    );
  }

  renderStage11() {
    return (
      <div>
        <div className="spinny-loady" />
      </div>
    );
  }

  renderStage12() {
    return (
      <div className="stage12">
        <div id="gameover">GAME OVER</div>
        <div>Winner is {this.props.game.winner}</div>
        <div className="stage12-butt">
          <button onClick={this.onQuitClicked} id="quit-butt">Quit?</button>
          <button onClick={this.onReplayClicked} id="quit-butt">Replay?</button>
        </div>
      </div>
    );
  }

  renderStages() {
    switch (this.props.game.stage) {
      case 0:
        return <div className="stage">{this.renderStage0()}</div>;
      case 1:
        return <div className="stage">{this.renderStage1()}</div>;
      case 2:
        return <div className="stage">{this.renderStage2()}</div>;
      case 3:
        return <div className="stage">{this.renderStage3()}</div>;
      case 4:
        return <div className="stage">{this.renderStage4()}</div>;
      case 5:
        return <div className="stage">{this.renderStage5()}</div>;
      case 6:
        return <div className="stage">{this.renderStage6()}</div>;
      case 7:
        return <div className="stage">{this.renderStage7()}</div>;
      case 8:
        return <div>{this.renderStage8()}</div>;
      case 9:
        return <div>{this.renderStage9()}</div>;
      case 10:
        return <div>{this.renderStage10()}</div>;
      case 11:
        return <div>{this.renderStage11()}</div>;
      case 12:
        return <div>{this.renderStage12()}</div>;
      default: return '';
    }
  }

  renderChat() {
    if (!this.props.match.params.gameID) {
      return (
        <div className="chat-load">
          <div className="spinny-loady" />
          <div>
            If loading continues for more than 10 seconds, try force reloading.
          </div>
        </div>
      );
    }
    return (
      <Chat gameID={this.props.match.params.gameID} reload={this.refetchAll} />
    );
  }

  render() {
    if (!this.props.game) {
      return <div>Loading</div>;
    } else {
      return (
        <div>
          <Nav />
          <div className="lobby-container">
            {console.log(this.props.game.stage)}
            <div className="StagesSec">
              <div className="StagesDisplay">{this.renderStages()}</div>
              <div className="chat-section">
                {this.renderChat()}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  game: state.game,
  users: state.users,
  players: state.players,
});

export default withRouter(connect(mapStateToProps, { createPlayers, createGame, updatePlayers, fetchPlayers, getPlayers, addUserToGame, fetchGame, checkEnd, resetVotes, deleteGame })(Lobby));
