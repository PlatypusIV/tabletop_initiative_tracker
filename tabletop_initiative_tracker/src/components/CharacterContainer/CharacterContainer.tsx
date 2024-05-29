import { useState } from 'react';
import { Character, Effect } from '../../utils/interface';
import './CharacterContainer.css';

interface Props{
    currentlyActiveCharacter: number;
    character: Character;
    removeCharacter: (position: number) => void;
    openCharacterEditor: (position:number)=> void;
    editCharacter: (character: Character, position: number)=> void;
    changeCharacterPosition: (position: number, change: "+"| "-") => void;
}

export default function CharacterContainer(props:Props):JSX.Element {
  const {character, removeCharacter, openCharacterEditor, changeCharacterPosition, currentlyActiveCharacter, editCharacter} = props;
  const [currentHitpoints,setCurrentHitpoints] = useState('');
  const [isHitpointInputVisible,setIsHitpointInputVisible] = useState(false);

  function handleHitpointChange(){
    //check for - or +
    //then split by the numbers on each side
    //if there is no - or + check if value is number
    //if entering a string then simply return

    //check wether end or beginning has number
    let newHitpointValue = 0;

    if(currentHitpoints.match(/[^-+,\d,\s]/g)?.length) return;
    
    const tempSignArray = currentHitpoints.match(/[-+]/g);
    if(tempSignArray?.length){
      const numbers = currentHitpoints.split(/[+-]+/g);
      newHitpointValue =parseInt(numbers[0]);
      for(let i= 0;i<tempSignArray.length;i++){
        newHitpointValue = tempSignArray[i] === "+" ? newHitpointValue + parseInt(numbers[i+1]) :newHitpointValue - parseInt(numbers[i+1]);
      }
    }else {
      newHitpointValue = parseInt(currentHitpoints);
    }
    if(isNaN(newHitpointValue)) return;

    editCharacter({...character, hitpoints: newHitpointValue}, character.position);
    setIsHitpointInputVisible(false);
  }

  function removeEffectFromCharacter(effectId: string){
      if(!character.effects) return;
      delete character.effects[effectId];
      editCharacter(character, character.position);
  }

  function renderEffectsList(effectList: Record<string, Effect> | undefined){
    if(effectList){
      return Object.keys(effectList).map(
        (effectId)=>
          {
            return (<li>{`${effectList[effectId].name}: ${effectList[effectId].duration || 'N/A'}`} <button onClick={()=> removeEffectFromCharacter(effectId)}>X</button></li>)
          }
    )
    }else{
      return <></>
    }
  }

  return (
    <div className={character.position === currentlyActiveCharacter? 'characterContainer active' :'characterContainer'}>
        <div className='infoContainer'>
        <p className='characterContainerTitle'>Name: {character.name}</p>
          <div>
            <label>Hitpoints: </label>
            {!isHitpointInputVisible && (<p className='hitpointText' onClick={()=>setIsHitpointInputVisible(true)}>{character.hitpoints}</p>)}
            {isHitpointInputVisible && (<div>
              <input className='hitpointInput' id='hitpointInput' defaultValue={character.hitpoints}type='text' onChange={(e)=> setCurrentHitpoints(e.target.value)}/>
              <button onClick={()=>handleHitpointChange()}>Calculate</button>
            </div>
            ) }
          </div>
          <div>
          <p>Position: {character.position}</p>
          </div>
          <div>
          <p>Initiative score: {character.initiativeScore}</p>
          </div>
          <div className='effectContainer'>
            {renderEffectsList(character.effects)}
          </div>
        <div className='editRemoveContainer'>
        <button onClick={()=>removeCharacter(character.position)}>Remove</button>
        <button onClick={()=> openCharacterEditor(character.position)}>Edit</button>
        </div>
        </div>
        <div className='positionContainer'>
          <button onClick={()=>changeCharacterPosition(character.position, '-')}>Up</button>
          <button  onClick={()=>changeCharacterPosition(character.position, '+')}>Down</button>
        </div>
        </div>
  )
}
