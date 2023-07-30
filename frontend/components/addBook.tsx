import React, { useEffect, useState } from 'react'
import { useDataStore } from './dataStore'
import Router from 'next/router'
import Image from 'next/image'

export default function AddBook() {
    const [openForm, setopenForm] = useState(false)
    const setShelf = useDataStore((state) => state.setShelf)
    const setRefetchPage = useDataStore((state) => state.setReFetchPage)
    const doRefetchAll = useDataStore((state) => state.doRefetchAll)
    const [formData, setFormData] = useState({"name": "", "cover": ""})
    const setShowShelf = useDataStore(state => state.setShowShelf)
    const [coverLoaded, setCoverLoaded] = useState(false)
    const [coverData, setCoverData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleOpenForm = () => {
        if (openForm == false){
            setopenForm(true)
        }
    }

    const sendRequest = (img, title) => {
        const url_token = localStorage.getItem("token")
        fetch('http://127.0.0.1:5000/addbook', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': url_token,
            },
            body: JSON.stringify({"cover":img, "name": title})
        }).then((res) => res.json())
        .then((data) => {
            console.log(data)
            setShelf(data.shelf)
            setopenForm(false)
            doRefetchAll()
            setShowShelf()
        })
    }
       
    const SearchBook = (text) => {
        setLoading(true)
        setCoverData('')
        const url_token = localStorage.getItem("token")
        fetch('http://127.0.0.1:5000/search', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': url_token,
            },
            body: JSON.stringify({"query": text})
        }).then((res) => res.json())
        .then((data) => {
            setCoverData(data)
            if(data.length == 0){
                setCoverData('empty')
                console.log("relax")
            }
            console.log(data)
            setCoverLoaded(true)
            setLoading(false)
        })
       
    }
    
   
    const handleFormChange = (event) => {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]:value
        })
            // SearchBook(formData.name)
    } 

    return (
        
    <>
        {openForm
            ?
            <>
            <div onClick={handleOpenForm} style={{height:"auto", position:"fixed", width:"23em", background:'rgba(229, 235, 238, 0.5)',backdropFilter:"blur(10px)"}} className={`shadow-lg ${openForm ? 'col-span-3' : ''}  z-50 hover:cursor-pointer right-0 flex flex-col rounded-xl items-center pt-10 pb-10 top-50 left-0 bottom-50 m-auto`} >
                
                <input style={{width:"20em", background:  'rgba(400, 400, 400, 0.8)',}} value={formData.name} onChange={handleFormChange} className='p-3 rounded-lg mb-2  outline-none' name="name" placeholder='Search the book you want to add' autoFocus/>
                <div  className='flex mb-3 justify-end items-end w-full mr-12'>

                <button style={{background:  'rgba(400, 400, 400, 0.8)', boxShadow:'0px 1px 4px 0px rgba(0, 0, 0, 0.25)', borderRadius:'7px', fontSize:"16px", fontWeight:"400",marginLeft:""}} onClick={() => SearchBook(formData.name)}>Search</button>

                </div>
                {/* <input value={formData.cover} onChange={handleFormChange} className='p-1 rounded-md ' name="cover" placeholder='Image URL'/> */}
                {coverData == null
                ?null
                :<div style={{width:"20em", height:'fit-content'}} className='bg-gray-100 bg-opacity-50 rounded-xl p-3 mt-0 flex items-center justify-center'>
                {loading
                    ?<div>Loading...</div>
                    :<>
                    
                    <div className={`${coverData.length == 1 ? null :'grid'} gap-2 grid-cols-3  grid-rows-3`}>
                    {coverData.map(cover => (
                        <Image style={{height:'133px'}} onClick={() => sendRequest(cover.cover_image, cover.title)} src={"https:" + cover.cover_image} placeholder='blur' blurDataURL="./the-48-laws-of-power-cover.png" className='rounded-lg' alt={cover.title} width={100} height={100}  />
                    ))} 
                </div>

                    </>
                }
                
                
            </div>

                }
                
                {/* <div onClick={() => SearchBook(formData.name)} className='pt-1 pb-1 pl-1 pr-1 mt-2 w-24 bg-white text-center rounded-xl border border-gray-500'>
                    Add Book
                </div> */}

            </div>
            <div style={{ position:'fixed'}} className='flex items-center justify-center left-72 -right-14   z-50'>
                <button style={{background:  'rgba(225, 225, 205, 0)', borderRadius:'7px', fontSize:"16px", fontWeight:"400",marginLeft:""}} className='mr-3'  onClick={() => setopenForm(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

                </button>
            </div>
   
            
            </>
            :<div onClick={() => setopenForm(true)}  style={{height:"132px", width:"50px"}} className='rounded-lg flex items-center  cursor-pointer justify-center'>
                <div style={{height:"40px", width:"40px"}} className=' bg-gray-800 flex justify-center items-center rounded'>
                    <p className='font-bold text-2xl text-white '>+</p>
                </div>
            </div> 
        }

    </>
  )
}
