import React, { useState } from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';
import Modal from 'react-modal';

interface Props {
    isOpen: boolean;
    characterToEdit: Character;
    closeModal: ()=> void;
    saveCharacterChanges: (character:Character)=> void;
}

export default function CharacterEditModal(props: Props) {
  const [name,setName] = useState<string>('');


  function saveCharacter(){
    props.saveCharacterChanges({...props.characterToEdit,name});
    props.closeModal();
  }
  
  return (
    <Modal isOpen={props.isOpen}>
      <button onClick={()=>props.closeModal()}>Close modal</button>
      <div>
        <label htmlFor="nameInput">name:</label>
        <input id='nameInput' type='text' placeholder={props.characterToEdit?.name || 'Insert name'} onChange={(e)=> setName(e.target.value)}/>
      <button onClick={()=>saveCharacter()}>Save changes</button>
      </div>
    </Modal>
  )
}
