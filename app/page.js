import Home from '@/components/Home/Home';
import classes from './page.module.css';
import Header from '@/components/UI/Header/Header';

export default async function Page() {
  return (
    <div className={classes.Home}>
      <Header />
      <Home />
    </div>
  );
}
