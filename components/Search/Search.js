'use client';
import { useReducer } from 'react';
import classes from './Search.module.css';
import Button from '../UI/Button/Button';
import SearchParams from './SearchParams/SearchParams';
import searchReducer from '@/reducer/searchReducer';
import {
  findRecordsByQuery,
  prepareSearchParams,
} from '@/utils/logbookHelpers';

export default function Search(props) {
  const [state, dispatch] = useReducer(searchReducer, []);

  const onLabelChange = (idx, value) => {
    updateState(idx, 'label', value);
  };

  const onOperatorChange = (idx, value) => {
    updateState(idx, 'operator', value);
  };

  const onValueChange = (idx, value) => {
    updateState(idx, 'value', value);
  };

  const updateState = (idx, key, value) => {
    dispatch({ type: 'UPDATE_SEARCH_PARAMS', params: { idx, key, value } });
  };

  const addNewRow = () => {
    dispatch({ type: 'ADD_SEARCH_PARAMS' });
  };

  const removeParam = (idx) => {
    dispatch({ type: 'REMOVE_SEARCH_PARAMS', idx });
  };

  const findRecordsWithParams = () => {
    // console.log('EXECUTE SEARCH!', state);
    const result = findRecordsByQuery(
      props.logbook,
      prepareSearchParams(state)
    );
    // console.log('RESULT::::', result);
    props.executeSearch(result);
  };

  // console.log('SEARCH RENDER:::', state);

  return (
    <div className={classes.SearchWrapper} id='search-params-wrapper'>
      <div
        className={[
          'flex-column',
          'flex-center',
          'flex-gap-20',
          classes.SearchUpper,
        ].join(' ')}
      >
        {state.length > 0 &&
          state.map((s, idx) => (
            <SearchParams
              key={idx}
              idx={idx}
              searchParam={s}
              onLabelChange={onLabelChange}
              onOperatorChange={onOperatorChange}
              onValueChange={onValueChange}
              removeParam={removeParam}
            />
          ))}
      </div>
      <div
        className={[
          'flex-center',
          'flex-row',
          'flex-gap-20',
          classes.SearchBottom,
        ].join(' ')}
      >
        <Button buttonText='+' onClick={addNewRow} type='Primary' />
        {state.length > 0 && (
          <Button
            buttonText='FIND'
            onClick={findRecordsWithParams}
            type='Primary'
          />
        )}
      </div>
    </div>
  );
}
