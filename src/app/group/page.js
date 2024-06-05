"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Mstyles from "@/app/page.module.css";
import GroupLists from '../Components/CommanComp/GroupLists'
import AsideTop from '../Components/CommanComp/AsideTop'
import MyGroups from '../Components/CommanComp/MyGroups'
import CheckloginContext from '/context/auth/CheckloginContext';
import Head from "next/head"

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


const page = () => {
  const Contextdata = useContext(CheckloginContext)

  useEffect(() => {
    if (Contextdata.UserLogin) {

      Contextdata.ChangeMainLoader(false)

    } else {

    }
  }, [Contextdata.UserLogin]);



  return (
    <>
     
      {isMobile &&
        <div className={Mstyles.MobileNavb}>
          <AsideTop />
        </div>

      }
      <div className={Mstyles.ContainerMain}>
        <div className={Mstyles.Mobilepadding}>

          {isMobile &&
            <div className={Mstyles.OnlyMobile}>
              <MyGroups />
            </div>

          }
          <GroupLists />

        </div>
      </div>

      <div className={Mstyles.spcedevider}>

      </div>
    </>
  )
}

export default page

