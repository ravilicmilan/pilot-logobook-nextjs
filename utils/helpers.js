'use client';

import { tableColumnKeys } from '@/lib/config';

export function calculateTotals(data) {
  const totals = {
    single_engine_time: '00:00',
    multi_engine_time: '00:00',
    multi_pilot_time: '00:00',
    total_flight_time: '00:00',
    landings_day: 0,
    landings_night: 0,
    operational_night_time: '00:00',
    operational_ifr_time: '00:00',
    pic_time: '00:00',
    co_pilot_time: '00:00',
    dual_time: '00:00',
    instructor_time: '00:00',
    simulator_time: '00:00',
  };

  data.forEach((obj) => {
    Object.keys(totals).forEach((key) => {
      if (key === 'landings_day' || key === 'landings_night') {
        totals[key] += obj[key] === null ? 0 : parseInt(obj[key]);
      } else {
        const prevTime = totals[key];
        const currentTime = obj[key] !== null ? obj[key] : '00:00';
        const newTime = sumTime(prevTime, currentTime);
        totals[key] = newTime;
      }
    });
  });

  return totals;
}

export function sumTime(time1, time2) {
  if (!time1 || !time2) return false;
  return calculateTime(time1, time2, '+');
}

export function timeDiff(time1, time2) {
  if (!time1 || !time2) return false;
  return calculateTime(time1, time2, '-');
}

export function calculateTime(time1, time2, operator) {
  const arr1 = time1.split(':');
  const arr2 = time2.split(':');
  const [h1, m1] = arr1;
  const [h2, m2] = arr2;
  let totalMinutes1 = parseInt(h1) * 60 + parseInt(m1);
  let totalMinutes2 = parseInt(h2) * 60 + parseInt(m2);
  let totalTimeInMinutes;

  if (operator === '+') {
    totalTimeInMinutes = totalMinutes1 + totalMinutes2;
  } else if (operator === '-') {
    if (totalMinutes2 < totalMinutes1) {
      totalTimeInMinutes = totalMinutes2 + 24 * 60 - totalMinutes1;
    } else {
      totalTimeInMinutes = totalMinutes2 - totalMinutes1;
    }
  }

  const totalHours = parseInt(totalTimeInMinutes / 60);
  const restOfMinutes = totalTimeInMinutes - totalHours * 60;
  return `${totalHours <= 9 ? '0' + totalHours : totalHours}:${restOfMinutes <= 9 ? '0' + restOfMinutes : restOfMinutes}`;
}

export function compareDates(date1, date2, operator) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const time1 = d1.getTime();
  const time2 = d2.getTime();

  if (operator === '<') {
    return time1 < time2;
  } else if (operator === '>') {
    return time1 > time2;
  } else if (operator === '<=') {
    return time1 <= time2;
  } else if (operator === '>=') {
    return time1 >= time2;
  }
}

export function isDateInRange(date, min, max) {
  return compareDates(date, min, '>=') && compareDates(date, max, '<=');
}

export function formatDate(date) {
  let formattedDate = new Date(date);
  return formattedDate.toISOString().split('T')[0];
}

export function getLogbookFromStorage() {
  'use client';
  if (typeof window !== 'undefined') {
    const data = window.localStorage.getItem('logbook');
    if (data) {
      return JSON.parse(data);
    } else {
      return false;
    }
  }
}

export function saveLogbookToStorage(data) {
  'use client';
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('logbook', JSON.stringify(data));
  }
}

export function getDefaultLogbookData() {
  const obj = {};
  tableColumnKeys.forEach((col) => {
    const [key] = Object.entries(col)[0];
    obj[key] = '';
  });
  return obj;
}

export function getTableColumnsAsChecks() {
  return tableColumnKeys.map((col) => {
    const [key, value] = Object.entries(col)[0];
    return { key, text: value, checked: true };
  });
}

export function removeSeconds(time) {
  const arr = time.split(':');
  return `${arr[0]}:${arr[1]}`;
}

export function stripSecondsFromTime(data) {
  return data.map((obj) => {
    const newObj = {};

    for (let key in obj) {
      if (key.includes('_time') && obj[key] !== null) {
        newObj[key] = removeSeconds(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  });
}
