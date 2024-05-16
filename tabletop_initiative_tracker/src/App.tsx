import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InitiativeList from './components/InitiativeList/InitiativeList';
import RoundCounter from './components/RoundCounter/RoundCounter';
import { Character } from './utils/interface';
import CharacterEditModal from './components/CharacterEditModal/CharacterEditModal';

export default function App(): JSX.Element {
  const [initiativeQueue, setInitiativeQueue] = useState<Character[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number>(0);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState<boolean>(false);
  const [characterBeingEdited,setCharacterBeingEdited] = useState<Character>({name:'', position:0,initiativeScore:0, hitpoints: 0});

  useEffect(()=>{
    console.log('currently active character: ', currentCharacterNumber);
  },[currentCharacterNumber]);
  
  useEffect(()=>{
    console.log('initiativeQueue: ', initiativeQueue);
  },[initiativeQueue]);

  function continueAlongInitiative(): void {
    if(initiativeQueue.length){
      let temp;
      if(currentCharacterNumber >= initiativeQueue.length-1){
        temp = 0;
        setCurrentRoundNumber(currentRoundNumber+1);
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
    const temp = initiativeQueue.map((char, index)=> {
      return {
      ...char,
      position: index,
    }});
    setInitiativeQueue([...temp]);
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
    setCurrentCharacterNumber(0);
    setCurrentRoundNumber(1);
  }

  function editCharacter(position: number){
    console.log('Character to edit: ', initiativeQueue[position]);
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
      setInitiativeQueue(temp);
  }

  return (
    <div className='app'>
        <Header />
        <div className='content'>
          <InitiativeList 
          initiativeQueue={initiativeQueue}
           removeCharacter={removeCharacterFromQueue}
            editCharacter={editCharacter}
            changeCharacterPosition={changeQueuePosition}
            currentlyActiveCharacter={currentCharacterNumber}
            /> 
            <div className='controlSection'>
              <RoundCounter currentRound={currentRoundNumber}/>
              <div className='buttonArea'>
              <button onClick={continueAlongInitiative}>Next</button>
              <button onClick={()=>setIsCharacterEditModalOpen(true)}>Add character</button>
              
              <button onClick={resetInitiativeQueue}>Reset initiative</button>
            </div>
            </div>
          </div>
        <Footer />
        <CharacterEditModal isOpen={isCharacterEditModalOpen} closeModal={()=>setIsCharacterEditModalOpen(false)} characterToEdit={characterBeingEdited} saveCharacterChanges={saveCharacterChanges} addCharacter={addNewCharacterToQueue}/>
    </div>
  )
}