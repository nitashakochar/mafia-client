import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchGame, fetchUsers } from '../actions';

class Narration extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.renderPlayerStatus = this.renderPlayerStatus.bind(this);
  }

  componentDidMount() {
    this.props.fetchGame();
  }

  renderPlayerStatus() {
    if (!this.props.players) {
      return '';
    } else {
      return (
        this.props.players.map((playerId) => {
          return (
            <div className="playerStatusContainer">
              <div className="playerName">{this.props.users.findById(playerId).username}</div>
              if (playerStatus[players.indexOf(player.id)]){
                <img className="isAlive" src={this.props.users.findById(playerId).pic || ''} alt="Player Alive" key={playerId} />
              }
              else {
                <img className="isDead" src={this.props.users.findById(playerId).pic || ''} alt="Player Dead" key={playerId} />
              }
            </div>
          );
        })
      );
    }
  }

  render() {
    return (
      <div className="stage">
        <h1 className="stageTitle">The Village</h1>
        <div className="palyersStatusContainer">{this.renderPlayerStatus}</div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    playerStatus: state.game.playerStatus,
    players: state.game.players,
    users: state.users.all,
  }
);

export default withRouter(connect(mapStateToProps, { fetchGame, fetchUsers })(Narration));
