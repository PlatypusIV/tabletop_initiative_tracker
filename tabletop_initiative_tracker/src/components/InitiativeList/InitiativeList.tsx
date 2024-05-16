import React from 'react';
import CharacterContainer from '../CharacterContainer/CharacterContainer';
import './InitiativeList.css';
import { Character } from '../../utils/interface';

interface Props {
  initiativeQueue: Character[];
  currentlyActiveCharacter: number;
  removeCharacter: (position: number) => void;
  editCharacter: (position:number) => void;
  changeCharacterPosition: (position: number, change: "+"| "-")=>void;
}

export default function InitiativeList(props: Props): JSX.Element {
  const {initiativeQueue} = props;

  return (
    <div className='initiativeList'>{initiativeQueue.map(character=>{
      return <CharacterContainer
        character={character}
        removeCharacter={props.removeCharacter}
        editCharacter={props.editCharacter}
        changeCharacterPosition={props.changeCharacterPosition}
        currentlyActiveCharacter={props.currentlyActiveCharacter}
        key={character.position}
        />
    })
    }</div>
  )
}
