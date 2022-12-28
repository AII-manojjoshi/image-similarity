import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect, useContext} from 'react';
import DataContext from '../context/DataContext';

const Layout = () => {
  const navigate = useNavigate();
  const [token, setToken, removeToken] = useCookies(['myToken']);
 const { users } = useContext(DataContext);

 useEffect(() => {
    if (!token['myToken']){
        navigate('login');
    }
  }, [token]);

    if (users.length === 0) {
          return <div>ローディング....</div>
        }
        
        else {

    return (
        <div>
           
            <Navbar users = {users}/>
            <Outlet />
            <Footer />
        </div>
    )
}
}

export default Layout