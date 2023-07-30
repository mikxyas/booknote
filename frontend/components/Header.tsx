import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import bookcover from '../public/atomic-habits-cover.png';
import { useDataStore } from './dataStore';
import Router  from 'next/router';
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu
  } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
const MENU_ID = "menu-id";


export default function Header() {
    const [headerData, setHeaderData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showInput, setShowInput] = useState(false)
    const [newChapter, setNewChapter] = useState("")
    const [chapterTitle, setChapterTitle] = useState("")
    const [refetch, setRefetch] = useState(false)
    const reFetchPage = useDataStore(state => state.reFetchPage)
    const setReFetchPage = useDataStore(state => state.setReFetchPage)
    const [showDeletedView, setShowDeletedView] = useState(false)
    const [showChapterDeletedViwe, setShowChapterDeletedView] = useState(false)
    const active_chapter = useDataStore(state => state.active_book)
    const [bookTitle, setBookTitle] = useState(null)
    const doRefetchNotes = useDataStore(state => state.doRefetchNotes)
    const doRefetchHeader = useDataStore(state => state.doRefetchHeader)
    const doRefetchShelf = useDataStore(state => state.doRefetchShelf)
    const refetchHeader = useDataStore(state => state.refetchHeader)
    const setShowShelf = useDataStore(state => state.setShowShelf)
    const showShelf = useDataStore(state => state.showShelf)
    const [status, setStatus] = useState("")
    const screenType = useDataStore(state => state.screenType)

    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("http://localhost:5000/getheader", {
            method:"GET",
            headers: {
                'x-access-token': token,
            }
        }).then((res) => res.json())
            .then(result => {
                console.log(result)
                setHeaderData(result)
                setBookTitle(result.title)
                setChapterTitle(result.chapter)
                if(result.status == "no-shelf" || result.status == "no-book"){
                    if(showShelf != true){
                        setShowShelf()
                        console.log("right here")
                    }
                } 
                setStatus(result.status)
            })
            .then(() => setLoading(false))
        console.log(headerData)
        console.log('---')
       
    },[refetchHeader])

    const create_untitled_chapter = () => {
        setChapterTitle("")
        addChapter()
        setShowInput(true)
    }

    const { show } = useContextMenu({
        id: MENU_ID
    })

    // function handleItemClick({ event, props, triggerEvent, data}){
    //     console.log(event, props, triggerEvent, data);
    // }

    function displayMenu(e){
        show({
            event: e,
        })
    }

    const addChapter = () => {
        const token = localStorage.getItem("token")
        let body: {chapter_name: string} = {chapter_name: newChapter}
        fetch("http://localhost:5000/addchapter", {
            method:"POST",
            headers: {
                'x-access-token': token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then((status) => {
                if(status.status == "400"){
                    // setRefetch(!refetch)
                    doRefetchHeader()
                    doRefetchNotes()
                    // setShowInput(false)
                    Router.push( '/' + status.active_chapter)
                }
            })
    }

    // const updateChapter = (id, title) => {
    //     const token = localStorage.getItem("token")
    //     let body: {chapter_name: string, chapter_id: string} = {chapter_name: title, chapter_id: id}
    //     fetch("http://localhost:5000/addchapter", {
    //         method:"PUT",
    //         headers: {
    //             'x-access-token': token,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(body)
    //     }).then(res => res.json())
    //         .then((status) => {
    //             if(status.status == "400"){
    //                 // setRefetch(!refetch)
    //                 doRefetchHeader()
    //                 // setShowInput(false)
    //                 // Router.push( '/' + status.active_chapter)
    //             }
    //         })
    // }

    const deleteBlock = (id, type) => {
        // You get the type of block that got deleted then you nest to where it is and then search through the id to remove it
        // Create a search and delete function
        // its almost done
        const url_token = localStorage.getItem("token")
    
        fetch('http://127.0.0.1:5000/deleteblock', {
          method:"DELETE",
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': url_token,
          },
          body: JSON.stringify({"block_id": id, "type": type})
      }).then((res) => res.json())
      .then((newShelf) => {
            //   setReFetchPage()
            doRefetchHeader()
            doRefetchNotes()
        //   big error here will fix later
      })
      }

      const update_book_title = (e) => {
        setBookTitle(e.target.value)
        const url_token = localStorage.getItem("token")
            fetch('http://127.0.0.1:5000/addbook', {
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': url_token,
                },
                body: JSON.stringify({"name": e.target.value})
            }).then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
      }

    const update_active_chapter = (id) => {
        const url_token = localStorage.getItem("token")
        let body :{
          chapter_id:string;
          type: string;
        } = {
          chapter_id: id,
          type:"chapter"
        }
      
      fetch('http://127.0.0.1:5000/update_active_block', {
        method:"POST",
        headers :{
          'Content-Type': 'application/json',
          'x-access-token': url_token
        },
        body: JSON.stringify(body)
      }).then((res) => res.json())
        .then((response) => {
          Router.push('/' + response.active_chapter)
            // setRefetch(!refetch)
            doRefetchHeader()
            doRefetchNotes()
        }).then(() => setShowInput(false))
      }

      const handleChange = (event) => {
        // setChapterTitle(event.target.value)
        headerData.chapter_list.find(chapter => chapter.chapter_active == true).chapter_title = event.target.value

       setChapterTitle(event.target.value)
       console.log(event.target.value)

        const token = localStorage.getItem("token")
        let body: {chapter_name: string} = {chapter_name: event.target.value}
        fetch("http://localhost:5000/addchapter", {
            method:"PUT",
            headers: {
                'x-access-token': token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then((status) => {
                console.log(status)
                
            })

        // console.log(newChapter)
    }
   
    // if(showDeletedView){
    //     return(
    //         <div style={{background:'#EEEEE5'}} className='w-full  h-72 flex items-center justify-between'>
          
    //         <div className='ml-28 flex flex-col'>
    //           <h1 className='text-3xl'></h1>
    //           <p className='text-5xl'>🪦 Book Deleted</p>
    //         </div>
            
    //         {/* <Image alt='king' className='mr-20 rounded-md shadow-lg' src={bookcover} width={120} height={140}/>   */}
          
    //       </div>
    //     )
    // }
    // if(status == "no-chapter"){
    //     return (

    //     )
    // }
    if(status == "no-shelf"){

        return(
            <div style={{background:'rgba(229, 235, 238, 0.42)', height:"216px",backdropFilter:"blur(16.5px)", paddingLeft:"91px"}} className='w-full flex  items-center  justify-between'>
          
            {/* <div className='ml-28 flex flex-col'>
              <h1 className='text-3xl'>Book Title</h1>
              <input autoFocus className=' text-5xl bg-transparent focus:outline-none placeholder:text-gray-700'  placeholder='Untitled'/>
            </div> */}
            
            {/* <Image alt='king' className='mr-20 rounded-md shadow-lg' src={bookcover} width={120} height={140}/>   */}
          
          </div>
        )
    }
    if(status == 'no-book'){
        return(
            <div onClick={() => setShowShelf()} style={{background:'rgba(229, 235, 238, 0.42)', height:"216px",backdropFilter:"blur(16.5px)", paddingLeft:"91px"}} className='w-full flex  items-start  '>

            
            </div>
        )
    }
    if (loading == false && showChapterDeletedViwe == false){
        return (
            <div style={{background:'rgba(229, 235, 238, 0.42)', height:"216px",backdropFilter:"blur(16.5px)", position:'fixed', }} className='w-full flex items-center  justify-center'>
             {/* <div onClick={() => setShowShelf()} className='   w-screen opacity-30 absolute' style={{height:'216px', marginTop:"-53px", marginLeft:"", zIndex:"1"}}>

            </div> */}
            {showShelf
                ?null
                : <div className='ml-5 lg:ml-14'  style={{zIndex:'10',width:"100%"}}>
           
                {/* <h1 onChange={update_book_title} style={{fontSize:"20px", fontWeight:"400", }} className=''>{headerData.title}</h1> */}
                <input
                    autoFocus={bookTitle == ""}
                    className=' outline-none border-none bg-transparent w-full'
                    style={{fontSize:"20px", fontWeight:"400"}}
                    type='text'
                    value={bookTitle}
                    onChange={(e) => update_book_title(e)}
                />
                <input
                    autoFocus={chapterTitle == ""}
                    className=' outline-none border-none placeholder:text-gray-600 bg-transparent w-full'
                    placeholder='Untitled'
                    style={{fontSize:"32px", marginTop:"-5px"}}
                    type='text'
                    value={chapterTitle}
                    onChange={handleChange}
                />

      
        <div className='flex gap-7 overflow-x-auto  mr-5 m-1 mt-4 '>
            <div onClick={() => create_untitled_chapter()} className='rounded flex justify-center  whitespace-nowrap cursor-pointer font-semibold text-black items-center'>
                New <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            {status == "no-chapter"
                ?null
                :<>
                {headerData.chapter_list.map((chapter) => (
                <>

                    <div onContextMenu={displayMenu} onClick={() => update_active_chapter(chapter.chapter_id)} style={{fontSize:"16px", fontWeight:"400"}} key={chapter.chapter_id} className={`rounded whitespace-nowrap  cursor-pointer  hover:underline  ${chapter.chapter_active ?'underline' :""}`}>
                        {chapter.chapter_title}
                    </div>
                    <Menu id={MENU_ID} theme='dark'>
                        <Item onClick={() => deleteBlock(chapter.chapter_id, "chapter")}>
                            Delete
                        </Item>
       
        {/*
 
        <Item disabled>Disabled</Item>
        <Separator /> */}
        {/* <Submenu label="Submenu">
          <Item onClick={handleItemClick}>
            Sub Item 1
          </Item>
          <Item onClick={handleItemClick}>Sub Item 2</Item>
        </Submenu> */}
      </Menu>

                </>
            ))
            }

                </>

            }
            
            
           
            {/* {showInput 
                ?<div className='flex  border border-gray-200'>
                    <input value={newChapter} onChange={handleChange} autoFocus placeholder='Title' className='pl-4 pr-4 pt-1 pb-1  bg-gray-100 w-52  font-medium'/>
                    <button onClick={addChapter} className='pl-4 pr-4 pt-1 pb-1 border rounded-sm border-gray-500  font-medium'>Add</button>
                </div>
                :null
            } */}
        </div>

        </div>
           }
           {showShelf || screenType=="phone"
            ?null
            :<div className=''>
            <Image alt='king' className='mr-16 rounded-md shadow-lg' src={"https:" + headerData.cover} width={screenType=="phone" ?90 :110} height={100}/>  
            </div>       

           }
                 {showShelf
                ? null
                : <div style={{zIndex:'inherit'}} className={`fixed z-50 flex items-center  text-black cursor-pointer font-extralight p-0  left-0 right-1   top-48 ${screenType=="phone" ?'justify-end mr-2' :'justify-center'}`}>
                <button  style={{background:'rgba(225, 225, 225, 0.8)', borderRadius:'100px'}} className='z-50 pl-2 pr-2' onClick={() => setShowShelf()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
</svg>



                </button>
    
                </div>
                }

            
            
           
            </div>
            
          )
    }
    else{
        return(
            <>
            <div style={{background:'#EEEEE5', height:"216px"}}  onClick={() => setShowShelf()} className='w-full  h-72 flex items-center justify-between'>
                <div className='ml-28 flex flex-col'>
                    
                    
                </div>
                <Image alt='king' className='mr-20 rounded-md shadow-lg' src={bookcover} width={120} height={140}/>  
            </div>
            <div className='flex gap-2 m-1 mt-2 ml-2'>
               
                
                <div onClick={() => setShowInput(!showInput)} className='rounded flex justify-between font-semibold text-gray-700 items-center pl-2 pr-2 pt-1 pb-1 bg-gray-100 '>
                    New Chapter <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
                {showInput 
                    ?<div className='flex '>
                        <input value={newChapter}  autoFocus placeholder='Title' className='pl-4 pr-4 pt-1 pb-1  bg-gray-100 w-52  font-medium'/>
                        <button onClick={addChapter} className='pl-4 pr-4 pt-1 pb-1 border rounded-sm border-gray-500  font-medium'>Add</button>
                    </div>
                    :null
                }
            </div>
            </>
        )
    }
  
}
