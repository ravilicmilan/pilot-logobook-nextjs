'use client';

export default function logbookReducer(state = [], action) {
  switch (action.type) {
    case 'SET_LOGBOOK_DATA':
      return [...action.data];
  }
}
