'use server';
import supabase from './db';
// import { redirect } from 'next/navigation';
import { createSession, deleteSession } from './session'; // Import your custom session utility

import bcrypt from 'bcrypt';

export async function loginUser(email, password) {
  // 1. Find user in database
  const user = await findUser(email);
  // console.log('STA JE NASO????', { email, password }, user);
  if (!user || user.length === 0) {
    return { success: false, message: 'User not found!' };
  }
  // 2. Compare passwords
  const passwordMatch = await bcrypt.compare(password, user[0].password);

  if (!user || !passwordMatch) {
    // Return an error object for the client component
    return { success: false, message: 'Invalid credentials.' };
  }

  // 3. Create a session and set a cookie
  await createSession(user[0].email);

  // 4. Redirect the user
  // redirect('/');
  return { success: true };
}

export const findUser = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (error) throw new Error(error.message);
  return data;
};

export async function logout() {
  await deleteSession();
  // redirect('/login');
}
