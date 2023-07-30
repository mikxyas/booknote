import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import bookcover from '../public/atomic-habits-cover.png';
import bookcover2 from '../public/meditations-cover.png';
import bookcover3 from '../public/images.png';
import bookcover4 from '../public/flow-cover@8x.png';
import bookcover5 from '../public/the-48-laws-of-power-cover.png';
import { useDataStore } from '../components/dataStore';
// import useToken from '../components/useToken';
import Book from '../components/Book';
import  Router  from 'next/router';
import Shelf from '../components/Shelf';
import Header from '../components/Header';
import Messages from '../components/Messages';


export default function Library() {
  const user = useDataStore((state) => state.user)
  const blocks = useDataStore((state) => state.blocks)
  const shelfs = useDataStore((state) => state.shelfs)
  const [collapseNav, setCollapseNav] = useState(false)
  const [navWidth, setnavWidth] = useState(400)
  const showShelf = useDataStore(state => state.showShelf)
  const removeToken = useDataStore((state) => state.removeToken)
  const token = useDataStore((state) => state.token)
  const bg = useDataStore((state) => state.bg)
  const setBg = useDataStore((state) => state.setBg)

  useEffect(() => {
    if(token == ""){
      Router.push('/')
    }
  },[])

  function collapse() {
    setCollapseNav(!collapseNav)
    if(navWidth == 400){
      setnavWidth(0)
    }else {
      setnavWidth(400)
    }
    console.log(collapseNav)
    console.log(navWidth)
  }
  
  const changeBg = () => {    
    const bgList = {"1":"./flower.webp", "2":"./cool.jpg", "3": "./epic.jpg", "4":"./sam.jpg","5":"./roman.jpg" }
    const reverseList = {"./flower.webp":1, "./cool.jpg":2, "./epic.jpg": 3, "./sam.jpg":4,"./roman.jpg":"5" }
    const index = reverseList[bg]
    if (index == 5){
      setBg(bgList["1"])
    }else{
      setBg(bgList[index +1])
    }
}
 
  const logout = () => {
    removeToken()
    Router.push('/')
  }
  
  console.log(shelfs)
  console.log(user)
  // const {token} = useToken();
// pass the user id and make zustand fetch all the data
  return (
    <div style={{backgroundImage:`url(${bg})`, backgroundSize:"center", backgroundRepeat:"no-repeat", backgroundAttachment:'fixed',backgroundPosition:"center", height:'100vh',width:'100vw'  }} className='h-screen w-screen flex overflow-hidden justify-center items-center'>
      {/* <div style={{"width": navWidth, "transition":".2s", "zIndex":1, "top":0, "left":0,background:'#FAFAFA'}} className=' p-2 container h-screen bg-gray-100 '>
        
        <div style={{background:"#EEEEE5"}} className='flex bg-gray-200 p-2 rounded justify-between'>
          <button className='p-0'>MIKIYAS'S LIBRARY</button> 
          <button onClick={() => collapse()} className='p-0 z-50'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

  
       
      </div> */}
      {showShelf
          ?<div className='z-10'><Shelf/></div>
          :null
      }
      
      <div  className='w-full z-auto h-screen '>
        <div className=''>
          <Header/>
        </div>

      <div style={{marginTop:'220px'}} className='w-full flex flex-col justify-center bg-transparent items-center mt-5  p-3'>
        {/* message area */}
        <Messages/>
        {/* message area */}
      </div>
      
      <div  className={`fixed p-2 flex items-center  text-black cursor-pointer font-extralight left-0 bottom-0 `}>
            <button  style={{background:'rgba(225, 225, 225, 0.8)', borderRadius:'100px'}} className='-z-20 pr-2 pl-2' onClick={() => logout()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
      </div>
      <div  className={`fixed p-2 flex items-center  text-black cursor-pointer font-extralight left-0 bottom-12 `}>
            <button  style={{background:'rgba(225, 225, 225, 0.8)', borderRadius:'100px'}} className='-z-20 pr-2 pl-2' onClick={changeBg}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>

            </button>
      </div>
      </div>
    
    </div>
  )
}
