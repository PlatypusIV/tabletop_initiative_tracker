import { useEffect, useRef, useState } from 'react';
import { Character, Effect } from '../../utils/interface';
import './CharacterContainer.css';
import { setSavedCharacterToStorage } from '../../utils/utility';
import React from 'react';

interface Props {
    currentlyActiveCharacter: number;
    character: Character;
    removeCharacter: (position: number) => void;
    openCharacterEditor: (position:number)=> void;
    editCharacter: (character: Character, position: number)=> void;
    changeCharacterPosition: (position: number, change: "+"| "-") => void;
}

//openCharacterEditor, // add back later
export default function CharacterContainer(props:Props):React.JSX.Element {
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
  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = character.position === currentlyActiveCharacter;

  // When this card becomes the active turn, scroll it into view so an off-screen
  // (overflowed) character's turn is visible without manual scrolling.
  useEffect(()=>{
    if(isActive){
      cardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  },[isActive]);

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
      const updatedEffects = {...character.effects};
      delete updatedEffects[effectId];
      editCharacter({...character, effects: updatedEffects}, character.position);
  }

  function renderEffectsRows(effectList: Record<string, Effect>):React.JSX.Element[] {
    return Object.keys(effectList).map(
      (effectId)=>
        (<tr key={effectList[effectId].name} className='effectRow'>
          <td className='effectNameCell'><p>{effectList[effectId].name}</p></td>
          <td className='effectDescCell'>{effectList[effectId].description || 'N/A'}</td>
          <td className='effectDurationCell'>{effectList[effectId].duration || 'N/A'}</td>
          <td><button onClick={()=> removeEffectFromCharacter(effectId)} className='effectRemoveButton' title='Remove effect'>✕</button></td>
        </tr>)
    )
  }

  function addEffectToCharacter(){
    try {
      if(!characterEffectName) return;
      const updatedEffects: Record<string, Effect> = {
        ...(character.effects || {}),
        [characterEffectName]: {name: characterEffectName, duration: characterEffectRounds, description: characterEffectDescription || undefined},
      };
      editCharacter({...character, effects: updatedEffects}, character.position);
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

  function onCharacterSaveButtonPress(character: Character): void{
    try {
      setSavedCharacterToStorage(character);
      window.alert(`${character.name} saved`);
    } catch (_) {
      window.alert("Failed to save character");
    }
  }

  return (
    <div ref={cardRef} className={isActive ? 'characterContainer active' :'characterContainer'}>
        <div className='characterContainerTitleRow'>
          <div className='removeButtonContainer'>
            <button onClick={()=>removeCharacter(character.position)} className='characterContainerRemoveButton'>X</button>
          </div>
          <div className='characterNameContainer'>
            <p>{character.name}</p>
          </div>
          <div className='positionContainer'>
              <button className='characterSaveButton' onClick={()=> onCharacterSaveButtonPress(character)}>Save</button>
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
                <td>{!isHitpointInputVisible && (<p className='statValue hitpointText' onClick={()=>setIsHitpointInputVisible(true)}>{character.hitpoints ?? '—'}</p>)}
            {isHitpointInputVisible && (<div className='statEditRow'>
              <input className='statEditInput hitpointInput' id='hitpointInput' defaultValue={character.hitpoints}type='text' onChange={(e)=> setCurrentHitpoints(e.target.value)}/>
              <button className='statConfirmButton' onClick={()=>handleHitpointChange()}>Calculate</button>
            </div>
            ) }</td>
              </tr>
              <tr>
                <td>Initiative:</td>
                <td>{!isInitiativeScoreInputVisible && (<p className='statValue initiativeScoreText' onClick={()=>setIsInitiativeScoreInputVisible(true)}>{character.initiativeScore ?? '—'}</p>)}
            {isInitiativeScoreInputVisible && (<div className='statEditRow'>
              <input className='statEditInput initiativeScoreInput' id='initiativeScoreInput' defaultValue={character.initiativeScore}type='text' onChange={(e)=> setCurrentInitiativeScore(e.target.value)}/>
              <button className='statConfirmButton' onClick={()=>handleInitiativeScoreChange()}>Set initiative</button>
            </div>)}</td>
              </tr>
              
              <tr>
                <td>Defense:</td>
                <td>{!isDefenseInputVisible && (<p className='statValue defenseText' onClick={()=>setIsDefenseInputVisible(true)}>{character.defense}</p>)}
            {isDefenseInputVisible && (<div className='statEditRow'>
              <input className='statEditInput defenseInput' id='defenseInput' defaultValue={character.defense}type='text' onChange={(e)=> setCurrentDefense(e.target.value)}/>
              <button className='statConfirmButton' onClick={handleDefenseChange}>Set defense</button>
            </div>)}</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className='effectContainer'>
            <div className='effectHeader'>
              <h3>Effects</h3>
            </div>
            <div className="createEffectContainer">
              <input type="text" className='createEffectInput createEffectNameInput' placeholder='Name' value={characterEffectName} onChange={(e)=>{setCharacterEffectName(e.target.value)}}/>
              <input type="text" className='createEffectInput createEffectDescriptionInput' placeholder='Effect' value={characterEffectDescription} onChange={(e)=>{setCharacterEffectDescription(e.target.value)}}/>
              <input type="text" className='createEffectInput createEffectRoundInput' placeholder='Rounds' value={characterEffectRounds || 0} onChange={(e)=>{validateNumber(e.target.value)}}/>
              <button className='createEffectAddButton' onClick={addEffectToCharacter} title='Add effect'>+</button>
            </div>
            <div className='effectTableContainer'>
              {!character.effects || Object.keys(character.effects).length === 0 ? (
                <p className='effectEmpty'>No active effects.</p>
              ) : (
                <table className='effectTable'>
                  <thead>
                    <tr><th>Name</th><th>Effect</th><th>Dur</th><th>Del</th></tr>
                  </thead>
                  <tbody>
                    {renderEffectsRows(character.effects)}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        </div>
  )
}