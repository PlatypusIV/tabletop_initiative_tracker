import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import InitiativeList from './components/InitiativeList/InitiativeList'
import ControlBox from './components/ControlBox/ControlBox'
import RoundCounter from './components/RoundCounter/RoundCounter'

export default function App(): JSX.Element {
  const [initiativeQueue, setInitiativeQueue] = useState([]); 


  function continueAlongInitiative(): void {
    console.log('Next button was clicked!');
  }

  function addNewCharacterToQueue(): void {
    console.log('Adding new character to queue!');
  }

  return (
    <div className='app'>
        <Header />
        <div className='content'><InitiativeList /> <div className='controlSection'>
              <RoundCounter />
              <ControlBox continueInitiativeQueue={continueAlongInitiative}
              addNewCharacter={addNewCharacterToQueue}/>
            </div>
          </div>
        <Footer />
    </div>
  )
}