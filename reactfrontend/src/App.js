import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Layout from './components/Layout';
import UsersNew from './components/UsersNew';
import CategoryNew from './components/CategoryNew';
import CategoryPhotos from './components/CategoryPhotos';
import ProfilePageNew from './components/ProfilePageNew';
import Home from './components/Home';
import Missing from './components/Missing';
import { Route, Routes} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import { DataProvider } from './context/DataContext';
import "./css/style.css";


function App() {

 
  return (
    <CookiesProvider>
      <DataProvider>
    <Routes>
      <Route path="login" element={<Login/>}/>
      <Route path="change_password/:id" element={<ChangePassword/>}/>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home />} />
        <Route path="users" element={<UsersNew/>} />
        <Route path="profile" element={<ProfilePageNew />} />
        <Route path="category" element={<CategoryNew />} />
        <Route path="category/categoryphotos/:id" element={<CategoryPhotos />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
    </DataProvider>
    </CookiesProvider>
  );
}

export default App;
