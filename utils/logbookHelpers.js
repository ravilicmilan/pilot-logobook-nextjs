'use client';
import { calculateTotals } from './helpers';

export function getPageData(pageNum, data) {
  let dataForPage = [];

  data.forEach((o) => {
    if (parseInt(o.page_num) === pageNum) {
      dataForPage.push(o);
    }
  });

  return dataForPage;
}

export function getMaxPageNum(data) {
  let pageNum = 0;

  data.forEach((o) => {
    if (o.page_num > pageNum) {
      pageNum = o.page_num;
    }
  });

  return pageNum;
}

export function findRecordById(id) {
  const data = APP.dataForPage.find((o) => o.id === id);
  return data;
}

export function prepareSearchParams(data) {
  const obj = {};

  data.forEach((param) => {
    const { label, operator, value } = param;
    if (value && value !== null && value !== '') {
      if (operator === '=') {
        obj[label] = value; // WHERE column LIKE %somestring%
      } else if (operator === '<>') {
        const searchValArr = value.split(/[,;]/).map((item) => item.trim());
        obj[label] = { operator: 'between', value: searchValArr };
      } else {
        obj[label] = { operator, value: value };
      }
    }
  });

  return obj;
}

export function findRecordsByQuery(data, query) {
  // console.log('QUERY!!!!', data, query);
  return data.filter((item) => {
    return Object.entries(query).every(([key, filterValue]) => {
      const itemValue = item[key];
      // console.log('ITEM VALUE', { item, key, filterValue, itemValue });

      // Handle string properties with a "LIKE" comparison (case-insensitive includes)
      if (typeof itemValue === 'string' && typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      // Handle numeric properties with dynamic operators
      if (
        (typeof itemValue === 'number' ||
          typeof itemValue === 'string' ||
          typeof filterValue === 'object') &&
        filterValue.operator
      ) {
        switch (filterValue.operator) {
          case '>':
            return itemValue > filterValue.value;
          case '>=':
            return itemValue >= filterValue.value;
          case '<':
            return itemValue < filterValue.value;
          case '<=':
            return itemValue <= filterValue.value;
          case '=':
          case '==':
            return itemValue === filterValue.value;
          case '!=':
            return itemValue !== filterValue.value;
        }
      }

      // Handle numeric ranges
      // The `filterValue` is an object with operator 'between' and a value array [min, max]
      if (
        (typeof itemValue === 'number' || typeof itemValue === 'string') &&
        typeof filterValue === 'object' &&
        filterValue.operator &&
        filterValue.operator === 'between'
      ) {
        const [min, max] = filterValue.value;
        return itemValue >= min && itemValue <= max;
      }

      // Handle exact matches for all other types
      return itemValue === filterValue;
    });
  });
}

export function getTotalsForPage(dataForPage, logbookData, pageNum) {
  const dataForSubtotal = calculateTotals(dataForPage);
  const filteredData = logbookData.filter((o) => o.page_num <= pageNum);
  const dataForTotal = calculateTotals(filteredData);

  return { dataForSubtotal, dataForTotal };
}

export function getTotalsForData(data) {
  const totals = calculateTotals(data);
  return { totals };
}

export function sanitizeData(obj) {
  const newObj = {};

  for (let key in obj) {
    if (obj[key] !== '') {
      if (
        key === 'page_num' ||
        key === 'landings_day' ||
        key === 'landings_night' ||
        key === 'id'
      ) {
        newObj[key] = parseInt(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    } else {
      newObj[key] = null;
    }
  }

  return newObj;
}
