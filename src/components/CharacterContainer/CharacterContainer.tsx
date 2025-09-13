import { useState } from 'react';
import  ArrowDown from "../../assets/arrow-downward.svg";
import  ArrowUp from "../../assets/arrow-upward.svg";
import { Character, Effect } from '../../utils/interface';
import './CharacterContainer.css';

interface Props {
    currentlyActiveCharacter: number;
    character: Character;
    removeCharacter: (position: number) => void;
    openCharacterEditor: (position:number)=> void;
    editCharacter: (character: Character, position: number)=> void;
    changeCharacterPosition: (position: number, change: "+"| "-") => void;
}

//openCharacterEditor, // add back later
export default function CharacterContainer(props:Props):JSX.Element {
  const {character, removeCharacter, changeCharacterPosition, currentlyActiveCharacter, editCharacter, openCharacterEditor} = props;
  const [currentHitpoints,setCurrentHitpoints] = useState<string>('');
  const [currentInitiativeScore, setCurrentInitiativeScore] = useState<string>('');
  const [currentDefense, setCurrentDefense] = useState<string>('');
  const [isHitpointInputVisible,setIsHitpointInputVisible] = useState(false);
  const [isInitiativeScoreInputVisible,setIsInitiativeScoreInputVisible] = useState<boolean>(false);
  const [isDefenseInputVisible,setIsDefenseInputVisible] = useState<boolean>(false);
  const [characterEffectName, setCharacterEffectName] = useState<string>('');
  const [characterEffectDescription, setCharacterEffectDescription] = useState<string>('');
  const [characterEffectRounds, setCharacterEffectRounds] = useState<number>(0);

  function handleInitiativeScoreChange(): void {
    const newInitiativeScore = parseInt(currentInitiativeScore);
    if(isNaN(newInitiativeScore)) return;
    editCharacter({...character, initiativeScore: newInitiativeScore}, character.position);
    setIsInitiativeScoreInputVisible(false);
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

  function handleDefenseChange(): void {
    if(currentDefense === undefined || currentDefense === null || currentDefense ==='') {
      setIsDefenseInputVisible(false);
      return;
    }
    editCharacter({...character, defense: currentDefense}, character.position);
    setIsDefenseInputVisible(false);
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
            return (<li key={effectList[effectId].name}>{`${effectList[effectId].name}: ${effectList[effectId].description || 'N/A'}: ${effectList[effectId].duration || 'N/A'}`} <button onClick={()=> removeEffectFromCharacter(effectId)} className='effectListRemoveButton'>X</button></li>)
          }
    )
    }else{
      return <></>
    }
  }

  function addEffectToCharacter(){
    try {
      if(!characterEffectName) return;
      const tempCharaEffects: Record<string, Effect> = character.effects || {};
      tempCharaEffects[characterEffectName] = {name:characterEffectName, duration: characterEffectRounds, description: characterEffectDescription || undefined};
      character.effects = {...tempCharaEffects};
      editCharacter(character, character.position);
      clearCharacterEffectFields();
    } catch (error) {
      console.log(error);
    }
  }

  //TODO: fix this naming
  function validateNumber(value: string){
    try {
      if(isNaN(parseInt(value)) && value!==''){
        window.alert("Incorrect input!");
      }else {
        setCharacterEffectRounds(parseInt(value));
      }
    } catch (_) {
      window.alert("Unforeseen error!");
    }
  }

  function clearCharacterEffectFields(){
    setCharacterEffectName('');
    setCharacterEffectDescription('');
    setCharacterEffectRounds(0);
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
              <button className='characterDirectEditButton' onClick={()=> openCharacterEditor(character.position)}>Edit</button>
              <button className='positionUpButton' onClick={()=>changeCharacterPosition(character.position, '-')} />
              <button className='positionDownButton' onClick={()=>changeCharacterPosition(character.position, '+')} />
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
                <td>{!isInitiativeScoreInputVisible && (<p className='initiativeScoreText' onClick={()=>setIsInitiativeScoreInputVisible(true)}>{character.initiativeScore}</p>)}
            {isInitiativeScoreInputVisible && (<div>
              <input className='initiativeScoreInput' id='initiativeScoreInput' defaultValue={character.initiativeScore}type='text' onChange={(e)=> setCurrentInitiativeScore(e.target.value)}/>
              <button onClick={()=>handleInitiativeScoreChange()}>Set initiative</button>
            </div>)}</td>
              </tr>
              
              <tr>
                <td>Defense:</td>
                <td>{!isDefenseInputVisible && (<p className='defenseText' onClick={()=>setIsDefenseInputVisible(true)}>{character.defense}</p>)}
            {isDefenseInputVisible && (<div>
              <input className='defenseInput' id='defenseInput' defaultValue={character.defense}type='text' onChange={(e)=> setCurrentDefense(e.target.value)}/>
              <button onClick={handleDefenseChange}>Set defense</button>
            </div>)}</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className='effectContainer'>
            <label>Effect List </label>
            <div className="createEffectContainer">
              <input type="text" className='createEffectNameInput' placeholder='Name' value={characterEffectName} onChange={(e)=>{setCharacterEffectName(e.target.value)}}/>
              <input type="text" className='createEffectDescriptionInput' placeholder='Effect' value={characterEffectDescription} onChange={(e)=>{setCharacterEffectDescription(e.target.value)}}/>
              <input type="text" className='createEffectRoundInput' placeholder='Rounds' value={characterEffectRounds || 0} onChange={(e)=>{validateNumber(e.target.value)}}/> 
              <button className='createEffectAddButton' onClick={addEffectToCharacter}>+</button>
              </div>
            {renderEffectsList(character.effects)}
          </div>
        </div>
        </div>
  )
}