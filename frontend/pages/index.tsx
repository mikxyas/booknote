import Head from 'next/head';
import Link from 'next/link';
import  Router  from 'next/router';
import React, { useState, useEffect } from "react";
import { useDataStore } from '../components/dataStore';
import { Props } from '../components/types';

export default function Home() {
  const token = useDataStore((state) => state.token)
  const loggedIn = useDataStore((state) => state.loggedIn)
  const block = useDataStore((state) => state.blocks)
  const user = useDataStore((state) => state.user)
  const [loading, setLoading] = useState(true)
  const setUser = useDataStore((state) => state.setUser)
  const setBlocks = useDataStore((state) => state.setBlocks)
    // function checkToken() {
  //   if(window.localStorage['getItem'])
  // }

  useEffect(() => {
    const url_token = localStorage.getItem("token")
    fetch('http://127.0.0.1:5000/fetch', {
              method:"POST",
              headers: {
                'Content-Type': 'application/json',
                  'x-access-token': url_token,
              },
    }) 
    .then((res) => res.json())
    .then((result) => {
      setBlocks(result.blocks)
      setUser(result.user)
      console.log("hi")
      Router.push('/' + result.user.active_chapter)
    })
    setLoading(false)
  },[])

  if(loading){
    return(
      <div className='h-screen w-screen flex justify-center items-center'>...Loading</div>
    )
  }
  else{
    return (
      <div className=' h-screen w-screen flex flex-col justify-center items-center'>
        <div className='container flex flex-col items-center mt-5'>
          <h1 className=' text-gray-500 text-2xl font-semibold'>FOR READERS, BY READERS</h1>
          <h2 className='text-6xl text-center font-semibold'>Track your Reading with <br/> Love and Detail</h2>
          <Link href='register'><button className=' mt-5 p-3 pt-2 text-white pb-2 rounded-lg bg-red-600'>Get Started</button></Link>
        </div>
      </div>
    )
  }

}

