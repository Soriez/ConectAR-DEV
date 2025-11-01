import React from 'react'

const BotonSecundario = ( { text } ) => {
  return (
    <button className='bg-gray-900 rounded-md h-12 px-4 font-semibold whitespace-nowrap text-blue-500 border border-blue-500 my-8'>
        {text}
    </button>
  )
}

export default BotonSecundario