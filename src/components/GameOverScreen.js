import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import PlayerAvatar from "./PlayerAvatar";
import {gcx} from "../logic/globals";

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
        <article className={cx.container}>
            <header className={cx.introTitle}>
                <p>IT'S OVER</p>
            </header>

            <section className={`${cx.mostPunished} ${gcx.skewedBorder}`}>
                <i className={'ra ra-player-shot ra-5x'}/>
                <p>Most punished player:</p>
                <p><span className={cx.accent}>{globalStats.mostPunishedPlayer.name}</span></p>
                <PlayerAvatar imgSrc={globalStats.mostPunishedPlayer.avatar}/>
            </section>

            <section className={`${cx.globals} ${gcx.skewedBorder}`}>
                <p>First to finish the game: <span className={cx.accent}>{globalStats.firstFinished.name}</span></p>
                <p>Total punishments: <span className={cx.accent}>{globalStats.punishCount}</span></p>
                <p>Dice sum: <span className={cx.accent}>{globalStats.diceResultSum}</span></p>
            </section>

            <section className={`${cx.playerStats} ${gcx.skewedBorder}`}>
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
            </section>
        </article>
    )
};

GameOverScreen.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    summary: PropTypes.object.isRequired
};

export default GameOverScreen