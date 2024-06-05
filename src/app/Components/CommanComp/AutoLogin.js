"use client"
import styles from "@/app/page.module.css";
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation'
import CheckloginContext from '/context/auth/CheckloginContext'
import { useRouter } from 'next/navigation';
const AutoLogin = () => {
    const router = useRouter()
    const params = useParams()
    const Contextdata = useContext(CheckloginContext)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const jwt_token = urlParams.get('token');
        if (jwt_token) {
          
            document.cookie = `jwt_token=${jwt_token}; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
            router.push('/group')
            

            Contextdata.CheckUserLogin()

        }
    }, []);
    return (
        <>

        </>
    )
}

export default AutoLogin
