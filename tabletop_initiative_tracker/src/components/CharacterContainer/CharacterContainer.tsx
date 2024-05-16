import React from 'react';
import { Character } from '../../utils/interface';
import './CharacterContainer.css';

interface Props{
    currentlyActiveCharacter: number;
    character: Character;
    removeCharacter: (position: number) => void;
    editCharacter: (position:number)=> void;
    changeCharacterPosition: (position: number, change: "+"| "-") => void;
}


export default function CharacterContainer(props:Props):JSX.Element {
    const {character, removeCharacter, editCharacter, changeCharacterPosition, currentlyActiveCharacter} = props;

  function handleHitpointChange(changeInHitpoints){
    console.log('change in hitpoints: ', changeInHitpoints);
  }

  return (
    <div className={character.position === currentlyActiveCharacter? 'characterContainer active' :'characterContainer'}>
        <div className='infoContainer'>
        <p className='characterContainerTitle'>Name: {character.name}</p>
          <div>
            <label htmlFor="hitpointInput">Hitpoints: </label><input className='hitpointInput' id='hitpointInput' defaultValue={character.hitpoints} type='text' onChange={(e)=> handleHitpointChange(e.target.value)}/>
          </div>
          <div>
          <p>Position: {character.position}</p>
          </div>
          <div>
          <p>Initiative score: {character.initiativeScore}</p>
          </div>
          <div className='editRemoveContainer'>
        <button onClick={()=>removeCharacter(character.position)}>Remove</button>
        <button onClick={()=> editCharacter(character.position)}>Edit</button>
        </div>
        </div>
        <div className='positionContainer'>
          <button onClick={()=>changeCharacterPosition(character.position, '-')}>Up</button>
          <button  onClick={()=>changeCharacterPosition(character.position, '+')}>Down</button>
        </div>
        </div>
  )
}
