"use client"
import { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import CheckloginContext from '/context/auth/CheckloginContext'
import styles from "@/app/page.module.css";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Login_url } from '../../Data/config'

export default function Home() {
  const Contextdata = useContext(CheckloginContext)
  const router = useRouter()

  useEffect(() => {
    if (Contextdata.UserLogin) {
      console.log(Contextdata.UserData)
      router.push('/group')
    } else {
   
    }

  }, [Contextdata.UserLogin]);

  return (
    <main className={styles.main}>

    </main>
  );
}
