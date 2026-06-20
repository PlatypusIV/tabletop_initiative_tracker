import { useEffect, useState } from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCharacterEdit, setSavedCharacterCollection } from '../../state/store';
import { getAllSavedCharactersFromStorage, deleteSavedCharacterFromStorage } from '../../utils/utility';

interface Props {
    isOpen: boolean;
    closeModal: ()=> void;
    saveCharacterChanges: (character:Character)=> void;
    addCharacter: (character: Character)=> void;
}

export default function CharacterEditModal(props: Props) {
  const dispatch = useDispatch();
  const characterToEdit = useSelector((state: RootState)=> state.characterBeingEdited.characterBeingEdited);
  const savedCharacterCollection = useSelector((state: RootState) => state.savedCharactersCollection.savedCharactersCollection);
  const [name,setName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [hitpoints,setHitpoints] = useState(0);
  const [initiativeScore,setInitiativeScore] = useState(0);
  const [defense,setDefense] = useState<string>('ac: 0, ff: 0, t: 0');

  useEffect(()=>{
    dispatch(setSavedCharacterCollection(getAllSavedCharactersFromStorage()));
  },[props.isOpen]);

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

  function onSearchSavedCharacterInputChange(newSearchTerm:string){
    setSearchTerm(newSearchTerm);
  }

  function onAddSavedCharacter(chara: Character){
    props.addCharacter(structuredClone(chara));
  }

  function onDeleteSavedCharacter(chara: Character){
    if(!window.confirm(`Delete saved character "${chara.name}"?`)) return;
    dispatch(setSavedCharacterCollection(deleteSavedCharacterFromStorage(chara.name)));
  }

  const filteredSavedCharacters = savedCharacterCollection
    .filter(chara=> chara.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));

  function renderSavedCharacterRows(){
    return filteredSavedCharacters.map(chara=>
    <tr key={chara.name} className='savedCharacterRow'>
      <td className='savedCharacterNameCell'><p>{chara.name}</p></td>
      <td className='savedCharacterStatCell'><span>Hp {chara.hitpoints || 0}</span><span>Init {chara.initiativeScore || 0}</span></td>
      <td><button className='savedCharacterAddButton' onClick={()=>onAddSavedCharacter(chara)}>Add</button></td>
      <td><button className='savedCharacterDeleteButton' onClick={()=>onDeleteSavedCharacter(chara)} title={`Delete ${chara.name}`}>✕</button></td>
    </tr>
      );
  }
  
  return (
    <Modal isOpen={props.isOpen} className='characterEditModal'>
      <div className='characterEditCloseContainer'>
        <button onClick={()=>{
          props.closeModal();
          clearModal();
          }} className='characterEditCloseButton'>X</button>
      </div>
      <div className='characterAdditionContainer'>
<div className='characterEditContentContainer'>
        <div className='characterEditHeader'>
          <h3>{characterToEdit.name === '' ? 'Add character' : 'Edit character'}</h3>
        </div>
        <table className='characterEditTable'>
          <tbody>
            <tr>
              <td><label htmlFor="nameInput">Name:</label></td>

            <td>
              <input className='characterEditInput' id='nameInput' type='text' placeholder={characterToEdit?.name || 'Insert name'} onChange={(e)=> setName(e.target.value)} value={name ||  characterToEdit?.name}/>
            </td>
            </tr>
            <tr>
              <td><label htmlFor="hitpointInput">Hitpoints: </label></td>
              <td><input className='characterEditInput' type="number" name="hitpointInput" id="hitpointInput" placeholder={characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onHitpointChange(e.target.value)} value={hitpoints || characterToEdit.hitpoints}/></td>
            </tr>
            <tr>
              <td><label htmlFor="initiativeScoreInput">Initiative score: </label></td>
              <td><input className='characterEditInput' type="number" name="initiativeScoreInput" id="initiativeScoreInput" placeholder={characterToEdit.hitpoints?.toString() || '0'} onChange={(e)=>onInitiativeScoreChange(e.target.value)} value={initiativeScore || characterToEdit.initiativeScore}/>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="defenseInput">Defense: </label></td>
              <td><input className='characterEditInput' type="text" name="defenseInput" id="defenseInput" placeholder={characterToEdit.defense?.toString() || 'ac: 0, ff:0, t:0'} onChange={(e)=>onDefenseChange(e.target.value)} value={defense || characterToEdit.defense}/>
              </td>
            </tr>
          </tbody>
        </table>
      <div className='characterEditButtonRow'>
        <button onClick={saveCharacter} className='characterEditConfirmButton'>{characterToEdit.name=== '' ? 'Add character' : 'Save changes'}</button>
        <button onClick={saveCharacterAndClose} className='characterEditConfirmButton'>{characterToEdit.name=== '' ? 'Save and exit' : 'Save changes and close'}</button>
      </div>
      </div>

      <div className='characterLoadContainer'>
        <div className='savedCharacterHeader'>
          <h3>Saved characters</h3>
          <span className='savedCharacterCount'>{filteredSavedCharacters.length} / {savedCharacterCollection.length}</span>
        </div>
        <div className='searchSavedCharacterDiv'>
          <input
            type="text"
            id="savedCharacterSearch"
            className='savedCharacterSearchInput'
            placeholder='Search by name…'
            value={searchTerm}
            onChange={(e)=>onSearchSavedCharacterInputChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type='button'
              className='savedCharacterSearchClear'
              onClick={()=>onSearchSavedCharacterInputChange('')}
              title='Clear search'
            >✕</button>
          )}
        </div>
        <div className='savedCharacteTableContainer'>
          {savedCharacterCollection.length === 0 ? (
            <p className='savedCharacterEmpty'>No saved characters yet — use Save on a character to add one here.</p>
          ) : filteredSavedCharacters.length === 0 ? (
            <p className='savedCharacterEmpty'>No matches for “{searchTerm}”.</p>
          ) : (
            <table className='savedCharacterTable'>
              <thead>
                <tr><th>Name</th><th>Stats</th><th>Add</th><th>Del</th></tr>
              </thead>
              <tbody>
                {renderSavedCharacterRows()}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
      
      
    </Modal>
  )
}
