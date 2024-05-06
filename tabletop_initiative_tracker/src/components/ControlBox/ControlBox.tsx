import React from 'react';
import './ControlBox.css';

interface Props {
  addNewCharacter : () => void;
  continueInitiativeQueue : () => void;
}


export default function ControlBox({addNewCharacter, continueInitiativeQueue}: Props) {
  return (
    <div className='controlBox'>
      <button onClick={continueInitiativeQueue}>Next</button>
      <button onClick={addNewCharacter}>Add character</button>
    </div>
  )
}
