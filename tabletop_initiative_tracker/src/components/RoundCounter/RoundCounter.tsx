import React from 'react';
import './RoundCounter.css';

interface Props {
  currentRound: number; 
}

export default function RoundCounter(props:Props):JSX.Element {
  return (
    <h1 className='roundCounterTitle'>{props.currentRound}</h1>
  )
}
