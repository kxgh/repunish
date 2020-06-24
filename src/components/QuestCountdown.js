import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import Challenge from "../logic/Challenge";
import Player from "../logic/Player";
import PlayerAvatar from "./PlayerAvatar";
import Verdict from "./Verdict";

const QC_PHASES = {
    INTRO: 1,
    SOLVING: 2,
    SUCCESS: 3,
    FAIL: 4
};


class QuestCountdown extends React.Component {

    constructor(props) {
        super(props);

        this.timeout = null;
        this.zeroHitTime = null;
        this.task = props.challenge.task;

        this.state = {
            player: props.player,
            currentNum: this.task.startFrom + 1,
            displayedNum: null, // will be set by restart
            mistake: 0,
            qcPhase: QC_PHASES.INTRO,
            showFulfillBtn: false
        };
        this.begin = this.begin.bind(this);
        this.restart = this.restart.bind(this);
        this.playerAnswered = this.playerAnswered.bind(this);
    }

    restart() {
        this.state.qcPhase <= QC_PHASES.SOLVING && this.setState(prevState => {
            clearTimeout(this.timeout);
            const currentNum = prevState.currentNum - 1;
            const displayedNum = currentNum > this.task.hideAt ? currentNum : '???';
            this.timeout = setTimeout(this.restart, this.task.interval);
            const ns = {currentNum, displayedNum};
            if (prevState.qcPhase === QC_PHASES.INTRO) {
                ns.qcPhase = QC_PHASES.SOLVING;
                this.zeroHitTime = Date.now() + currentNum * this.task.interval;
            }
            return ns
        });
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeout);
        this.keyListener && window.removeEventListener('keydown', this.keyListener);
    }

    playerAnswered() {
        if (this.state.qcPhase === QC_PHASES.SOLVING) {
            clearTimeout(this.state.timeout);
            const ns = {mistake: this.zeroHitTime - Date.now()};
            ns.qcPhase = Math.abs(ns.mistake) <= this.task.tolerance ? QC_PHASES.SUCCESS : QC_PHASES.FAIL;
            if (ns.qcPhase === QC_PHASES.FAIL)
                this.props.actions.onIncorrect(this.props.player);
            this.setState(ns)
            setTimeout(() => {
                this.setState({showFulfillBtn: true})
            }, 2000);
        }
    }

    begin() {
        this.state.qcPhase === QC_PHASES.INTRO && this.restart();
    }

    render() {
        const {player, displayedNum, mistake, qcPhase, showFulfillBtn} = this.state;
        const {challenge, players} = this.props;
        const tutorialMsg = `Press exactly when the timer reaches zero. The timer will get hidden soon.`;

        const formatMistake = succeeded => {
            if (!mistake)
                return null;
            const suffix = mistake > 0 ? 'early' : 'late';
            const secs = ('' + (Math.abs(mistake) / 1000)).substr(0, 4);
            return `${secs} seconds ${succeeded ? '' : 'too'} ${suffix}`
        };

        return (
            <div>
                <div className={cx.body}>
                    <p className={cx.type}>{challenge.type}</p>
                    {qcPhase <= QC_PHASES.SOLVING &&
                    <>
                        <p className={`${cx.task}`}>{tutorialMsg}</p>
                        <p className={`${cx.task} ${cx.accent}`}>
                            Tolerance: {(''+(this.task.tolerance/1000)).substr(0,4)} seconds</p>
                    </>}
                    {qcPhase === QC_PHASES.INTRO &&
                    <button className={cx.revealBtn} onClick={this.begin}>I'm ready</button>}
                    {qcPhase === QC_PHASES.SOLVING && <>
                        <p className={cx.task}>Press when timer reaches zero:</p>
                        <p className={`${cx.task} ${cx.accent}`}>{displayedNum}</p>
                    </>}

                    {qcPhase <= QC_PHASES.SOLVING && <div className={cx.avatarBtns}>
                        <p className={cx.avatarBtn} onClick={this.playerAnswered}>
                            <PlayerAvatar imgSrc={player.avatar}/>
                        </p>
                    </div>}
                    {qcPhase === QC_PHASES.SUCCESS && <>
                        <p className={`${cx.task} ${cx.accent}`}>Success!</p>
                        <p className={`${cx.task}`}>{formatMistake(true)}</p>
                        <br/>
                    </>}
                    {qcPhase === QC_PHASES.FAIL && <p className={`${cx.task} ${cx.accent}`}>{formatMistake()}</p>}

                </div>
                {qcPhase > QC_PHASES.SOLVING && <Verdict challenge={challenge} players={players}/>}
                {showFulfillBtn &&
                <button onClick={this.props.actions.onFulfill} className={cx.fulfillBtn}>✓</button>}
            </div>)
    }
}

QuestCountdown.propTypes = {
    actions: PropTypes.object.isRequired,
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    player: PropTypes.instanceOf(Player).isRequired
};

export default QuestCountdown
