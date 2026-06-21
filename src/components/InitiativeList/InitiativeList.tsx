import CharacterContainer from '../CharacterContainer/CharacterContainer';
import './InitiativeList.css';
import { Character } from '../../utils/interface';
import { useRef } from 'react';

interface Props {
  initiativeQueue: Character[];
  currentlyActiveCharacter: number;
  removeCharacter: (position: number) => void;
  openCharacterEditor: (position:number) => void;
  editCharacter: (character: Character, position:number) => void;
  changeCharacterPosition: (position: number, change: "+"| "-")=>void;
}

export default function InitiativeList(props: Props):React.JSX.Element {
  const {initiativeQueue} = props;
  const listRef = useRef<HTMLDivElement>(null);

  // The list overflows horizontally (cards wrap into columns), so translate a
  // vertical mouse wheel into horizontal scrolling to make those columns reachable.
  // Skip when the wheel is over a nested vertical scroller (e.g. a card's effects
  // list) so its own scrolling keeps working.
  function onWheel(event: React.WheelEvent<HTMLDivElement>){
    if(event.deltaY === 0) return;
    let node = event.target as HTMLElement | null;
    while(node && node !== listRef.current){
      if(node.scrollHeight > node.clientHeight){
        const overflowY = getComputedStyle(node).overflowY;
        if(overflowY === 'auto' || overflowY === 'scroll') return;
      }
      node = node.parentElement;
    }
    listRef.current?.scrollBy({ left: event.deltaY });
  }

  return (
    <div className='initiativeList' ref={listRef} onWheel={onWheel}>{initiativeQueue.map(character=>{
      return <CharacterContainer
        character={character}
        removeCharacter={props.removeCharacter}
        openCharacterEditor={props.openCharacterEditor}
        changeCharacterPosition={props.changeCharacterPosition}
        currentlyActiveCharacter={props.currentlyActiveCharacter}
        editCharacter={props.editCharacter}
        key={character.position}
        />
    })
    }</div>
  )
}
