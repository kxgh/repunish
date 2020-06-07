import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import Challenge from "../logic/Challenge";
import Player from "../logic/Player";
import {DURATIONS, MISC, random} from "../logic/globals";
import TimeElapsedIndicator from "./TimeElapsedIndicator";
import PlayerAvatar from "./PlayerAvatar";
import Verdict from "./Verdict";
import * as Consts from "../logic/consts";

const QD_PHASES = {
    INTRO: 1,
    SOLVING: 2,
    OVER: 3
};


class QuestDuel extends React.Component {

    constructor(props) {
        super(props);
        const p1 = props.player;
        const p2 = random.pickPlayerForDuel(props.players, p1);
        this.state = {
            p1,
            p2,
            task: props.challenge.task,
            options: [],
            correct: false,
            qdPhase: QD_PHASES.INTRO,
            round: 0,
            timeout: null
        };
        this.begin = this.begin.bind(this);
        this.restart = this.restart.bind(this);
        this.playerAnswered = this.playerAnswered.bind(this);

    }

    restart() {
        this.state.qdPhase < QD_PHASES.OVER && this.setState(prevState => {
            const ns = this.props.challenge.generator();
            ns.round = prevState.round + 1;
            ns.timeout = setTimeout(this.restart, DURATIONS.QUEST_DUEL);
            prevState.qdPhase === QD_PHASES.INTRO && (ns.qdPhase = QD_PHASES.SOLVING);
            return ns
        });
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeout);
        this.keyListener && window.removeEventListener('keydown', this.keyListener);
    }

    playerAnswered(player, idledPlayer) {
        clearTimeout(this.state.timeout);
        if (this.state.qdPhase === QD_PHASES.SOLVING) {
            this.props.actions.onIncorrect(this.state.correct ? idledPlayer : player);
            this.setState({
                qdPhase: QD_PHASES.OVER
            });
        }
    }

    begin() {
        if (!this.keyListener) {
            this.keyListener = e => {
                if (e && e.key) {
                    e.key.toLowerCase() === Consts.DUEL_P1_KEY && this.playerAnswered(this.state.p1, this.state.p2);
                    e.key.toLowerCase() === Consts.DUEL_P2_KEY && this.playerAnswered(this.state.p2, this.state.p1);
                }
            };
            window.addEventListener('keydown', this.keyListener);
        }
        this.state.qdPhase === QD_PHASES.INTRO && this.restart();
    }

    render() {
        const {p1, p2, task, round, options, qdPhase} = this.state;
        const {challenge, players} = this.props;
        const tutorialMsg = MISC.ON_TOUCH_DEVICE ? 'Tap on your avatar to answer.' : `${Consts.DUEL_P1_KEY.toUpperCase()} key ` +
            `for ${p1.name}, ${Consts.DUEL_P2_KEY.toUpperCase()} key for ${p2.name}`;

        return (
            <div>
                <div className={cx.body}>
                    <p className={cx.type}>{challenge.type}</p>
                    {qdPhase === QD_PHASES.INTRO && <>
                        <p className={`${cx.task} ${cx.taskLarge}`}>
                            <span className={cx.accent}>{p1.name}</span>
                            &nbsp; vs &nbsp;
                            <span className={cx.accent}>{p2.name}</span>

                        </p>
                        <p>{tutorialMsg}</p>
                        <button className={cx.revealBtn} onClick={this.begin}>We're ready</button>
                    </>}
                    {qdPhase > QD_PHASES.INTRO && <>
                        <p className={cx.task}>Press when contains: <span className={cx.accent}>{task}</span></p>
                        <p>{options.map(o => <i key={o} className={`ra ra-${o}`}/>)}</p>
                        <TimeElapsedIndicator key={round}
                                              duration={DURATIONS.QUEST_DUEL}
                                              paused={qdPhase !== QD_PHASES.SOLVING}/>
                        {qdPhase === QD_PHASES.SOLVING && <div className={cx.avatarBtns}>
                            <p className={cx.avatarBtn} onClick={e => this.playerAnswered(p1, p2)}>
                                <PlayerAvatar imgSrc={p1.avatar}/>
                            </p>
                            <p className={cx.avatarBtn} onClick={e => this.playerAnswered(p2, p1)}>
                                <PlayerAvatar imgSrc={p2.avatar}/>
                            </p>
                        </div>}

                    </>}
                </div>
                {qdPhase >= QD_PHASES.OVER && <>
                    <Verdict challenge={challenge} players={players}/>
                    <button onClick={this.props.actions.onFulfill} className={cx.fulfillBtn}>✓</button>
                </>}
            </div>)
    }
}

QuestDuel.propTypes = {
    actions: PropTypes.object.isRequired,
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    player: PropTypes.instanceOf(Player).isRequired
};

export default QuestDuel
