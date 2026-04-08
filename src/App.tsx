import { useEffect, useLayoutEffect, useState } from 'react';
import settings from './utils/settings.json';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InitiativeList from './components/InitiativeList/InitiativeList';
import RoundCounter from './components/RoundCounter/RoundCounter';
import { Character, Effect } from './utils/interface';
import CharacterEditModal from './components/CharacterEditModal/CharacterEditModal';
import { getCharactersFromStorage, getCurrentCharacterNumberFromStorage, remapCharacterPositions, setCharactersToStorage, setCurrentCharacterNumberToStorage } from './utils/utility';
import DiceRollsContainer from './components/DiceRollsContainer/DiceRollsContainer';
import WarningPrompt from './components/WarningPrompt/WarningPrompt';
import Loader from './components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './state/store';
import { clearInitiativeQueueStore, editInitiativeQueue } from './state/initiativeQueueSlice';

export default function App(): JSX.Element {
  const storeInitiativeQueue = useSelector((state: RootState)=> state.initiativeQueue.initiativeQueue);
  const dispatch = useDispatch();
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number>(0);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState<boolean>(false);
  const [characterBeingEdited,setCharacterBeingEdited] = useState<Character>({name:'', position:0,initiativeScore:0, hitpoints: 0});
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
    setCharacterBeingEdited({name:'', position:0,initiativeScore:0, hitpoints: 0});
  }
}, [isCharacterEditModalOpen]);

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

  function addNewCharacterToQueue(character:Character): void {
    const temp = [...storeInitiativeQueue];
    character.position=storeInitiativeQueue.length;
    temp.push(character);
    dispatch(editInitiativeQueue([...temp]));
  }

  //this is not the best, but il make it better after the mvp is out
  function removeCharacterFromQueue(positionToRemove: number): void {
    const temp = [...storeInitiativeQueue];
    temp.splice(positionToRemove,1);
    dispatch(editInitiativeQueue([...remapCharacterPositions(temp)]));

    if(storeInitiativeQueue.length===0){
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
    setCharacterBeingEdited(storeInitiativeQueue[position]);
    setIsCharacterEditModalOpen(true);
  }

  function editCharacterStats(character: Character, position: number){
    const temp = [...storeInitiativeQueue];
    temp[position] = character;
    dispatch(editInitiativeQueue([...temp]))
  }

  function saveCharacterChanges(character: Character){
    const temp = [...storeInitiativeQueue];
    temp[characterBeingEdited.position] = character;
    dispatch(editInitiativeQueue([...temp]))
  }

  function sortByInitiativeScore(){
    const temp = [...storeInitiativeQueue].sort((a,b)=>(b.initiativeScore || 0) - (a.initiativeScore || 0));
    dispatch(editInitiativeQueue([...remapCharacterPositions(temp)]));
  }

  function progressEffects(){
    const tempCharacterQueue = [...storeInitiativeQueue];
    for(let i = 0;i<tempCharacterQueue.length;i++){
      if(tempCharacterQueue[i].effects){
        const characterEffectList = tempCharacterQueue[i].effects as Record<string, Effect>;
        const charaEffectKeys = Object.keys(tempCharacterQueue[i].effects as Record<string, Effect>);

        charaEffectKeys.forEach(key => {
          if(characterEffectList[key].duration && characterEffectList[key].duration >0){
            characterEffectList[key] = {...characterEffectList[key], duration:characterEffectList[key].duration-1};
            if(characterEffectList[key].duration<=0) delete characterEffectList[key];
          }
        });
      }
    }
    dispatch(editInitiativeQueue([...tempCharacterQueue]));
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
                  <button onClick={sortByInitiativeScore}>Sort by initiative</button>
                  <button onClick={resetRound} className='resetRondButton'>Reset round</button>
                  <button onClick={()=>setIsWarningPromptOpen(true)} className='clearInitiativeButton'>Clear all</button>
                </div>
            </div>
            </div>
          </div>
        <Footer />
        <CharacterEditModal isOpen={isCharacterEditModalOpen} closeModal={()=>setIsCharacterEditModalOpen(false)} characterToEdit={characterBeingEdited} saveCharacterChanges={saveCharacterChanges} addCharacter={addNewCharacterToQueue}/>
        <WarningPrompt isOpen={isWarningPromptOpen} clearInitiativeQueue={clearInitiativeQueue}/>
    </div>}
    </div>
  )
}