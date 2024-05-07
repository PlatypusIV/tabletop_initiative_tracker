import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InitiativeList from './components/InitiativeList/InitiativeList';
import ControlBox from './components/ControlBox/ControlBox';
import RoundCounter from './components/RoundCounter/RoundCounter';
import { Character } from './utils/interface';
import CharacterEditModal from './components/CharacterEditModal/CharacterEditModal';

export default function App(): JSX.Element {
  const [initiativeQueue, setInitiativeQueue] = useState<Character[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number>(0);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState<boolean>(false);
  const [characterBeingEdited,setCharacterBeingEdited] = useState<Character>({name:'', position:0,initiativeScore:0});

  // useEffect(()=>{
  //   console.log(localStorage.getItem('oldInitiative'));

  //   if(localStorage.getItem('oldInitiative')){
  //     console.log(localStorage.getItem('oldInitiative'));
  //   }
  // },[]);

  // useEffect(()=>{
  //   console.log('new Initiative Queue: ', initiativeQueue);
  // }, [initiativeQueue]);

  useEffect(()=>{
    console.log('new currentCharacter number: ', currentCharacterNumber);
  }, [currentCharacterNumber]);

  // useEffect(()=>{
  //   console.log('new currentCharacter number: ', characterBeingEdited);
  // },[characterBeingEdited]);

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

  function addNewCharacterToQueue(): void {
    const temp = initiativeQueue;
    temp.push({name:'Insert name', position: temp.length, initiativeScore: 0});
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

  function changeQueuePosition(){
    console.log('Changes queue position.');
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

  function saveCharacterChanges(character: Character){
    console.log('New character: ', character);
    const temp = initiativeQueue;
    temp[characterBeingEdited.position] = character;
    setInitiativeQueue(temp);
  }

  return (
    <div className='app'>
        <Header />
        <div className='content'><InitiativeList initiativeQueue={initiativeQueue} removeCharacter={removeCharacterFromQueue} editCharacter={editCharacter}/> <div className='controlSection'>
              <RoundCounter currentRound={currentRoundNumber}/>
              <ControlBox continueInitiativeQueue={continueAlongInitiative}
              addNewCharacter={addNewCharacterToQueue} resetInitiativeQueue={resetInitiativeQueue}/>
            </div>
          </div>
        <Footer />
        <CharacterEditModal isOpen={isCharacterEditModalOpen} closeModal={()=>setIsCharacterEditModalOpen(false)} characterToEdit={characterBeingEdited} saveCharacterChanges={saveCharacterChanges}/>
    </div>
  )
}