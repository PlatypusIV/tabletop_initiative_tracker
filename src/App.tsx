import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import settings from './utils/settings.json';
import './App.css';
import Header from './components/Header/Header';
import InitiativeList from './components/InitiativeList/InitiativeList';
import RoundCounter from './components/RoundCounter/RoundCounter';
import { Character, Effect } from './utils/interface';
import CharacterEditModal from './components/CharacterEditModal/CharacterEditModal';
import { getCharactersFromStorage, getCurrentCharacterNumberFromStorage, getNextCharacterName, remapCharacterPositions, setCharactersToStorage, setCurrentCharacterNumberToStorage } from './utils/utility';
import DiceRollsContainer from './components/DiceRollsContainer/DiceRollsContainer';
import WarningPrompt from './components/WarningPrompt/WarningPrompt';
import Loader from './components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState,
  clearInitiativeQueueStore,
  editInitiativeQueue,
  editSelectedCharacter
 } from './state/store';
import React from 'react';


export default function App(): React.JSX.Element {
  const dispatch = useDispatch();
  const storeInitiativeQueue = useSelector((state: RootState)=> state.initiativeQueue.initiativeQueue);
  const storeCharacterBeingEdited = useSelector((state: RootState)=>state.characterBeingEdited.characterBeingEdited);
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number>(0);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState<boolean>(false);
  const [isWarningPromptOpen, setIsWarningPromptOpen] = useState<boolean>(false);
  const [currentBackgroundNumber, setCurrentBackgroundNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);


  useLayoutEffect(()=>{
    setBackground();
  },[]);
  //add initiative queue key to env variables and separate functions from app file
  useEffect(()=>{ 
    if(!storeInitiativeQueue.length){
        dispatch(editInitiativeQueue(getCharactersFromStorage()));
    }
    const temp = getCurrentCharacterNumberFromStorage();
    if(temp){
      setCurrentCharacterNumber(temp);
    }
  },[]);

  useEffect(()=>{
      if(storeInitiativeQueue.length){
        setCharactersToStorage([...storeInitiativeQueue]);
      }

  },[storeInitiativeQueue]);

useEffect(()=>{
    setCurrentCharacterNumberToStorage(currentCharacterNumber);
},[currentCharacterNumber]);

useEffect(()=>{
  if(!isCharacterEditModalOpen){
    dispatch(editSelectedCharacter({name:'', position:0,initiativeScore:0, hitpoints: 0}));
  }
}, [isCharacterEditModalOpen]);

// Latest turn-control handlers/state, so the keydown listener can subscribe once
// instead of re-binding on every turn change.
const turnControlRef = useRef({
  next: continueAlongInitiative,
  back: goBackAlongInitiative,
  blocked: isCharacterEditModalOpen || isWarningPromptOpen,
});
turnControlRef.current = {
  next: continueAlongInitiative,
  back: goBackAlongInitiative,
  blocked: isCharacterEditModalOpen || isWarningPromptOpen,
};

// Keyboard turn control: Space/Right advance, Left/Backspace go back.
// Ignored while a modal is open, or while a form control is focused so that
// native typing/button activation (e.g. Space on a focused button) keeps working.
useEffect(()=>{
  function onKeyDown(event: KeyboardEvent){
    const { next, back, blocked } = turnControlRef.current;
    if(blocked) return;
    const target = event.target as HTMLElement | null;
    if(target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.isContentEditable
    )) return;

    switch(event.code){
      case 'Space':
      case 'ArrowRight':
        event.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'Backspace':
        event.preventDefault();
        back();
        break;
    }
  }
  window.addEventListener('keydown', onKeyDown);
  return ()=> window.removeEventListener('keydown', onKeyDown);
}, []);

  function setBackground(){
    setCurrentBackgroundNumber(Math.floor(Math.random() * settings.background_image_count)+1);
    setIsLoading(false);
  }

  function continueAlongInitiative(): void {
    if(storeInitiativeQueue.length){
      let temp;
      if(currentCharacterNumber >= storeInitiativeQueue.length-1){
        temp = 0;
        setCurrentRoundNumber(currentRoundNumber+1);
        progressEffects();
      }else{
        temp = currentCharacterNumber+1;
      }
      setCurrentCharacterNumber(temp);
    }
  }

  function goBackAlongInitiative(): void {
    if(storeInitiativeQueue.length && currentCharacterNumber > 0){
      setCurrentCharacterNumber(currentCharacterNumber - 1);
    }
  }

  function addCharactersToQueue(characters:Character[]): void {
    if(!characters.length) return;
    const temp = [...storeInitiativeQueue];
    const existingNames = temp.map(c=>c.name);
    characters.forEach(character => {
      const name = getNextCharacterName(character.name, existingNames);
      temp.push({...character, name, position: temp.length});
      existingNames.push(name);
    });
    dispatch(editInitiativeQueue([...temp]));
  }

  //this is not the best, but il make it better after the mvp is out
  function removeCharacterFromQueue(positionToRemove: number): void {
    const temp = [...storeInitiativeQueue];
    temp.splice(positionToRemove,1);
    dispatch(editInitiativeQueue([...remapCharacterPositions(temp)]));

    if(!temp.length){
      dispatch(clearInitiativeQueueStore());
      setCharactersToStorage([]);
    }

    if(positionToRemove=== currentCharacterNumber && currentCharacterNumber === storeInitiativeQueue.length){
      setCurrentCharacterNumber(storeInitiativeQueue.length-1);
    }
  }

  function changeQueuePosition(position: number, change: "+"| "-"){
    const temp = [...storeInitiativeQueue];
    const characterToMove = temp[position];
    if(change=== "-"){
      if(position-1<0)return;
      temp.splice(position,1);
      temp.splice(position-1,0,characterToMove);

    }else{
      if(position+1>storeInitiativeQueue.length)return;
      temp.splice(position,1);
      temp.splice(position+1,0,characterToMove);
    }
    const changedInitiativeQueue = temp.map((char, index)=> {
      return {
      ...char,
      position: index,
    }});
    dispatch(editInitiativeQueue([...changedInitiativeQueue]));
  }

  function clearInitiativeQueue(confirmation:boolean) {
    if(confirmation){

      dispatch(clearInitiativeQueueStore());

      setCharactersToStorage([]);
      setCurrentCharacterNumberToStorage(0);
      setCurrentCharacterNumber(0);
      setCurrentRoundNumber(1);
    }
    setIsWarningPromptOpen(false);
  }

  function resetRound(){
    setCurrentRoundNumber(1);
    setCurrentCharacterNumber(0);
    setCurrentCharacterNumberToStorage(0);
  }

  function openCharacterEditor(position: number){
    dispatch(editSelectedCharacter({...storeInitiativeQueue[position]}));
    setIsCharacterEditModalOpen(true);
  }

  function editCharacterStats(character: Character, position: number){
    const temp = [...storeInitiativeQueue];
    temp[position] = character;
    dispatch(editInitiativeQueue([...temp]))
  }

  function saveCharacterChanges(character: Character){
    const temp = [...storeInitiativeQueue];
    temp[storeCharacterBeingEdited.position] = character;
    dispatch(editInitiativeQueue([...temp]))
  }

  function sortByInitiativeScore(){
    const temp = [...storeInitiativeQueue].sort((a,b)=>(b.initiativeScore || 0) - (a.initiativeScore || 0));
    dispatch(editInitiativeQueue([...remapCharacterPositions(temp)]));
  }

  function progressEffects(){
    const tempCharacterQueue = storeInitiativeQueue.map(character => {
      if(!character.effects) return character;

      const updatedEffects: Record<string, Effect> = {};
      Object.keys(character.effects).forEach(key => {
        const effect = (character.effects as Record<string, Effect>)[key];
        if(effect.duration && effect.duration > 0){
          const newDuration = effect.duration - 1;
          if(newDuration <= 0) return; // effect expired, drop it
          updatedEffects[key] = {...effect, duration: newDuration};
        } else {
          updatedEffects[key] = effect;
        }
      });

      return {...character, effects: updatedEffects};
    });
    dispatch(editInitiativeQueue(tempCharacterQueue));
  }

  return (
    <div className='appWrapper'>
    {isLoading && <Loader/>}
      {!isLoading && <div className={`app background${currentBackgroundNumber}`}>
        <Header />
        <div className='content'>
          <InitiativeList 
          initiativeQueue={storeInitiativeQueue}
           removeCharacter={removeCharacterFromQueue}
            editCharacter={editCharacterStats}
            openCharacterEditor={openCharacterEditor}
            changeCharacterPosition={changeQueuePosition}
            currentlyActiveCharacter={currentCharacterNumber}
            /> 
            <div className='controlSection'>
            <div className='roundAndDiceContainer'>

              <RoundCounter currentRound={currentRoundNumber}/>
              <DiceRollsContainer/>
              </div>

              <div className='buttonContainer'>
                <div className='nextButtonContainer'>
                  <button onClick={continueAlongInitiative} className='nextInitiativeButton'>Next</button>
                </div>
                <div>
                    <button onClick={()=>setIsCharacterEditModalOpen(true)} className='addCharacterButton'>Add character</button>
                </div>
                <div className='extraButtons'>
                  <button onClick={sortByInitiativeScore} className='sortInitiativeButton'>Sort by initiative</button>
                  <button onClick={resetRound} className='resetRondButton'>Reset round</button>
                  <button onClick={()=>setIsWarningPromptOpen(true)} className='clearInitiativeButton'>Clear all</button>
                </div>
            </div>
            </div>
          </div>
        <CharacterEditModal isOpen={isCharacterEditModalOpen} closeModal={()=>setIsCharacterEditModalOpen(false)} saveCharacterChanges={saveCharacterChanges} addCharacters={addCharactersToQueue}/>
        <WarningPrompt isOpen={isWarningPromptOpen} clearInitiativeQueue={clearInitiativeQueue}/>
    </div>}
    </div>
  )
}