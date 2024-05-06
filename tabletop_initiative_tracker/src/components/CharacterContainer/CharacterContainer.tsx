import React from 'react';
import './CharacterContainer.css';

interface Props{
    name: string;
    initiativePosition: number;
    initiativeScore?: number;
}


export default function CharacterContainer(props:Props):JSX.Element {
    const {name, initiativePosition, initiativeScore} = props;
  return (
    <div><h3>{name}</h3></div>
  )
}
