import React from 'react';
import './ControlBox.css';

interface Props {
  addNewCharacter : () => void;
  continueInitiativeQueue : () => void;
  resetInitiativeQueue : () => void;
}

//add confirmation prompt for reset
export default function ControlBox(props: Props) {
  return (
    <div className='controlBox'>
      <button onClick={props.continueInitiativeQueue}>Next</button>
      <button onClick={props.addNewCharacter}>Add character</button>
      
      <button onClick={props.resetInitiativeQueue}>Reset initiative</button>
    </div>
  )
}
