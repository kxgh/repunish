import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import PlayerAvatar from "./PlayerAvatar";

const cx = {
    container: 'game-over',
    accent: 'game-over--accent',
    mostPunished: 'game-over__most-punished',
    mostPunishedIcon: 'game-over__most-punished__icon',
    mostPunishedName: 'game-over__most-punished__name',
    mostPunishedTitle: 'game-over__most-punished__title',
    globals: 'game-over__globals',
    introTitle: 'game-over__intro-title',
    playerStats: 'game-over__player-stats',
    playerStat: 'game-over__ps',
    playerStatName: 'game-over__ps__name',
    playerStatRC: 'game-over__ps__rc',
    playerStatDRS: 'game-over__ps__drs',
    playerStatPC: 'game-over__ps__pc'
};

const GameOverScreen = ({summary, players}) => {
    const {playersStats, globalStats} = summary;
    return (
        <div className={cx.container}>
            <p className={cx.introTitle}>IT'S OVER</p>

            <div className={cx.mostPunished}>
                <i className={'ra ra-player-shot ra-5x'}/>
                <p>Most punished player:</p>
                <p><span className={cx.accent}>{globalStats.mostPunishedPlayer.name}</span></p>
            </div>

            <div className={cx.globals}>
                <p>First to finish the game: <span className={cx.accent}>{globalStats.firstFinished.name}</span></p>
                <p>Total punishments: <span className={cx.accent}>{globalStats.punishCount}</span></p>
                <p>Dice sum: <span className={cx.accent}>{globalStats.diceResultSum}</span></p>
            </div>

            <div className={cx.playerStats}>
                {playersStats.map(ps => {
                    const player = ps.player;
                    return (
                        <div key={player.id} className={cx.playerStat}>
                            <PlayerAvatar imgSrc={player.avatar}/>
                            <p className={cx.playerStatName}>{player.name}</p>
                            <p className={cx.playerStatRC}>Rolled {ps.rollCount} times</p>
                            <p className={cx.playerStatDRS}>Rolled a total of {ps.diceResultSum}</p>
                            <p className={cx.playerStatPC}>Total punishments: {ps.punishCount}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

GameOverScreen.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    summary: PropTypes.object.isRequired
};

export default GameOverScreen