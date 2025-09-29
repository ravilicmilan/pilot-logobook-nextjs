'use client';
import classes from './Home.module.css';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Spinner from '../UI/Spinner/Spinner';
import { verifySession } from '@/lib/session';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log('JEL IMA SESSION???', isLoggedIn);
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const result = await verifySession();
    if (result) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setIsLoading(false);
    console.log('STA JE RESULT???', result);
  };

  return (
    <div className={classes.Home}>
      {isLoading ? (
        <Spinner />
      ) : isLoggedIn ? (
        <Main />
      ) : (
        <Login checkAuth={checkAuth} />
      )}
    </div>
  );
}
