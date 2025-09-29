import Login from '@/components/Login/Login';
import Header from '@/components/UI/Header/Header';
import classes from './page.module.css';

export default async function LoginPage(props) {
  return (
    <div className={['flex-column', 'flex-center', classes.Main].join(' ')}>
      <Header />
      <Login />
    </div>
  );
}
