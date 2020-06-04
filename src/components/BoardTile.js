import React from "react";
import PropTypes from "prop-types";
import Player from "../logic/Player";
import Tile from "../logic/Tile";
import Challenge from "../logic/Challenge";

const cx = {
    boardTileContainer: 'board-tile',
    tilePlayers: 'board-tile__players',
    clickable: 'board-tile--clickable',
    helpable: 'board-tile--helpable',
    avatarTurn: 'board-tile__players__avatar--turn',
    avatar: 'board-tile__players__avatar'
};

const BoardTile = React.forwardRef((props, ref) => {
    const {tile, players, modifier, onTileClick, turnPlayer} = props;
    const tileClass = [cx.boardTileContainer, modifier ? modifier : ''].join(' ');
    const bgStyle = {backgroundImage: `url('${Challenge.IMGS[tile.type]}')`};

    return (
        <div className={tileClass} style={bgStyle} onClick={e => onTileClick(tile)} ref={ref}>
            <div className={cx.tilePlayers}>
                {players.map(p => {
                    const imgClassName = `${cx.avatar} ${p.id === turnPlayer.id ? cx.avatarTurn : ''}`;
                    return <img key={p.id} alt={p.name} src={p.avatar} className={imgClassName}/>
                })}
            </div>
        </div>
    )
});

BoardTile.MODIFIERS = {
    CLICKABLE: cx.clickable,
    HELPABLE: cx.helpable
};


BoardTile.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player).isRequired).isRequired,
    turnPlayer: PropTypes.instanceOf(Player),
    tile: PropTypes.instanceOf(Tile),
    onTileClick: PropTypes.func,
    modifier: PropTypes.string
};
export default BoardTile;