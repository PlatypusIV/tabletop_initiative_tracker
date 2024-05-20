import React, { useState } from 'react'
import './EffectModal.css';
import Modal from 'react-modal';
import { Effect } from '../../utils/interface';


interface Props{
    isOpen: boolean;
    name?: string;
    duration?: number;
    closeModal: ()=> void;
    createNewEffect: (newEffect: Partial<Effect>) => void;
}

export default function EffectModal(props: Props) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(0);
    const [damagePerRound, setDamagePerRound] = useState(0);

    //update with reusable error handling
    function onFieldValueChange(key: string, newDuration: string){
        const newValueParsed = parseInt(newDuration);
        if(isNaN(newValueParsed)) return;
        switch(key){
          case 'duration':
          setDuration(newValueParsed);
          break;
        }
        ;
    }

    function saveEffect(){
      if(!name)return;

    }

  return (
    <Modal isOpen={props.isOpen} className='effectModal'>
      <div>
        <button onClick={()=>props.closeModal()}>Close modal</button>
      </div>
      <div>
        <label htmlFor="nameInput">Name:</label>
        <input id='nameInput' type='text' placeholder={props.name || 'Insert name'} onChange={(e)=> setName(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="durationInput">Default duration: </label>
        <input type="number" name="durationInput" id="durationInput" placeholder='Can be left empty' onChange={(e)=>onFieldValueChange('duration' ,e.target.value)}/>
      </div>
      <div>
        <label htmlFor="damagePerRoundInput">Damage/round: </label>
        <input type="number" name="damagePerRoundInput" id="damagePerRoundInput" placeholder='Can be left empty' onChange={(e)=>onFieldValueChange('damagePerRound' ,e.target.value)}/>
      </div>
      <button onClick={saveEffect}>{props.name=== '' ? 'Add new Effect' : 'Save effect'}</button>
    </Modal>
    )
}

