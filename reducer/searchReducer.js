import { useReducer, createContext } from 'react';

export const SearchContext = createContext(null);
export const SearchDispatchContext = createContext(null);

const defaultObj = { label: 'date', operator: '=', value: '' };
const defaultState = [];

const searchReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_SEARCH_PARAMS':
      return [...state, { ...defaultObj }];
    case 'UPDATE_SEARCH_PARAMS':
      const { idx, key, value } = action.params;
      const oldState = [...state];
      oldState[idx][key] = value;
      return [...oldState];
    case 'REMOVE_SEARCH_PARAMS':
      return state.filter((s, i) => i !== action.idx);
  }
};

export function SearchProvider(props) {
  const [searchParams, dispatch] = useReducer(searchReducer, defaultState);

  return (
    <SearchContext value={searchParams}>
      <SearchDispatchContext value={dispatch}>
        {props.children}
      </SearchDispatchContext>
    </SearchContext>
  );
}
