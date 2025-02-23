import { useState } from 'react';
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
  const [initiativeScore,setInitiativeScore] = useState(0);
  const [defense,setDefense] = useState<string>('ac: 0, ff: 0, t: 0');

  function onHitpointChange(newHitpoints:string){
    if(isNaN(parseInt(newHitpoints)))return;
    setHitpoints(parseInt(newHitpoints));
  }

  function onInitiativeScoreChange(newInitiativeScore: string){
    if(isNaN(parseInt(newInitiativeScore)))return;
    setInitiativeScore(parseInt(newInitiativeScore));
  }

  function onDefenseChange(newDefense: string) {
    if(defense === null && defense === undefined) return;
    setDefense(newDefense);
  }

  function saveCharacter(){
    if(!name && !props.characterToEdit.name)return;
    if(props.characterToEdit.name ===''){
      props.addCharacter({...props.characterToEdit,name, hitpoints, initiativeScore, defense});
    }else{
      props.saveCharacterChanges({...props.characterToEdit,name: name ||props.characterToEdit.name ,hitpoints: hitpoints|| props.characterToEdit.hitpoints ,initiativeScore: initiativeScore || props.characterToEdit.initiativeScore, defense: defense || props.characterToEdit.defense});
    }
    
    props.closeModal();
    clearModal();
  }

  function clearModal(){
    setName('');
    setHitpoints(0);
    setInitiativeScore(0);
  }
  
  return (
    <Modal isOpen={props.isOpen} className='characterEditModal'>
      <div className='characterEditCloseContainer'>
        <button onClick={()=>props.closeModal()} className='characterEditCloseButton'>X</button>
      </div>
      <div className='characterEditContentContainer'>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="nameInput">Name:</label></td>
            
            <td>
              <input id='nameInput' type='text' placeholder={props.characterToEdit?.name || 'Insert name'} onChange={(e)=> setName(e.target.value)}/>
            </td>
            </tr>
            <tr>
              <td><label htmlFor="hitpointInput">Hitpoints: </label></td>
              <td><input type="number" name="hitpointInput" id="hitpointInput" placeholder={props.characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onHitpointChange(e.target.value)}/></td>
            </tr>
            <tr>
              <td><label htmlFor="initiativeScoreInput">Initiative score: </label></td>
              <td><input type="number" name="initiativeScoreInput" id="initiativeScoreInput" placeholder={props.characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onInitiativeScoreChange(e.target.value)}/>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="defenseInput">Defense: </label></td>
              <td><input type="text" name="defenseInput" id="defenseInput" placeholder={props.characterToEdit.defense?.toString() || 'ac: 0, ff:0, t:0'} onChange={(e)=>onDefenseChange(e.target.value)}/>
              </td>
            </tr>
          </tbody>
        </table>
      <button onClick={saveCharacter} className='characterEditConfirmButton'>{props.characterToEdit.name=== '' ? 'Add new Character' : 'Save changes'}</button>
      </div>
      
    </Modal>
  )
}
