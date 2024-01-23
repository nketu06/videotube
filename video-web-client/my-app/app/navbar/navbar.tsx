'use client';
import Image from "next/image";
import styles from "./navbar.module.css"
import Link from "next/link";
import SignIn from "./sign-in";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import {User} from 'firebase/auth';

export default function Navbar(){

    const [user,setUser]=useState<null | User>(null);

    useEffect(()=>{
        const unsubscribe = onAuthStateChangedHelper((user)=>{
            setUser(user);
        });

        return () => unsubscribe();
    });


    return(
        <nav className={styles.nav}>
            <Link href='/'>
            <Image width={90} height={20} src="/video-logo.svg" alt="video logo"/>
            </Link>
            <SignIn user={user}/>
        </nav>
    );
}