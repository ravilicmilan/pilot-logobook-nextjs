import React from 'react';
import classes from './Checkbox.module.css';

export default function Checkbox(props) {
  return (
    <label className={['flex-row', 'flex-start', classes.Checkbox].join(' ')}>
      <input
        type='checkbox'
        onChange={props.onChange}
        checked={props.checked}
        name={props.name}
      />
      <span className={classes.LabelText}>{props.labelText}</span>
    </label>
  );
}
