"use client"
import { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import CheckloginContext from '/context/auth/CheckloginContext'
import styles from "@/app/page.module.css";
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {
  const Contextdata = useContext(CheckloginContext)
  const router = useRouter()

  useEffect(() => {
    if (Contextdata.UserLogin) {
      router.push('/group')
      

    }

  }, [Contextdata.UserLogin, Contextdata.UserData]);

  return (
    <main className={styles.main}>

    </main>
  );
}
