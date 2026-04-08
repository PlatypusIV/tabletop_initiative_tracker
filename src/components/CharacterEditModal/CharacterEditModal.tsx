import { useState } from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCharacterEdit } from '../../state/store';

interface Props {
    isOpen: boolean;
    closeModal: ()=> void;
    saveCharacterChanges: (character:Character)=> void;
    addCharacter: (character: Character)=> void;
}

export default function CharacterEditModal(props: Props) {
  const dispatch = useDispatch();
  const characterToEdit = useSelector((state: RootState)=> state.characterBeingEdited.characterBeingEdited);
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
    if(!name && !characterToEdit.name)return;
    if(characterToEdit.name ===''){
      props.addCharacter({...characterToEdit,name, hitpoints, initiativeScore, defense});
    }else{
      props.saveCharacterChanges({...characterToEdit,name: name ||characterToEdit.name ,hitpoints: hitpoints|| characterToEdit.hitpoints ,initiativeScore: initiativeScore || characterToEdit.initiativeScore, defense: defense || characterToEdit.defense});
    }
    clearModal();
    
  }

  function saveCharacterAndClose(){
    if(!name && !characterToEdit.name)return;
    if(characterToEdit.name ===''){
      props.addCharacter({...characterToEdit,name, hitpoints, initiativeScore, defense});
    }else{
      props.saveCharacterChanges({...characterToEdit,name: name ||characterToEdit.name ,hitpoints: hitpoints|| characterToEdit.hitpoints ,initiativeScore: initiativeScore || characterToEdit.initiativeScore, defense: defense || characterToEdit.defense});
    }
    
    props.closeModal();
    clearModal();
  }

  function clearModal(){
    dispatch(clearCharacterEdit());
    setName('');
    setHitpoints(0);
    setInitiativeScore(0);
    setDefense('ac: 0, ff: 0, t: 0');
  }
  
  return (
    <Modal isOpen={props.isOpen} className='characterEditModal'>
      <div className='characterEditCloseContainer'>
        <button onClick={()=>{
          props.closeModal();
          clearModal();
          }} className='characterEditCloseButton'>X</button>
      </div>
      <div className='characterEditContentContainer'>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="nameInput">Name:</label></td>
            
            <td>
              <input id='nameInput' type='text' placeholder={characterToEdit?.name || 'Insert name'} onChange={(e)=> setName(e.target.value)} value={name ||  characterToEdit?.name}/>
            </td>
            </tr>
            <tr>
              <td><label htmlFor="hitpointInput">Hitpoints: </label></td>
              <td><input type="number" name="hitpointInput" id="hitpointInput" placeholder={characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onHitpointChange(e.target.value)} value={hitpoints || characterToEdit.hitpoints}/></td>
            </tr>
            <tr>
              <td><label htmlFor="initiativeScoreInput">Initiative score: </label></td>
              <td><input type="number" name="initiativeScoreInput" id="initiativeScoreInput" placeholder={characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onInitiativeScoreChange(e.target.value)} value={initiativeScore || characterToEdit.initiativeScore}/>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="defenseInput">Defense: </label></td>
              <td><input type="text" name="defenseInput" id="defenseInput" placeholder={characterToEdit.defense?.toString() || 'ac: 0, ff:0, t:0'} onChange={(e)=>onDefenseChange(e.target.value)} value={defense || characterToEdit.defense}/>
              </td>
            </tr>
          </tbody>
        </table>
      <button onClick={saveCharacter} className='characterEditConfirmButton'>{characterToEdit.name=== '' ? 'Add character' : 'Save changes'}</button>
      <button onClick={saveCharacterAndClose} className='characterEditConfirmButton'>{characterToEdit.name=== '' ? 'Save and exit' : 'Save changes and close'}</button>
      </div>
      
    </Modal>
  )
}
