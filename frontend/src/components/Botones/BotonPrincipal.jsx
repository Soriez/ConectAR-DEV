import React from 'react'

const BotonPrincipal = ( { texto } ) => {
  return (
    <button className='bg-blue-500 text-white rounded-md h-12 px-4 font-semibold whitespace-nowrap'>
        {texto}
    </button>
  )
}

export default BotonPrincipal