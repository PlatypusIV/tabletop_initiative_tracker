import './RoundCounter.css';

interface Props {
  currentRound: number; 
}

export default function RoundCounter(props:Props):React.JSX.Element {
  return (
    <h1 className='roundCounterTitle'>Round: {props.currentRound}</h1>
  )
}
