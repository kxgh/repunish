import React, {useState} from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import {avatars} from "../logic/globals";
import {utils} from "../logic/globals";
import PlayerAvatar from "./PlayerAvatar";

const cx = {
    container: 'player-editor',
    bg: 'player-editor-bg',
    bgHidden: 'player-editor-bg--hidden',
    hidden: 'player-editor--hidden',
    label: 'player-editor__label',
    avatar: 'player-editor__avatar',
    avatarChoosing: 'player-editor__avatar--choosing',
    avatarPages: 'player-editor__avatar__pages',
    name: 'player-editor__name',
    luck: 'player-editor__luck',
    footer: 'player-editor__footer',
    btn: 'player-editor__btn',
    intro: 'player-editor__intro'
};

const AvatarBtn = (pname, nthSrc, onClick) => {
    const avatarSrc = avatars.nthSrc(nthSrc);
    return (
        <PlayerAvatar imgSrc={avatarSrc} key={nthSrc} onClick={e => {
            onClick(avatarSrc)
        }}/>
    )
};

const luckToWord = luck => {
    if (luck === 1)
        return 'favorable';
    if (luck > 1)
        return 'blessed';
    if (luck === -1)
        return 'unfavorable';
    if (luck < -1)
        return 'cursed';
    return 'default';
};

const avatarResultsPerPage = 8;
const PlayerEditor = ({player, onPlayerSave, onPlayerDelete, hidden}) => {
    const [name, setName] = useState(player ? player.name : '');
    const [luck, setLuck] = useState(player ? player.luck || 0 : 0);
    const [avatar, setAvatar] = useState(player ? player.avatar : '');
    const [isChoosingAvatar, setChoosingAvatar] = useState(false);
    const [avatarCurrentPage, setAvatarCurrentPage] = useState(1);

    if (!player)
        return null;

    const save = () => {
        const clone = utils.clonePlayer(player, true);
        clone.name = name || player.name;
        clone.avatar = avatar;
        clone.luck = luck;
        onPlayerSave(clone);
    };

    const toggleChoosingAvatar = () => {
        setChoosingAvatar(!isChoosingAvatar);
    };
    const togglePlayerLuck = () => {
        const p = [-2, -1, 0, 1, 2];
        setLuck(p[(p.indexOf(luck) + 1) % p.length]);
    };
    const nextPage = () => setAvatarCurrentPage(avatarCurrentPage + 1);
    const prevPage = () => avatarCurrentPage === 1 ?
        setAvatarCurrentPage(Math.ceil(avatars.size() / avatarResultsPerPage)) :
        setAvatarCurrentPage(avatarCurrentPage - 1);


    const containerClassName = [cx.container, hidden ? cx.hidden : ''].join(' ');
    const avatarClassName = [cx.avatar, isChoosingAvatar ? cx.avatarChoosing : ''].join(' ');
    const bgClassName = [cx.bg, hidden ? cx.bgHidden : ''].join(' ');
    return (
        <>
            <ul className={containerClassName}>
                <li className={avatarClassName} onClick={toggleChoosingAvatar}>
                    {!isChoosingAvatar &&
                    <>
                        <p className={cx.label}>{name}'s avatar:</p>
                        <PlayerAvatar imgSrc={avatar}/>
                    </>}
                    {isChoosingAvatar &&
                    <>
                        {[...Array(avatarResultsPerPage).keys()].map(i => AvatarBtn(player.name,
                            (avatarCurrentPage - 1) * avatarResultsPerPage + i,
                            avatarSrc => {
                                setAvatar(avatarSrc)
                            }
                        ))}
                    </>}
                </li>
                {isChoosingAvatar &&
                <li className={cx.avatarPages}>
                    <span onClick={prevPage} className={cx.btn}>&lt; prev page</span>
                    <span onClick={nextPage} className={cx.btn}>next page &gt;</span>
                </li>}
                {!isChoosingAvatar &&
                <li className={cx.name}>
                    <p className={cx.label}>Player's name:</p>
                    <input type="text" value={name}
                           onChange={e => setName(e.target.value)}
                           maxLength={10}
                           onKeyDown={e => {
                               e.key && e.key.toLowerCase() === 'enter' && save()
                           }}
                           onClick={e => e.target.value === player.name && setName('')}
                    />

                </li>}
                {!isChoosingAvatar &&
                <li className={cx.luck} onClick={togglePlayerLuck}>
                    <p>Player's luck: {luckToWord(luck)}</p>
                </li>
                }
                {!isChoosingAvatar && <li className={cx.footer}>
                    <span onClick={e => onPlayerDelete(player)} className={cx.btn}><i
                        className="ra ra-poison-cloud"/></span>
                    <span onClick={save} className={cx.btn}>✓</span>
                </li>}
            </ul>
            <div className={bgClassName}/>
        </>
    )
};

PlayerEditor.propTypes = {
    player: PropTypes.instanceOf(Player),
    onPlayerSave: PropTypes.func.isRequired,
    onPlayerDelete: PropTypes.func.isRequired,
    hidden: PropTypes.bool
};

export default PlayerEditor;