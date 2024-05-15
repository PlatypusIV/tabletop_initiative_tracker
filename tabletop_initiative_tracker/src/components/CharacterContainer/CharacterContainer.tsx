import React from 'react';
import './CharacterContainer.css';

interface Props{
    name: string;
    initiativePosition: number;
    initiativeScore?: number;
    removeCharacter: (position: number) => void;
    editCharacter: (position:number)=> void;
    changeCharacterPosition: (position: number, change: "+"| "-") => void;
}


export default function CharacterContainer(props:Props):JSX.Element {
    const {name, initiativePosition, initiativeScore, removeCharacter, editCharacter, changeCharacterPosition} = props;

    
  return (
    <div className='characterContainer'>
        <h3 className='characterContainerTitle'>{name}</h3>
        <>{initiativePosition}</>
        <>{initiativeScore}</>
        <button onClick={()=>changeCharacterPosition(initiativePosition, '-')}>Up</button>
        <button  onClick={()=>changeCharacterPosition(initiativePosition, '+')}>Down</button>
        <button onClick={()=> editCharacter(props.initiativePosition)}>Edit</button>
        <button onClick={()=>removeCharacter(initiativePosition)}>Remove</button>
        </div>
  )
}
