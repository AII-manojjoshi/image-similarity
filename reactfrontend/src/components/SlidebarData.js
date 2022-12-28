import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "ホーム",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text"
  },
  {
    title: "ギャラリー",
    path: "category",
    icon: <FaIcons.FaCamera />,
    cName: "nav-text"
  },
  {
    title: "管理設定",
    path: "users",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text"
  },
  {
    title: "プロフィール",
    path: "profile",
    icon: <FaIcons.FaUserAlt />,
    cName: "nav-text"
  },
];
