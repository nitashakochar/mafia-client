import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { fetchGames } from '../actions';
import Nav from './nav';

class JoinGame extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.fetchGames();
  }

  renderNames(game) {
    return game.players.map((user) => {
      return (
        <div>{user.name}</div>
      );
    });
  }

  render() {
    const gamelinks = this.props.games.all.map((game) => {
      return (
        <Link to={`/lobby/${game.id}`}>
          <button id="gamelink">
            Players: {this.renderNames(game)}
          </button>
        </Link>
      );
    });

    if (!this.props.games.all) {
      return '';
    } else {
      return (
        <div>
          <Nav />
          <ul className="joingameUpper">
            <li>
              <Link to={'/home'}>
                <i className="fa fa-chevron-left" aria-hidden="true" /> Back
              </Link>
            </li>
          </ul>
          <div className="gamelinks">
            {gamelinks}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    games: state.game,
  }
);

export default withRouter(connect(mapStateToProps, { fetchGames })(JoinGame));
