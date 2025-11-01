import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BotonPrincipal from '../Botones/BotonPrincipal'


const HeaderInicio = () => {
  return (
    <div className='md:grid grid-cols-2 gap-6 px-4 container mx-auto'>
        <div>
            <div className='text-5xl font-bold'>
            <p className='text-white py-3'>Conecta con los</p>
            <span className='text-blue-600 py-3'>mejores </span>
            <span className='text-yellow-400 py-3'>developers</span>
            <p className='text-white py-3'>Argentinos</p>
            </div>
            <p className='text-gray-400'>La plataforma especializada que une Freelancers Argentinos del área IT con empresas que buscan talento nacional de calidad. Desde desarrollo web hasta inteligencia artifial</p>
            <div className='my-2 bg-white py-2 rounded-md px-4'>
            <form className="flex gap-3">
                <div className='rounded-md border-gray-600 border flex bg-gray-200 grow items-center min-w-0'>
                <label htmlFor="searchHome">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='my-auto px-1'/>
                </label>
                <input 
                    type="text" 
                    name="search" 
                    id="searchHome" 
                    className='rounded-md border-gray-600 border bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 pl-2 py-1 mr-1 min-w-0 grow'
                />
                </div>
                <BotonPrincipal text={'Buscar Talento'} />
                
            </form>
            </div>
        </div>
        <div>
            <img src="/public/imgs/logo.jpeg" alt="" />
        </div>
    </div>
  )
}

export default HeaderInicio