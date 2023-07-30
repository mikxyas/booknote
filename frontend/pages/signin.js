import React, {useState, useEffect} from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useDataStore } from '../components/dataStore'
export default function signin() {

    const [data, setData] = useState({
        email:"",
        password:"",
    })
    
        // const {token, setToken, removeToken} = useToken();
        const token = useDataStore((state) => state.token)
        const setToken = useDataStore((state) => state.setToken)
    

    function updateFeid(e) {
        setData({
            ...data,
            [e.target.name]:[e.target.value]
        })
    }
    const SendData = async (e) => {
        e.preventDefault();
       const dataSent = await fetch("http://localhost:5000/login", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            })
        })
        const result = await dataSent.json();
        if(result["token"]){
            setToken(result["token"])
        }
        console.log(result)
        // GetSecret()
    }

    useEffect(() => {

        if(token){
            Router.push("/")
        }
        console.log(token)

    }, [token])

    // const GetSecret = async () => {
    //     const dataSent = await fetch("http://localhost:5000/secret", {
    //         method:"GET",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             "Authorization": 'Bearer ' + token
    //         },
    //     })
    //     const result = await dataSent.json()
    //     // console.log('asdasd')
    //     console.log(result)
    //     // console.log('asdasd')
    // }
  
  return (
    <div className=' flex flex-col w-screen  h-screen items-center justify-center'>
        <div className='w-full max-w-xs rounded-3xl bg-transparent border border-gray-300 p-2'>
            <form onSubmit={SendData}   method='POST'  className=' px-8 pt-2 pb-1 mb-4'>
            <h3 className='mb-5 text-center text-xl mt-1'>SIGN IN</h3>
                <div className='mb-3'>
                    <input name="email" onChange={updateFeid} value={data.email} className='border-gray-300 appearance-none border rounded-full w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="email" placeholder='EMAIL'/>
                </div>    
                <div className='mb-6'>
                    <input name="password" onChange={updateFeid} value={data.password} className='border-gray-300 appearance-none border rounded-full w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="password" placeholder='PASSWORD'/>
                </div>
                <div className='flex items-center justify-between'>
                    <button className='bg-red-600  text-white rounded-md' type="submit">SIGN IN</button>
                    <p>Or</p>
                    <Link href="./register">
                        <button type='submit' className='pl-2 pr-2 '>REGISTER</button>
                    </Link>
                    
                </div>
            </form>
        </div>
    </div>
  )
}
