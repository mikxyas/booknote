import React,{ use, useEffect, useState }  from 'react'
import bookcover from '../public/atomic-habits-cover.png';
import bookcover2 from '../public/meditations-cover.png';
import bookcover3 from '../public/images.png';
import bookcover4 from '../public/flow-cover@8x.png';
import bookcover5 from '../public/the-48-laws-of-power-cover.png';
import Image from 'next/image'
import AddShelf from './addShelf';
import AddBook from './addBook';
import { useDataStore } from './dataStore';
import  Router  from 'next/router';
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
const MENU_ID = "shelf-title";
const BOOK_MENU_ID = "booko";

export default function Shelf() {
  const [data, setData] = useState(null);
  // const [shelfs, setShelf] = useState(null)
  // const shelfs = useDataStore((state) => state.shelfs)
  const [shelfs, setShelfs] = useState(null)
  const setShelf = useDataStore((state) => state.setShelf)
  const deleteShelf = useDataStore((state) => state.deleteShelf)
  const [isLoading, setLoading] = useState(true)
  const [isLoaded, setLoaded] = useState(false)
  const [shelfName, setShelfName] = useState(null)
  const [titleList, setTitleList] = useState(null)
  const showShelf = useDataStore(state => state.showShelf)
  const setShowShelf = useDataStore(state => state.setShowShelf)
  const doRefetchNotes = useDataStore(state => state.doRefetchNotes)
  const doRefetchHeader = useDataStore(state => state.doRefetchHeader)
  const doRefetchShelf = useDataStore(state => state.doRefetchShelf)
  const doRefetchAll = useDataStore(state => state.doRefetchAll)
  const refetchShelf = useDataStore(state => state.refetchShelf)
  const [active_shelf, setActive_shelf] = useState(null)
  const [rightClickedBlock, setrightClickedBlock] = useState({"type":"", "id": ""})
  const [updateShelf, SetUpdateShelf] = useState(false)
  const [noShlef, setNoShelf] = useState(false)
  const [messageWidth, setMessageWidth] = useState('100%')
  const screenType = useDataStore(state => state.screenType)


  useEffect(() => {
        
    if(screenType == 'phone'){
        setMessageWidth('100vw')
    }else {
        setMessageWidth('100%')
    }
}, [screenType])
  useEffect(() => {
    const url_token = localStorage.getItem("token")
    fetch('http://127.0.0.1:5000/shelf', {
      method:"GET",
      headers: {
       
          'x-access-token': url_token,
      },
      }).then((res) => res.json())
        .then((res) => {
          setData(res)
          // setShelfs(res.active_shelf)
          setActive_shelf(res.active_shelf)
          setTitleList(res.title_list)
          setLoaded(true)
          console.log(res)
          if(res.status == "no-shelf"){
            setNoShelf(true)
          }else {
            setNoShelf(false)
          }
          console.log("holy fuck")
        })
        // console.log(data[0])
        console.log(shelfs)
        console.log("np")
        setLoading(false)

  }, [refetchShelf, updateShelf])
  // console.log(shelfs)

  const update_active_chapter = (id, type) => {
    const url_token = localStorage.getItem("token")  
    // fix this stop repeating 
    if (type == "book"){
      let body :{
        book_id:string;
        type:string,
      } = {
        book_id: id,
        type:type,
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
         
          doRefetchHeader()
          doRefetchNotes()
          Router.push('/' + response.active_chapter)
          setShowShelf()
        })
    }
    if (type == "shelf"){
      let body :{
        shelf_id:string;
        type:string,
      } = {
        shelf_id: id,
        type:type,
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
            SetUpdateShelf(!updateShelf)
          doRefetchHeader()
          doRefetchNotes()
 
    
        })
    }
  
 

  }


  const sendRequest = () => {
    const url_token = localStorage.getItem("token")
    let body :{
        name:string;
    } = {
        name: shelfName
    }
    fetch('http://127.0.0.1:5000/addshelf', {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': url_token,
        },
        body: JSON.stringify(body)
    }).then((res) =>     doRefetchShelf()
    )
    
}



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
      doRefetchAll()
      // doRefetchShelf()
      // doRefetchHeader()
      // doRefetchNotes()
  })
  }
  const { show } = useContextMenu()



const handleContextMenu = (e, id, type) => {
  setrightClickedBlock({"id":id, "type":type})
  show({
    id: MENU_ID,
    event: e,
})
console.log(rightClickedBlock)
}
// function handleItemClick({ event, props, triggerEvent, data}){
//     console.log(event, props, triggerEvent, data);
// }



