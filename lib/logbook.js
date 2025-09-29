'use server';

import supabase from './db';
import { verifySession } from './session';

export const createNewRow = async (logdata) => {
  const session = await verifySession();
  if (!session) {
    return false;
  }

  const { data, error } = await supabase
    .from('logbook')
    .insert([logdata])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getAllLogs = async () => {
  const session = await verifySession();
  if (!session) {
    return false;
  }

  console.log('JEL IMA SESSION???', session);
  const { data, error } = await supabase
    .from('logbook')
    .select('*')
    .order('date')
    .order('departure_time');

  if (error) throw new Error(error.message);
  return data;
};

export const updateLog = async (id, updates) => {
  const session = await verifySession();
  if (!session) {
    return false;
  }

  const { data, error } = await supabase
    .from('logbook')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// export const deleteLog = async (id) => {
//   const { error } = await supabase.from('logbook').delete().eq('id', id);

//   if (error) throw new Error(error.message);
//   return { success: true, message: 'Log deleted successfully' };
// };
