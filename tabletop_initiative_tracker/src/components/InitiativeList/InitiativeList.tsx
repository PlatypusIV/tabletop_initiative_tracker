import React from 'react';
import CharacterContainer from '../CharacterContainer/CharacterContainer';
import './InitiativeList.css';
import { Character } from '../../utils/interface';

interface Props {
  initiativeQueue: Character[];
  removeCharacter: (position: number) => void;
  editCharacter: (position:number) => void;
  changeCharacterPosition: (position: number, change: "+"| "-")=>void;
}

export default function InitiativeList(props: Props): JSX.Element {
  const {initiativeQueue} = props;

  return (
    <div className='initiativeList'>{initiativeQueue.map(character=>{
      return <CharacterContainer 
        name={character.name}
        initiativePosition={character.position}
        initiativeScore={character.initiativeScore}
        removeCharacter={props.removeCharacter}
        editCharacter={props.editCharacter}
        changeCharacterPosition={props.changeCharacterPosition}
        key={character.position}
        />
    })
    }</div>
  )
}
