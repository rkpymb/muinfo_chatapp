"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Mstyles from "@/app/page.module.css";
import GroupLists from '../Components/CommanComp/GroupLists'
import AsideTop from '../Components/CommanComp/AsideTop'
import MyGroups from '../Components/CommanComp/MyGroups'
const page = () => {
  return (
    <>

      <div className={Mstyles.OnlyMobile}>
        <AsideTop />
      </div>
      <div className={Mstyles.ContainerMain}>


        <div className={Mstyles.Mobilepadding}>
          <GroupLists />
          <MyGroups />
        </div>
      </div>

      <div className={Mstyles.spcedevider}>
          
        </div>
      </>
  )
}

export default page
