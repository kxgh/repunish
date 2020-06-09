import React from "react";
import {punishments, gcx} from "../logic/globals";
import Player from "../logic/Player";
import PropTypes from 'prop-types';
import HomePunishChooser from "./HomePunishChooser";
import HomePlayerList from "./HomePlayerList";
import PlayerEditor from "./PlayerEditor";

const cx = {
    container: 'home',

    imageContainer: 'home__image-container',
    imageEffect: 'home__image-effect',
    imageHeader: 'home__header-image',
    imageFooter: 'home__footer-image',

    homeLogo: 'home__logo',
    introRules: 'intro__rules',

    setupSection: 'setup-section',
    setupPlayers: 'setup-section__players',
    punishInfo: 'punish__info',

    playersContainer: 'players',
    player: 'players__player',
    playerName: 'player__name',
    playerAvatar: 'player__avatar',

    logoGlyph: 'ra ra-death-skull ra-lg home__logo-glyph',

    start: 'home__start'
};

const scrollTo = el => {
    if (el.current)
        el = el.current;
    if (el && el.scrollIntoView) {
        el.scrollIntoView({behavior: 'smooth'});
    } else window.scrollTo(0, el.offsetTop);
    return true
};

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [
                new Player(),
                new Player()
            ],
            isEditingPlayer: false,
            editedPlayer: null,
            chosenPunishments: [],
            highlightInvalid: false
        };
        this.savePlayer = this.savePlayer.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.togglePlayerEditing = this.togglePlayerEditing.bind(this);
        this.choosePunishment = this.choosePunishment.bind(this);
        this.validateBeforeStart = this.validateBeforeStart.bind(this);

        this.punishChooserRef = React.createRef();
        this.playerListRef = React.createRef();
    }

    choosePunishment(selectedPunishment) {
        this.setState(prevState => {
            const insert = !prevState.chosenPunishments.map(p => p.id).includes(selectedPunishment.id);
            let nsp = [...prevState.chosenPunishments];
            nsp = insert ? nsp.concat([selectedPunishment]) : nsp.filter(p => p.id !== selectedPunishment.id);
            return {chosenPunishments: nsp}
        });
    }

    togglePlayerEditing(player) {
        this.setState(prevState => ({
            isEditingPlayer: !prevState.isEditingPlayer,
            editedPlayer: player ? player : new Player()
        }));
    }

    savePlayer(player) {
        this.setState(prevState => {
            return {
                players: player ? prevState.players.map(p => p.id === player.id ? player : p)
                    : prevState.players.concat([new Player()]),
                isEditingPlayer: false
            }
        });
    }

    deletePlayer(player) {
        this.setState(prevState => ({
            players: prevState.players.filter(p => p.id !== player.id),
            isEditingPlayer: false
        }));
    }

    validateBeforeStart() {
        if ((!this.state.chosenPunishments.length && scrollTo(this.punishChooserRef)) ||
            (this.state.players.length < 2 && scrollTo(this.playerListRef))) {
            this.setState({
                highlightInvalid: true
            });
            return false
        }
        return true
    }

    render() {
        const {onStart} = this.props;
        const {chosenPunishments, players, isEditingPlayer, editedPlayer, highlightInvalid} = this.state;
        const {choosePunishment, savePlayer, deletePlayer, togglePlayerEditing, validateBeforeStart} = this;
        const playerEditorKey = editedPlayer ? editedPlayer.id : -1;
        return (
            <article className={cx.container}>
                <header className={cx.imageContainer}>
                    <div className={cx.imageEffect + ' ' + cx.imageHeader}/>
                    <h1 className={cx.homeLogo}>
                        Punishment&nbsp;<i className={cx.logoGlyph}/>&nbsp;Game
                    </h1>
                </header>
                <section className={`${cx.setupSection} ${cx.punishInfo} ${gcx.skewedBorder}`}>
                    <h2>
                        Rules:
                    </h2>
                    <ul>
                        <li>take turns</li>
                        <li>roll the dice</li>
                        <li>do badly = <i className={cx.logoGlyph}/></li>
                        <li>have no luck = <i className={cx.logoGlyph}/></li>
                    </ul>
                </section>
                <section className={`${cx.setupSection} ${gcx.skewedBorder}`}>
                    <HomePunishChooser punishments={punishments.getAll()} selected={chosenPunishments}
                                       onSelect={choosePunishment}
                                       invalid={highlightInvalid && !chosenPunishments.length}
                                       ref={this.punishChooserRef}
                    />
                </section>
                <section className={`${cx.setupSection} ${cx.setupPlayers} ${gcx.skewedBorder}`}>
                    <HomePlayerList players={players}
                                    hidden={isEditingPlayer}
                                    onPlayerAdd={e => savePlayer()}
                                    onPlayerEdit={p => togglePlayerEditing(p)}
                                    invalid={highlightInvalid && players.length < 2}
                                    ref={this.playerListRef}
                    />
                    <PlayerEditor key={playerEditorKey} player={editedPlayer} onPlayerSave={savePlayer}
                                  onPlayerDelete={deletePlayer} hidden={!isEditingPlayer}/>
                </section>
                <footer className={cx.imageContainer}>
                    <div className={cx.imageEffect + ' ' + cx.imageFooter}/>
                    <h2 className={`${cx.start} ${gcx.attentionBg} ${gcx.btnLarge}`} onClick={e => {
                        if (validateBeforeStart())
                            onStart({players, chosenPunishments})
                    }}>
                        <i className={cx.logoGlyph}/>&nbsp;Begin&nbsp;<i className={cx.logoGlyph}/>
                    </h2>
                </footer>

            </article>

        )
    }

}

Home.propTypes = {
    onStart: PropTypes.func.isRequired
};

export default Home;
