import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const Card = ( { data } ) => {
  return (
    <li className="bg-gray-800 rounded-md text-center">
        <FontAwesomeIcon icon={data.icon}/>
        <div className="">{data.icon}</div>
        <div className="text-white font-bold py-2">{data.title}</div>
        <div className="text-gray-400 py-2 px-2">{data.description}</div>
    </li>
  )
}

export default Card