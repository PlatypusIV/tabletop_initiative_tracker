import React from 'react';
import './CharacterContainer.css';

interface Props{
    name: string;
    initiativePosition: number;
    initiativeScore?: number;
    removeCharacter: (position: number) => void;
}


export default function CharacterContainer(props:Props):JSX.Element {
    const {name, initiativePosition, initiativeScore, removeCharacter} = props;

    
  return (
    <div className='characterContainer'>
        <h3 className='characterContainerTitle'>{name}</h3>
        <>{initiativePosition}</>
        <>{initiativeScore}</>
        <button>Up</button>
        <button>Down</button>
        <button>Edit</button>
        <button onClick={()=>removeCharacter(initiativePosition)}>Remove</button>
        </div>
  )
}
