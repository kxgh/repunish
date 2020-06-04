import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import {gcx} from "../logic/globals";
import Challenge from "../logic/Challenge";
import PlayerPicker from "./PlayerPicker";
import Player from "../logic/Player";
import Verdict from "./Verdict";


const QuestMultiCond = ({challenge, actions, players}) => {
    const [pickedIds, setPickedIds] = React.useState(null);
    const [verdictPhase, setVerdictPhase] = React.useState(false);

    const onPickedPlayersConfirmed = (pickedPlayers) => {
        if (verdictPhase)
            return;
        if (pickedPlayers && pickedPlayers.length) {
            actions.onIncorrect(pickedPlayers);
            setPickedIds(pickedPlayers.map(p => p.id));

        }
        setVerdictPhase(true);
    };

    const introText = verdictPhase ? [`${challenge.prefix} `, ' gets punished.'] :
        [`Select ${challenge.prefix.toLowerCase()} `, ''];

    return (
        <>
            <div className={cx.body}>
                <p className={cx.type}>{challenge.type}</p>
                <p className={`${cx.task} ${cx.taskLarge} ${verdictPhase ? gcx.appearAnim : ''}`}>{introText[0]}
                    <span className={cx.accent}>{challenge.task}</span>
                    {introText[1]}
                </p>
            </div>
            {!verdictPhase && <PlayerPicker players={players} onConfirm={pls => {
                onPickedPlayersConfirmed(pls)
            }}/>}
            {verdictPhase &&
            <Verdict players={players.filter(p => pickedIds && pickedIds.includes(p.id))} challenge={challenge}/>}
            {verdictPhase && <button onClick={actions.onFulfill} className={cx.fulfillBtn}>✓</button>}
        </>
    )
};

QuestMultiCond.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    actions: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired
};

export default QuestMultiCond