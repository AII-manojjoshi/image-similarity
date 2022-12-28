import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
import { useCookies } from 'react-cookie';
import axios from '../api/posts';

const DataContext = createContext({});


export const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([])
    const [users, setUsers] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    const [myData, setMyData] = useState([]);
    
    const [token, setToken, removeToken] = useCookies(['myToken']);

    // const authInterceptor = config => {
    //   let cookie = token['myToken'];
    //   config.headers.authorization = `Token ${cookie}`;
    //       // console.log(config);
    //   return config;
    // }



    useEffect(() => {
      if (token['myToken']){
          setIsAuthenticated(true);
      }
    }, []);
    


      useEffect(() => {
        let cookie = token['myToken'];
        // axios.interceptors.request.use(authInterceptor)


        const fetchCategories = async () => {
       
          try {
            const response = await axios.get('/image/category', { headers: { Authorization: `Token ${cookie}` }});
            setCategories(response.data);
            const selectcategories = [];
            for (let i = 0; i < response.data.length; ++i) {
                const selectcategory = response.data[i];
                selectcategories.push({ text: selectcategory.category_name, value: selectcategory.id });
            }
            setMyData(selectcategories);
          } catch (err) {
            if (err.response) { 
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            } else {
              console.log(`Error: ${err.message}`);
            }
          }
        }
        
        const fetchUsers = async () => {
       
          try {
            await new Promise(r => setTimeout(r, 300));
            const response = await axios.get('/image/user', { headers: { Authorization: `Token ${cookie}` }});
            setUsers(response.data);
          } catch (err) {
            if (err.response) { 
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            } else {
              console.log(`Error: ${err.message}`);
            }
          }
        }

        if(isAuthenticated){
          fetchCategories();
        fetchUsers();
        
      }
   
      }, [isAuthenticated])


    return (
        <DataContext.Provider value={{
            categories, setCategories, users, setUsers, isAuthenticated, setIsAuthenticated,
            myData, setMyData
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;