if (isLoading) return <div style={{position:'fixed', zIndex:"50", height:"216px"}} className='fixed  top-0 w-screen'><p>Conquoer Loading....</p></div>
if (!data) return <div style={{position:'fixed', zIndex:"50", height:"216px"}} className='fixed top-0 w-screen'><p>No profile data</p></div>
if (noShlef) return (
  <div style={{position:'fixed', zIndex:"50", height:"216px"}} className='fixed mt-3 items-center justify-center flex top-0 w-screen'>
          <div className=' flex flex-col items-center justify-center'>
          <AddShelf noShlef={noShlef}/>
          <h1 className=' whitespace-nowrap mt-3'>You don't have a shelf, add one</h1>

  </div>
  </div>
)
if(isLoading == false){
  return (
    <div style={{position:'fixed', zIndex:"50", height:"216px"}} className={`fixed mt-1 z-50  overflow-hidden top-0`}>
      <div  className=' flex justify-center   overflow-x-auto'>
        <div className={`w-screen pt-1 pb-1 overflow-x-auto flex  ${screenType == "phone" ? '' :'justify-center'}`}>
        {titleList.map((title) => (
            <div key={title.shelf_id} style={{background: title.is_active? 'rgba(225, 225, 225, 0.7)' :'rgba(225, 225, 225, 0.35)', boxShadow:'0px 1px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius:'7px'}} className='flex justify-center pl-2 pr-2 ml-2 items-center hover:bg-opacity-70' onContextMenu={(e) => handleContextMenu(e, title.shelf_id, "shelf")} onClick={() => update_active_chapter(title.shelf_id, "shelf")}>
              
              <p className={`cursor-pointer transition duration-150  whitespace-nowrap`} style={{fontSize:"16px", fontWeight:"400",marginLeft:""}}> {title.title}</p>
              {/* <button onClick={() => deleteBlock(title.shelf_id, "shelf")}>O</button> */}
            
            </div>

        ))
        }
          <AddShelf noShlef={noShlef}/>

        </div>
          <Menu id={MENU_ID} theme='dark'>
                        <Item onClick={() => deleteBlock(rightClickedBlock.id, rightClickedBlock.type)}>
                            Delete
                        </Item>
              </Menu>
        {/* add the add shelf button right here */}
      </div>
      

        <div style={{}} className={`flex justify-start w-screen pb-2  pl-3 pr-1 overflow-x-auto mt-1 ${screenType == "phone" ? '' :'justify-center'}`}>
          {active_shelf.books == null
              ? <AddBook/>
            :<div  className='flex gap-2 '> 
              {active_shelf.books.map((book) => (
                          <div key={book.id} style={{width:"95px"}} className=' cursor-pointer transition mt-1 duration-100 ease-in-out  '>
                            
                              {/* <button className='m-1 text-white p-2 hover:bg-opacity-100 bg-red-700 bg-opacity-70 font-light rounded pb-0 pt-0' onClick={() => deleteBlock(book.block_id, "book")}>X</button> */}
                              <div onContextMenu={(e) => handleContextMenu(e, book.block_id, "book")}  onClick={() => update_active_chapter(book.block_id, "book")}>
                                <Image  key={book.id} alt='king'  className='rounded-md ' style={{height:'130px'}} src={'https:' + book.cover} width={110} height={100}/>  
                              </div>
                          </div> 
                      ))}
                      <div className='z-50'>
                     <AddBook/>

                        </div>
            </div>
          
          }
           
        </div>
        {showShelf
                ? <div  className={`fixed -z-10 flex items-center  text-black cursor-pointer font-extralight p-0  left-0 right-1  top-48 ${screenType=="phone" ?'justify-end mr-2' :'justify-center'}`}>
                <button disabled={(active_shelf.books).length == 0} style={{background:'rgba(225, 225, 225, 0.8)', borderRadius:'100px'}} className='-z-20 pr-2 pl-2' onClick={() => setShowShelf()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
</svg>



                </button>
    
                </div>
                : null
                }
        
        {/* <button className='fixed  mt-7 font-extralight p-0 -z-10 left-0 right-1 text-white border border-black border-opacity-50' style={{background:'rgba(150, 150, 150, 0.3)'}} onClick={() => setShowShelf()}>X</button> */}
            {/* <button className='fixed  font-extralight p-0  left-0 right-1 top-48 text-white' style={{background:'rgba(229, 235, 238, 0.1)'}} onClick={() => setShowShelf()}>X</button> */}
    </div>
  )
}
 
}
