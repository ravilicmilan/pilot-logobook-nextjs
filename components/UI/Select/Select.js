import classes from './Select.module.css';

export default function Select(props) {
  // console.log('SELECT RENDER:::', props);
  return (
    <>
      <label>{props.labelText}</label>
      <select
        value={props.value}
        name={props.name}
        className={classes.Select}
        onChange={props.onChange}
        style={props.styles}
      >
        {props.hasDefaultDisabled && (
          <option value='' disabled>
            Select Option
          </option>
        )}
        {props.options.map((o, idx) => (
          <option key={idx} value={o}>
            {o}
          </option>
        ))}
      </select>
    </>
  );
}
