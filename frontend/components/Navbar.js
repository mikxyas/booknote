import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDataStore } from './dataStore';
import { useRouter } from 'next/router';

function  Navbar() {
    // const {token, removeToken, setToken} = useToken();
    const token = useDataStore((state) => state.token)
    const removeToken = useDataStore((state) => state.removeToken)
    const loggedIn = useDataStore((state) => state.loggedIn)
    const [hideNav, sethideNav] = useState(false)
    const [isLoading, setIsloading] = useState(true)
    const router = useRouter()
    


 
    useEffect(() => {
        setIsloading(false);
    }, [])

    useEffect(() => {

        if(router.pathname == "/[id]"){
            sethideNav(true)
        }else {
            sethideNav(false)
        }
    }, [router.pathname])
    
    if (isLoading) {
        return <div>...laoding</div>
    }
    
 return (
    <>
    {/* TODO FIND A GLOBAL WAY TO MAKE SCREENS COMPATIBLE */}
    {hideNav
    ?<></>
    :<nav className=' bg-red-700 text-white absolute w-screen'>
    <ul className="flex">
        <li className="mr-6 ml-6">
            <Link href="/">
                <button className='pt-4 pb-4 '>Home</button>
            </Link>
        </li>
        
         {loggedIn ? 
          <li>
            <button className=' pt-4 pb-4 ' onClick={() => removeToken()}>Logout</button>
          </li>
          : 
          <li>
            <Link href="/signin">
                <button className='pt-4 pb-4 '>Login</button>
            </Link>
          </li>
        }
        <li className="mr-6">
            <button className='pt-4 pb-4 '>Link 3</button>
        </li>
    </ul>
</nav>
    }
        
    </>
  )
}

export default Navbar