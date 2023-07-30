import  '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useDataStore } from '../components/dataStore';
import { useEffect } from 'react';
export default function MyApp({ Component, pageProps }) {
    const updateToken = useDataStore((state) => state.updateToken)
    const token = useDataStore((state) => state.token)
    const setScreenType = useDataStore(state => state.setScreenType)

    useEffect(() => {
        updateToken()
    }, [])

    useEffect(() => {

      function handleResize() {
          const width = window.innerWidth;

          console.log(width)
          let screenSize = '';
          if (width <= 768) {
              screenSize = 'phone';
            } else if (width <= 1024) {
              screenSize = 'tablet';
            } else {
              screenSize = 'laptop';
            }
            setScreenType(screenSize)
          }
            handleResize()
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
    
    }, [])
    console.log(token)
    return (
        <>
        <Navbar/>
        <Component {...pageProps} />
        </>
    
    )
  }