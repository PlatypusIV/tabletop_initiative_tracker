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

//openCharacterEditor, // add back later
export default function CharacterContainer(props:Props):JSX.Element {
  const {character, removeCharacter, changeCharacterPosition, currentlyActiveCharacter, editCharacter} = props;
  const [currentHitpoints,setCurrentHitpoints] = useState('');
  const [currentInitiativeScore, setCurrentInitiativeScore] = useState('');
  const [isHitpointInputVisible,setIsHitpointInputVisible] = useState(false);
  const [isInitiativeScoreInputVisible,setInitiativeScoreInputVisible] = useState(false);

  function handleInitiativeScoreChange(): void {
    const newInitiativeScore = parseInt(currentInitiativeScore);
    if(isNaN(newInitiativeScore)) return;
    editCharacter({...character, initiativeScore: newInitiativeScore}, character.position);
    setInitiativeScoreInputVisible(false);
  }

  function handleHitpointChange(): void {
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

  function removeEffectFromCharacter(effectId: string): void {
      if(!character.effects) return;
      delete character.effects[effectId];
      editCharacter(character, character.position);
  }

  function renderEffectsList(effectList: Record<string, Effect> | undefined): JSX.Element[] | JSX.Element {
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
        <div className='characterContainerTitleRow'>
          <div className='removeButtonContainer'>
            <button onClick={()=>removeCharacter(character.position)} className='characterContainerRemoveButton'>X</button>
          </div>
          <div className='characterNameContainer'>
            <p>{character.name}</p>
          </div>
          <div className='positionContainer'>
              <button onClick={()=>changeCharacterPosition(character.position, '-')}>Up</button>
              <button  onClick={()=>changeCharacterPosition(character.position, '+')}>Down</button>
          </div>
        </div>
        <div className='characterContent'>
          <div className='characterInfoTableContainer'>
          <table className='characterTable'>
            <tbody>
              <tr>
                <td>Hitpoints:</td>
                <td>{!isHitpointInputVisible && (<p className='hitpointText' onClick={()=>setIsHitpointInputVisible(true)}>{character.hitpoints}</p>)}
            {isHitpointInputVisible && (<div>
              <input className='hitpointInput' id='hitpointInput' defaultValue={character.hitpoints}type='text' onChange={(e)=> setCurrentHitpoints(e.target.value)}/>
              <button onClick={()=>handleHitpointChange()}>Calculate</button>
            </div>
            ) }</td>
              </tr>
              <tr>
                <td>Initiative:</td>
                <td>{!isInitiativeScoreInputVisible && (<p className='initiativeScoreText' onClick={()=>setInitiativeScoreInputVisible(true)}>{character.initiativeScore}</p>)}
            {isInitiativeScoreInputVisible && (<div>
              <input className='initiativeScoreInput' id='initiativeScoreInput' defaultValue={character.initiativeScore}type='text' onChange={(e)=> setCurrentInitiativeScore(e.target.value)}/>
              <button onClick={()=>handleInitiativeScoreChange()}>Set initiative</button>
            </div>)}</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className='effectContainer'>
            <label>Effect List </label>
            {renderEffectsList(character.effects)}
          </div>
        </div>
        </div>
  )
}
/*Need top figure out why edit breaks, but til then im removing it */
/* <button onClick={()=> openCharacterEditor(character.position)}>Edit</button> */