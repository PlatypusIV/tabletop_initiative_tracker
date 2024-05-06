import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import InitiativeList from './components/InitiativeList/InitiativeList'
import ControlBox from './components/ControlBox/ControlBox'
import RoundCounter from './components/RoundCounter/RoundCounter'
import { Character } from './utils/interface'

export default function App(): JSX.Element {
  const [initiativeQueue, setInitiativeQueue] = useState<Character[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState<number>(1);
  const [currentCharacterNumber, setCurrentCharacterNumber] = useState<number| undefined>();

  // useEffect(()=>{
  //   console.log(localStorage.getItem('oldInitiative'));

  //   if(localStorage.getItem('oldInitiative')){
  //     console.log(localStorage.getItem('oldInitiative'));
  //   }
  // },[]);

  useEffect(()=>{
    console.log('new Initiative Queue: ', initiativeQueue);
  }, [initiativeQueue]);

  function continueAlongInitiative(): void {
    console.log('Next button was clicked!');
    console.log('initiatives: ', initiativeQueue);
  }

  function addNewCharacterToQueue(): void {
    const temp = initiativeQueue;
    temp.push({name:'Insert name', position: temp.length+1, initiativeScore: 0});

    setInitiativeQueue([...temp]);
  }

  function removeCharacterFromQueue(): void {
    console.log('removing character from queue!');
  }

  function changeQueuePosition(){
    console.log('Changes queue position.');
  }

  return (
    <div className='app'>
        <Header />
        <div className='content'><InitiativeList initiativeQueue={initiativeQueue}/> <div className='controlSection'>
              <RoundCounter currentRound={currentRoundNumber}/>
              <ControlBox continueInitiativeQueue={continueAlongInitiative}
              addNewCharacter={addNewCharacterToQueue}/>
            </div>
          </div>
        <Footer />
    </div>
  )
}