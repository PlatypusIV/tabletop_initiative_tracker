import React, { useState } from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';
import Modal from 'react-modal';

interface Props {
    isOpen: boolean;
    characterToEdit: Character;
    closeModal: ()=> void;
    saveCharacterChanges: (character:Character)=> void;
    addCharacter: (character: Character)=> void;
}

export default function CharacterEditModal(props: Props) {
  const [name,setName] = useState<string>('');
  const [hitpoints,setHitpoints] = useState(0);

  function onHitpointChange(newHitpoints:string){
    if(isNaN(parseInt(newHitpoints)))return;
    setHitpoints(parseInt(newHitpoints));
  }

  function saveCharacter(){
    if(!name)return;
    if(props.characterToEdit.name ===''){
      props.addCharacter({...props.characterToEdit,name, hitpoints});
    }else{
      props.saveCharacterChanges({...props.characterToEdit,name,hitpoints});
    }
    
    props.closeModal();
    clearModal();
  }

  function clearModal(){
    setName('');
    setHitpoints(0);
  }
  
  return (
    <Modal isOpen={props.isOpen} className='characterEditModal'>
      <div>
        <button onClick={()=>props.closeModal()}>Close modal</button>
      </div>
      <div>
        <label htmlFor="nameInput">Name:</label>
        <input id='nameInput' type='text' placeholder={props.characterToEdit?.name || 'Insert name'} onChange={(e)=> setName(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="hitpointInput">Hitpoints: </label>
        <input type="number" name="hitpointInput" id="hitpointInput" placeholder={props.characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onHitpointChange(e.target.value)}/>
      </div>
      <button onClick={saveCharacter}>{props.characterToEdit.name=== '' ? 'Add new Character' : 'Save changes'}</button>
    </Modal>
  )
}
