import Select from './Select';
import { typeOfFlightEnum } from '@/lib/config';

export default function TypeOfFlightSelect(props) {
  return (
    <Select
      name={props.name}
      hasDefaultDisabled={props.hasDefaultDisabled}
      labelText={props.labelText}
      value={props.value}
      options={typeOfFlightEnum}
      styles={props.styles}
      onChange={props.onChange}
    />
  );
}
