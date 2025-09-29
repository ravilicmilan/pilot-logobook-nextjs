'use client';
import classes from './SearchParams.module.css';
import Button from '@/components/UI/Button/Button';
import SearchOperatorsSelect from '@/components/UI/Select/SearchOperatorsSelect';
import TypeOfFlightSelect from '@/components/UI/Select/TypeOfFlightSelect';
import TableKeyValueSelect from '@/components/UI/Select/TableKeyValueSelect';
import Input from '@/components/UI/Input/Input';

export default function SearchParams(props) {
  const {
    removeParam,
    onLabelChange,
    searchParam,
    onOperatorChange,
    onValueChange,
    idx,
  } = props;

  const handleLabelChange = (e) => {
    onLabelChange(idx, e.target.value);
  };

  const handleOperatorChange = (e) => {
    onOperatorChange(idx, e.target.value);
  };

  const handleValueChange = (e) => {
    onValueChange(idx, e.target.value);
  };

  const handleRemoveParam = (e) => {
    removeParam(idx);
  };

  // console.log('SEARCH PARAMS RENDER::', props.searchParam);

  return (
    <div
      className={[
        'flex-center',
        'flex-row',
        'flex-gap-20',
        classes.SearchParams,
      ].join(' ')}
    >
      <Button
        buttonSmall
        buttonText='-'
        onClick={handleRemoveParam}
        type='Close'
      />
      <TableKeyValueSelect
        key={'label-select'}
        onChange={handleLabelChange}
        value={searchParam.label}
        styles={{ width: '170px' }}
      />
      <SearchOperatorsSelect
        key={'label-operator'}
        onChange={handleOperatorChange}
        value={searchParam.operator}
        styles={{ width: '50px' }}
      />
      {searchParam.label === 'type_of_flight' ? (
        <TypeOfFlightSelect
          onChange={handleValueChange}
          styles={{ width: '170px' }}
        />
      ) : (
        <Input
          styles={{ width: '170px' }}
          onChange={handleValueChange}
          value={searchParam.value}
        />
      )}
    </div>
  );
}
