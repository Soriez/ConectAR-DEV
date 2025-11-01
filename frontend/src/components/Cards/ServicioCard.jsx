
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas)

const Card = ( { data } ) => {
  return (
    <li className="bg-gray-800 rounded-lg text-center">
        <div className='text-4xl p-4'>
          <FontAwesomeIcon 
            icon={['fas', data.icon]} 
            style={{color: data.color, backgroundColor: data.bgColor}}
            className='p-4 rounded-lg'
            />
        </div>
        <div className="text-white font-bold py-2">{data.title}</div>
        <div className="text-gray-400 py-2 px-2">{data.description}</div>
    </li>
  )
}

export default Card