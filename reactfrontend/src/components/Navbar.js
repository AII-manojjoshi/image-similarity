import React, { useState, useContext, useEffect } from "react";
import DataContext from '../context/DataContext';

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

import { IconContext } from "react-icons";

// ROUTING

import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// DATA FILE
import { SidebarData } from "./SlidebarData";

// STYLES
import "../css/Navbar.css";
import useWindowSize from '../hooks/useWindowSize';


export default function Navbar({users}) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const { width } = useWindowSize();

  const [token, setToken, removeToken] = useCookies(['myToken']);
  const [userid, setUserid, removeSetUserid] = useCookies(['myUsername']);
  const { setIsAuthenticated, setUsers } = useContext(DataContext);
  const navigate = useNavigate();
 
const handleLogout = (e) => {
  e.preventDefault();
    removeToken(['myToken']);
    removeSetUserid(['myUsername']);
    setUsers([]);
    setIsAuthenticated(false);
    navigate('/login')     
}

  const currentusername = token['myUsername']; 
  const currentuser = users.find(user => user.username === currentusername);
  const admin = (currentuser.is_admin).toString();

  return (
    <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        <div className="navbar" style={{justifyContent: "space-between"}}>
          <div style={width > 850 ? {display: "none"}: null}>
            <FaIcons.FaBars className="menu-bars" onClick={showSidebar} />
         
          </div>
          <div style={{color: "white", justifyContent:"center", marginLeft: "10px", marginRight: "10px"}}>
            <h4>AI Infinity Image Similarity</h4>
          </div>
          <div style={width < 850 ? {display: "none"}: {display: "flex", flexDirection: "row"}}>
          <ul className="nav-top-items" >
                <li><Link to="/"><AiIcons.AiFillHome/>ホーム</Link></li>
                <li><Link to="category"><FaIcons.FaCamera />ギャラリー</Link></li>
                {admin === 'true' ? <li><Link to="users"><IoIcons.IoMdPeople />管理設定</Link></li> : null}
                <li><Link to="profile"><FaIcons.FaUserAlt />プロフィール</Link></li>
            </ul>
            &nbsp;
            &nbsp;
            &nbsp;
            <div>
            <button className='btn btn-light' style={{marginRight: "5px", fontSize: "10px"}} onClick={handleLogout}>ログアウト</button>
            </div>
            </div>
            
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <br />
            <button className='btn btn-light' style={{marginLeft: "30px", fontSize: "10px"}} onClick={handleLogout}>ログアウト</button>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );

}
