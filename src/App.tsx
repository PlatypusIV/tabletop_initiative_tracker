import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InitiativeList from './components/InitiativeList/InitiativeList';
import RoundCounter from './components/RoundCounter/RoundCounter';
import { Character, Effect } from './utils/interface';
import CharacterEditModal from './components/CharacterEditModal/CharacterEditModal';
import { getCharactersFromStorage, getCurrentCharacterNumberFromStorage, getEffectsFromStorage, remapCharacterPositions, setCharactersToStorage, setCurrentCharacterNumberToStorage, setEffectsToStorage } from './utils/utility';
import EffectModal from './components/EffectModal/EffectModal';
import {v4 as uuidv4} from 'uuid';
// import DiceRollsContainer from './components/DiceRollsContainer/DiceRollsContainer';

export default function App(): JSX.Element {
  const [initiativeQueue, setInitiativeQueue] = useState<Character[]>([]);
  const [effectList, setEffectList] = useState<Record<string,Effect>>({});
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number>(0);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState<boolean>(false);
  const [isEffectModalOpen, setIsEffectModalOpen] = useState<boolean>(false);
  const [characterBeingEdited,setCharacterBeingEdited] = useState<Character>({name:'', position:0,initiativeScore:0, hitpoints: 0});
  //add warning prompt for removing characters and resetting initative
  // const [isWarningPromptOpen, setIsWarningPromptOpen] = useState(false);


  //add initiative queue key to env variables and separate functions from app file
  useEffect(()=>{    
    if(!initiativeQueue.length){
        setInitiativeQueue(getCharactersFromStorage());
    }
    if(!Object.keys(effectList).length){
      setEffectList(getEffectsFromStorage());
    }
    const temp = getCurrentCharacterNumberFromStorage();
    if(temp){
      setCurrentCharacterNumber(temp);
    }
  },[]);

  useEffect(()=>{
      if(initiativeQueue.length){
        setCharactersToStorage(initiativeQueue);
      }
  },[initiativeQueue]);

  useEffect(()=>{
    if(Object.keys(effectList).length){
      setEffectsToStorage(effectList);
    }
  },[effectList]);

useEffect(()=>{
    setCurrentCharacterNumberToStorage(currentCharacterNumber);
},[currentCharacterNumber]);

  function continueAlongInitiative(): void {
    if(initiativeQueue.length){
      let temp;
      if(currentCharacterNumber >= initiativeQueue.length-1){
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
    const temp = initiativeQueue;
    character.position=initiativeQueue.length;
    temp.push(character);
    setInitiativeQueue([...temp]);
  }

  //this is not the best, but il make it better after the mvp is out
  function removeCharacterFromQueue(positionToRemove: number): void {
    initiativeQueue.splice(positionToRemove,1);
    setInitiativeQueue([...remapCharacterPositions(initiativeQueue)]);
    if(initiativeQueue.length===0){
      setCharactersToStorage([]);
    }

    if(positionToRemove=== currentCharacterNumber && currentCharacterNumber === initiativeQueue.length){
      setCurrentCharacterNumber(initiativeQueue.length-1);
    }
  }

  function changeQueuePosition(position: number, change: "+"| "-"){
    const temp = initiativeQueue;
    const characterToMove = temp[position];
    if(change=== "-"){
      if(position-1<0)return;
      temp.splice(position,1);
      temp.splice(position-1,0,characterToMove);

    }else{
      if(position+1>initiativeQueue.length)return;
      temp.splice(position,1);
      temp.splice(position+1,0,characterToMove);
    }
    const changedInitiativeQueue = temp.map((char, index)=> {
      return {
      ...char,
      position: index,
    }});
    setInitiativeQueue([...changedInitiativeQueue]);
  }

  function resetInitiativeQueue(){
    setInitiativeQueue([]);
    setCharactersToStorage([]);
    setCurrentCharacterNumberToStorage(0);
    setCurrentCharacterNumber(0);
    setCurrentRoundNumber(1);
  }

  function openCharacterEditor(position: number){
    setCharacterBeingEdited(initiativeQueue[position]);
    setIsCharacterEditModalOpen(true);
  }

  function editCharacterStats(character: Character, position: number){
    const temp = initiativeQueue;
    temp[position] = character;
    setInitiativeQueue([...temp]);
  }

  function saveCharacterChanges(character: Character){
    const temp = initiativeQueue;
    temp[characterBeingEdited.position] = character;
    setInitiativeQueue([...temp]);
  }

  function sortByInitiativeScore(){
    const temp = initiativeQueue.sort((a,b)=>(b.initiativeScore || 0) - (a.initiativeScore || 0));
    setInitiativeQueue([...remapCharacterPositions(temp)]);
  }

  function createNewEffect(effectToCreate: Effect){
    const newEffectList = effectList;
    newEffectList[uuidv4()] = effectToCreate;
    setEffectList({...newEffectList});
  }

  function editExistingEffect(effectId: string, editedEffect: Effect){
    const temp = effectList;
    temp[effectId] = editedEffect;
    setEffectList({...temp});
  }

  //TODO improve this
  function applyEffects(effectIdList: string[], characterPositionList: string[]){
    const tempInitiativeQueue = initiativeQueue;
    const effectsToApply: Record<string, Effect> = {};

    effectIdList.forEach(id => {
      effectsToApply[id] = {...effectList[id]};
    });

    for(let i =0; i<characterPositionList.length;i++){
      const temp = parseInt(characterPositionList[i]);

      tempInitiativeQueue[temp].effects = {...tempInitiativeQueue[temp].effects, ...effectsToApply};
    }

    setInitiativeQueue([...tempInitiativeQueue]);
  }

  function deleteEffect(effectId: string){ 
    const temp = effectList;
    delete temp[effectId];
    setEffectList({...temp});
    if(Object.keys(temp).length ===0){
      setEffectsToStorage({});
    }
  }

  function progressEffects(){
    const tempCharacterQueue = initiativeQueue;
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
    setInitiativeQueue([...tempCharacterQueue]);
  }

  return (
    <div className='app'>
        <Header />
        <div className='content'>
          <InitiativeList 
          initiativeQueue={initiativeQueue}
           removeCharacter={removeCharacterFromQueue}
            editCharacter={editCharacterStats}
            openCharacterEditor={openCharacterEditor}
            changeCharacterPosition={changeQueuePosition}
            currentlyActiveCharacter={currentCharacterNumber}
            /> 
            <div className='controlSection'>
            <div className='roundAndDiceContainer'>

              <RoundCounter currentRound={currentRoundNumber}/>
              {/* <DiceRollsContainer></DiceRollsContainer> */}
              </div>

              <div className='buttonArea'>
                <div className='nextButtonContainer'>
                  <button onClick={continueAlongInitiative} className='nextInitiativeButton'>Next</button>
                </div>
                <div>
                    <button onClick={()=>setIsCharacterEditModalOpen(true)} className='addCharacterButton'>Add character</button>
                </div>
                <div className='extraButtons'>
                  <button onClick={()=>setIsEffectModalOpen(true)}>Open effects</button>
                  <button onClick={sortByInitiativeScore}>Sort by initiative</button>
                  <button onClick={resetInitiativeQueue} className='resetInitiativeButton'>Reset initiative</button>
                </div>
            </div>
            </div>
          </div>
        <Footer />
        <CharacterEditModal isOpen={isCharacterEditModalOpen} closeModal={()=>setIsCharacterEditModalOpen(false)} characterToEdit={characterBeingEdited} saveCharacterChanges={saveCharacterChanges} addCharacter={addNewCharacterToQueue}/>
        <EffectModal isOpen={isEffectModalOpen} closeModal={()=> setIsEffectModalOpen(false)} createNewEffect={createNewEffect} effectList={effectList} characterList={initiativeQueue} applyEffects={applyEffects} deleteEffect={deleteEffect} editExistingEffect={editExistingEffect}/>
    </div>
  )
}