import React from 'react';
import classes from './Button.module.css';

export default function Button(props) {
  const handleClick = () => {
    if (!props.disabled) {
      props.onClick();
    }
  };

  const styles = ['flex-center', 'flex-column', classes.Button];

  if (props.type) {
    styles.push(classes[props.type]);
  } else {
    styles.push(classes.Primary);
  }

  if (props.buttonSmall) {
    styles.push(classes.Small);
  }

  if (props.disabled) {
    styles.push(classes.Disabled);
  }

  return (
    <div
      onClick={handleClick}
      style={props.styles}
      className={styles.join(' ')}
    >
      {props.buttonText}
    </div>
  );
}
