import React from 'react';
import './CharacterEditModal.css';
import { Character } from '../../utils/interface';

interface Props {
    isOpen: boolean;
    characterToEdit: Character;
}

export default function CharacterEditModal(props: Props) {
    const [isOpen, characterToEdit] = props;  
  return (
    <div>CharacterEditModal</div>
  )
}
