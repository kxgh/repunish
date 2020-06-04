import React from "react";
import PropTypes from 'prop-types';
import Punishment from "../logic/Punishment";

const cx = {
    list: 'punish-chooser__list',
    listItem: 'punish-chooser__listitem',
    listItemSelected: 'punish-chooser__listitem--selected',
    intro: 'punish-chooser__intro',
    introInvalid: 'punish-chooser__intro__invalid'
};

const HomePunishChooser = React.forwardRef((props, ref) => {
    const {punishments, selected, onSelect, invalid} = props;
    const getLiClassName = isSelected => [cx.listItem, isSelected ? cx.listItemSelected : ''].join(' ');
    const selectedIds = selected.map(p => p.id);
    const isSelected = pid => selectedIds.includes(pid);
    return (
        <>
            <p ref={ref} className={`${cx.intro}`}>Choose your punishments:</p>
            {invalid && <p className={cx.introInvalid}>You need to select at least one!</p>}
            <ul className={cx.list}>
                {punishments.map((p, i) =>
                    <li key={p.id} onClick={e => onSelect(p)} className={getLiClassName(isSelected(p.id))}>
                        <p><i className={p.className}/></p>
                        <p>{p.name}</p>
                        {isSelected(p.id) ? <p>✓</p> : <p>X</p>}
                    </li>)}
            </ul>
        </>
    )
});

HomePunishChooser.propTypes = {
    punishments: PropTypes.arrayOf(PropTypes.instanceOf(Punishment)).isRequired,
    selected: PropTypes.arrayOf(PropTypes.instanceOf(Punishment)).isRequired,
    onSelect: PropTypes.func.isRequired,
    invalid: PropTypes.bool
};

export default HomePunishChooser;