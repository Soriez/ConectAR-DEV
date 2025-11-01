import React from 'react'

const BotonPrincipal = ( { text } ) => {
  return (
    <button className='bg-blue-500 text-white rounded-md h-12 px-4 font-semibold whitespace-nowrap'>
        {text}
    </button>
  )
}

export default BotonPrincipal