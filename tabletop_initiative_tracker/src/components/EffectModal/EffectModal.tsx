import React, { useState } from 'react'
import './EffectModal.css';
import Modal from 'react-modal';
import { Character, Effect } from '../../utils/interface';


interface Props{
    isOpen: boolean;
    name?: string;
    duration?: number;
    effectList?: Effect[];
    characterList?: Character[];
    closeModal: ()=> void;
    createNewEffect: (newEffect: Partial<Effect>) => void;
    applyEffects:(effectsToSet: Partial<Effect>[], characterPositionList: number[])=> void;
    deleteEffect:(effectPosition:number)=>void;
}

export default function EffectModal(props: Props) {
    const {effectList, createNewEffect, characterList, applyEffects} = props;
    const [name, setName] = useState('');
    const [duration, setDuration] = useState<number | undefined>();
    const [damagePerRound, setDamagePerRound] = useState<number | undefined>();
    const [charactersToEffect, setCharactersToEffect] = useState<Record<number, boolean>>({});
    const [effectsToApply, setEffectsToApply] = useState<Record<number, Effect>>({});

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

    function changeEffectsToApply(toApply: boolean, effectIndex:number, effect: Effect){
      const temp = effectsToApply;
      toApply?  temp[effectIndex]= effect : delete temp[effectIndex];
      setEffectsToApply({...temp});
    }

    function editExistingEffect(position:number, ){

    }

    function applyEffectsToCharacters(){
      console.log('charactersToEffect: ', charactersToEffect);
      console.log('effectsToApply: ', effectsToApply);
    }

    //will delete effect from list
    function removeEffect(position: number){
      console.log('effect to remove: ', position);
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
              {effectList?.map((effect, index)=>(<li key={index} className='effectListItem'>
                  <label htmlFor={`effect${index}`}>{effect.name}<input type="checkbox" id={`effect${index}`} onChange={(e)=> changeEffectsToApply(e.target.checked, index, effect)}/>
                  </label>
                  <input type="text" placeholder={effect.duration.toString() || 'enter duration'}/>
                  <button>Remove</button>
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

