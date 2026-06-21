import { useEffect, useState } from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearCharacterEdit, setSavedCharacterCollection } from '../../state/store';
import { getAllSavedCharactersFromStorage, deleteSavedCharacterFromStorage, evaluateDiceFormula } from '../../utils/utility';

interface Props {
    isOpen: boolean;
    closeModal: ()=> void;
    saveCharacterChanges: (character:Character)=> void;
    addCharacters: (characters: Character[])=> void;
}

const MAX_COUNT = 50;
const DEFAULT_DEFENSE = 'ac: 0, ff: 0, t: 0';

export default function CharacterEditModal(props: Props):React.JSX.Element {
  const dispatch = useDispatch();
  const characterToEdit = useSelector((state: RootState)=> state.characterBeingEdited.characterBeingEdited);
  const savedCharacterCollection = useSelector((state: RootState) => state.savedCharactersCollection.savedCharactersCollection);
  const [name,setName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // HP and initiative are free text: either a flat integer or a dice formula (e.g. 2d8+2).
  const [hitpoints,setHitpoints] = useState<string>('');
  const [initiativeScore,setInitiativeScore] = useState<string>('');
  const [defense,setDefense] = useState<string>(DEFAULT_DEFENSE);
  const [count,setCount] = useState<number>(1);
  const [error,setError] = useState<string>('');

  const isAddMode = characterToEdit.name === '';

  useEffect(()=>{
    dispatch(setSavedCharacterCollection(getAllSavedCharactersFromStorage()));
  },[props.isOpen]);

  // Seed the form from the character being edited when the modal opens in edit mode.
  useEffect(()=>{
    if(!props.isOpen) return;
    if(characterToEdit.name === '') return;
    setName(characterToEdit.name);
    setHitpoints(characterToEdit.hitpoints?.toString() ?? '');
    setInitiativeScore(characterToEdit.initiativeScore?.toString() ?? '');
    setDefense(characterToEdit.defense ?? DEFAULT_DEFENSE);
  },[props.isOpen, characterToEdit]);

  function onCountChange(newCount: string){
    const parsed = parseInt(newCount);
    if(isNaN(parsed)){ setCount(1); return; }
    setCount(Math.min(MAX_COUNT, Math.max(1, parsed)));
  }

  function onDefenseChange(newDefense: string) {
    setDefense(newDefense);
  }

  // Adds N copies of the creature. Flat numbers are identical across copies;
  // formulas are rolled independently per creature.
  function submitAdd(): boolean {
    const resolvedName = name.trim();
    if(!resolvedName){ setError('Name is required.'); return false; }
    // Blank HP/initiative are allowed and stored as undefined ("unknown, fill in later").
    // Only non-blank values are validated as a number or dice formula.
    const hpBlank = hitpoints.trim() === '';
    const initBlank = initiativeScore.trim() === '';
    if(!hpBlank && evaluateDiceFormula(hitpoints) === null){
      setError('Hitpoints must be a whole number or a dice formula (e.g. 2d8+2).');
      return false;
    }
    if(!initBlank && evaluateDiceFormula(initiativeScore) === null){
      setError('Initiative must be a whole number or a dice formula (e.g. 1d20+3).');
      return false;
    }

    const characters: Character[] = [];
    for(let i = 0; i < count; i++){
      // Formulas roll independently per copy; blank stays undefined for every copy.
      const hp = hpBlank ? undefined : evaluateDiceFormula(hitpoints)!.total;
      const initiative = initBlank ? undefined : evaluateDiceFormula(initiativeScore)!.total;
      characters.push({
        ...characterToEdit,
        name: resolvedName,
        hitpoints: hp,
        baseHitpoints: hp,
        initiativeScore: initiative,
        defense,
        position: 0, // assigned by the queue on insert
      });
    }
    props.addCharacters(characters);
    setError('');
    return true;
  }

  function submitEdit(): boolean {
    if(!name && !characterToEdit.name){ setError('Name is required.'); return false; }

    let hp = characterToEdit.hitpoints;
    if(hitpoints){
      const result = evaluateDiceFormula(hitpoints);
      if(result === null){
        setError('Hitpoints must be a whole number or a dice formula (e.g. 2d8+2).');
        return false;
      }
      hp = result.total;
    }

    let initiative = characterToEdit.initiativeScore;
    if(initiativeScore){
      const result = evaluateDiceFormula(initiativeScore);
      if(result === null){
        setError('Initiative must be a whole number or a dice formula (e.g. 1d20+3).');
        return false;
      }
      initiative = result.total;
    }

    props.saveCharacterChanges({
      ...characterToEdit,
      name: name || characterToEdit.name,
      hitpoints: hp,
      initiativeScore: initiative,
      defense: defense || characterToEdit.defense,
    });
    setError('');
    return true;
  }

  function saveCharacter(){
    const ok = isAddMode ? submitAdd() : submitEdit();
    if(ok) clearModal();
  }

  function saveCharacterAndClose(){
    const ok = isAddMode ? submitAdd() : submitEdit();
    if(ok){
      props.closeModal();
      clearModal();
    }
  }

  function clearModal(){
    dispatch(clearCharacterEdit());
    setName('');
    setHitpoints('');
    setInitiativeScore('');
    setDefense(DEFAULT_DEFENSE);
    setCount(1);
    setError('');
  }

  function onSearchSavedCharacterInputChange(newSearchTerm:string){
    setSearchTerm(newSearchTerm);
  }

  function onAddSavedCharacter(chara: Character){
    props.addCharacters([structuredClone(chara)]);
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
      <td className='savedCharacterStatCell'><span>Hp {chara.hitpoints ?? '—'}</span><span>Init {chara.initiativeScore ?? '—'}</span></td>
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
          <h3>{isAddMode ? 'Add character' : 'Edit character'}</h3>
        </div>
        <table className='characterEditTable'>
          <tbody>
            <tr>
              <td><label htmlFor="nameInput">Name:</label></td>

            <td>
              <input className='characterEditInput' id='nameInput' type='text' placeholder='Insert name' onChange={(e)=> setName(e.target.value)} value={name}/>
            </td>
            </tr>
            <tr>
              <td><label htmlFor="hitpointInput">Hitpoints: </label></td>
              <td><input className='characterEditInput' type="text" name="hitpointInput" id="hitpointInput" placeholder='e.g. 12 or 2d8+2' onChange={(e)=>setHitpoints(e.target.value)} value={hitpoints}/></td>
            </tr>
            <tr>
              <td><label htmlFor="initiativeScoreInput">Initiative score: </label></td>
              <td><input className='characterEditInput' type="text" name="initiativeScoreInput" id="initiativeScoreInput" placeholder='e.g. 15 or 1d20+3' onChange={(e)=>setInitiativeScore(e.target.value)} value={initiativeScore}/>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="defenseInput">Defense: </label></td>
              <td><input className='characterEditInput' type="text" name="defenseInput" id="defenseInput" placeholder={characterToEdit.defense?.toString() || DEFAULT_DEFENSE} onChange={(e)=>onDefenseChange(e.target.value)} value={defense}/>
              </td>
            </tr>
            {isAddMode && (
            <tr>
              <td><label htmlFor="countInput">Count: </label></td>
              <td><input className='characterEditInput' type="number" name="countInput" id="countInput" min={1} max={MAX_COUNT} onChange={(e)=>onCountChange(e.target.value)} value={count}/>
              </td>
            </tr>
            )}
          </tbody>
        </table>
      {error && <p className='characterEditError'>{error}</p>}
      <div className='characterEditButtonRow'>
        <button onClick={saveCharacter} className='characterEditConfirmButton'>{isAddMode ? 'Add character' : 'Save changes'}</button>
        <button onClick={saveCharacterAndClose} className='characterEditConfirmButton'>{isAddMode ? 'Save and exit' : 'Save changes and close'}</button>
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
