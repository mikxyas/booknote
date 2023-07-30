import React, { useEffect, useState } from 'react'
import { useDataStore } from './dataStore'

export default function ({noShlef}) {
    const [shelfName, setShelfName] = useState(null)
    const [newShelf, setNewShelf] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const doRefetchAll = useDataStore(state => state.doRefetchAll)
    const doRefetchShelf = useDataStore(state => state.doRefetchShelf)
    // const sendRequest = () => {
    //     const url_token = localStorage.getItem("token")
    //     let body :{
    //         name:string;
    //     } = {
    //         name: shelfName
    //     }
    //     fetch('http://127.0.0.1:5000/addshelf', {
    //         method:"POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-access-token': url_token,
    //         },
    //         body: JSON.stringify(body)
    //     }).then((res) => res.json())
    //     .then((data) => {
    //         setNewShelf(data)
    //         console.log(data)
    //     })
    // }
    useEffect(() => {
      if(noShlef == true){
        setShowForm(true)
      }
    },[noShlef])
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
      }).then((res) =>     {
        setShowForm(false)
        doRefetchAll()}
      )
      
  }
    const handleChange = (event) => {
        setShelfName(event.target.value)
    }

   
  return (
    <div  className='flex pr-2 '>
      {noShlef
        ?null
        :<p style={{background:'rgba(225, 225, 225, 0.3)', boxShadow:'0px 1px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius:'7px'}} className='flex justify-center cursor-pointer pl-2 pr-2 pb-1 pt-1 ml-2 items-center '  onClick={() => {setShowForm(!showForm),  setShelfName('')}} >
        {showForm
          ?<>X</>
          :<>+</>
        }
      </p>
      }
          
          {showForm
            ?<div className='flex  ml-3  justify-around items-end'>
            <div style={{background:'rgba(225, 225, 225, 0.3)', boxShadow:'0px 1px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius:'7px'}} className='flex justify-center cursor-text pl-2 pr-2 pb-1 pt-1  items-center'>
              <input onSubmit={sendRequest} value={shelfName} className=' bg-transparent outline-none' onChange={handleChange} placeholder='Eg: Philosophy' autoFocus type="text" style={{width:"fit-content", fontSize:"16px"}}/>
            </div> 
            <div style={{background:'rgba(225, 225, 225, 0.3)', boxShadow:'0px 1px 4px 0px rgba(0, 0, 0, 0.25)',width:'', borderRadius:'7px'}} className='flex justify-center whitespace-nowrap  cursor-pointer pl-2 pr-2 pb-1 pt-1 ml-2 items-center' onClick={sendRequest} >
              Add shelf
            </div>
          </div>
          :null

          }
         
    </div>
  )
}
