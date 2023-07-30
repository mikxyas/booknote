import React from 'react'
import Image from 'next/image'
export default function Book(props) {
  return (
    <>
        <Image
            src={props.image}
            width={159}
            className='hover:scale-125 transition hover:shadow-lg'
            height={220}
            style={{
                  borderRadius:'30px'
              }}
          />
    </>
  )
}
