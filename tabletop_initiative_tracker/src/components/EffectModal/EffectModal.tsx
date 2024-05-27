import React, { useState } from 'react'
import './EffectModal.css';
import Modal from 'react-modal';
import { Character, Effect } from '../../utils/interface';


interface Props{
    isOpen: boolean;
    name?: string;
    duration?: number;
    effectList: Record<string,Effect>;
    characterList?: Character[];
    closeModal: ()=> void;
    createNewEffect: (newEffect: Effect) => void;
    applyEffects:(effectIdList: string[], characterPositionList: string[])=> void;
    editExistingEffect: (effectId: string, changedEffect: Effect) => void;
    deleteEffect:(effectId: string)=>void;
}

export default function EffectModal(props: Props) {
    const {effectList, createNewEffect, characterList, applyEffects, deleteEffect, editExistingEffect} = props;
    const [name, setName] = useState('');
    const [duration, setDuration] = useState<number | undefined>();
    const [damagePerRound, setDamagePerRound] = useState<number | undefined>();
    const [charactersToEffect, setCharactersToEffect] = useState<Record<number, boolean>>({});
    const [effectsToApply, setEffectsToApply] = useState<Record<string, boolean>>({});

    useState(()=>{
      console.log('charas effected: ', charactersToEffect);
    },[charactersToEffect]);

    useState(()=>{
      console.log('effectsToApply: ', effectsToApply);
    },[effectsToApply]);

    //update with reusable error handling
    function onFieldValueChange(key: string, newDuration: string){
        const newValueParsed = parseInt(newDuration);
        if(isNaN(newValueParsed)) return;
        switch(key){
          case 'duration':
            setDuration(newValueParsed);
            break;
          case 'damagePerRound':
            setDamagePerRound(newValueParsed);
            break;
          default:
            break;
        }
        
    }

    function onEffectValueChange(effectId: string, newDuration: string){
      const parsedDuration = parseInt(newDuration);
      if(isNaN(parsedDuration)) return;
      editExistingEffect(effectId, {...effectList[effectId], duration: parsedDuration});
    }

    function createEffect(){
      if(!name)return;
      createNewEffect({name, duration, damagePerRound});
      clearEffectFields();
    }

    function clearEffectFields(){
      setName('');
      setDuration(undefined);
      setDamagePerRound(undefined);
    }

    function setAffectedCharacters(isAffected: boolean, position: number){
      const temp = charactersToEffect;
      isAffected?  temp[position]= true : delete temp[position];
      setCharactersToEffect({...temp});
    }

    function changeEffectsToApply(toApply: boolean, effectId: string){
      const temp = effectsToApply;
      toApply?  temp[effectId]= true : delete temp[effectId];
      setEffectsToApply({...temp});
    }

    function applyEffectsToCharacters(){
      applyEffects(Object.keys(effectsToApply),Object.keys(charactersToEffect));
    }

    function removeEffect(effectId: string){
      deleteEffect(effectId);
    }

  return (
    <Modal isOpen={props.isOpen} className='effectModal'>
      <div className='closeButtonContainer'>
        <button onClick={()=>props.closeModal()}>Close modal</button>
      </div>
      <div className='effectModalContent'>
        <div className='effectEditContainer'>
          <div>
            <label htmlFor="nameInput">Name:</label>
            <input id='nameInput' type='text' placeholder='Insert name' onChange={(e)=> setName(e.target.value)} value={name}/>
          </div>
          <div>
            <label htmlFor="durationInput">Default duration: </label>
            <input type="number" name="durationInput" id="durationInput" placeholder='Can be left empty' onChange={(e)=>onFieldValueChange('duration' ,e.target.value)}/>
          </div>
          <div>
            <label htmlFor="damagePerRoundInput">Damage/round: </label>
            <input type="number" name="damagePerRoundInput" id="damagePerRoundInput" placeholder='Can be left empty' onChange={(e)=>onFieldValueChange('damagePerRound' ,e.target.value)}/>
          </div>
          <button onClick={createEffect}>{props.name=== '' ? 'Add new Effect' : 'Save effect'}</button>
        </div>
        <div className='existingEffectsContainer'>
            <ul>
              {Object.keys(effectList)?.map((effectId)=>(<li key={effectId} className='effectListItem'>
                  <label htmlFor={effectId}>{effectList[effectId].name}<input type="checkbox" id={effectId} onChange={(e)=> changeEffectsToApply(e.target.checked, effectId)}/>
                  </label>
                  <input type="text" placeholder={effectList[effectId].duration?.toString() || 'enter duration'} className='effectDurationInput' onChange={(e)=>onEffectValueChange(effectId, e.target.value)}/>
                  <button onClick={()=>removeEffect(effectId)}>Remove</button>
              </li>))}
            </ul>
        </div>
        <div className='characterContainerContainer'>
            <ul>{characterList?.map((character)=>(<li key={character.position} className='characterListItem'>
              <label htmlFor="">{character.name}</label>
                <input id={character.position.toString()} type='checkbox' name={character.name} value={character.position} onChange={(e)=>setAffectedCharacters(e.target.checked, character.position)}/>
              </li>))}
            </ul>
        </div>
      </div>
      <button onClick={applyEffectsToCharacters}>Apply effect</button>
    </Modal>
    )
}

