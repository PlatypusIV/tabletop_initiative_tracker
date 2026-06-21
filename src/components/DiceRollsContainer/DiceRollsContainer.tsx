import './DiceRollsContainer.css';
import {useEffect, useRef, useState} from 'react';
import { evaluateDiceFormula } from '../../utils/utility';

interface DiceRollLog {
  total: number;
  separateValues: number[];
  originalFormula: string;
}

// Most recent rolls kept in the log; the newest are shown first and older ones
// fall off the bottom (the log area clips overflow, no scrollbar).
const MAX_DICE_LOG = 20;

export default function DiceRollsContainer():React.JSX.Element {
  const [diceRollsLog, setDiceRollsLog] = useState<DiceRollLog[]>([]);
  const [diceFormula, setDiceFormula] = useState<string>('');
  const newestRollRef = useRef<HTMLLIElement>(null);

  // Bring the newest roll into view when a result is added. 'nearest' makes this a
  // no-op on desktop (newest already sits at the top) while scrolling the mobile
  // log down to the newest result at the bottom.
  useEffect(()=>{
    newestRollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  },[diceRollsLog]);

  function rollDice(): void{
    if(!diceFormula)return;

    const result = evaluateDiceFormula(diceFormula);
    if(!result){
      window.alert('Incorrect input!');
      return;
    }

    const tempDiceRoll: DiceRollLog = {
      total: result.total,
      separateValues: result.separateValues,
      originalFormula: diceFormula,
    };

    const tempRollLogs = diceRollsLog;
    if(tempRollLogs.length >= MAX_DICE_LOG){
      tempRollLogs.shift();
    }
    setDiceRollsLog([...tempRollLogs, tempDiceRoll]);
  }

  function cleanLogs(){
    setDiceRollsLog([]);
  }

  function renderDiceLogs(){
    return diceRollsLog.map((diceRollLog, index)=>{
      const isNewest = index === diceRollsLog.length - 1;
      return <li key={index} ref={isNewest ? newestRollRef : undefined} className='diceRollListElement'><p>Result: {diceRollLog.total}</p></li>;
    });
  }

  return (
    <div className="diceRollsContainer" >
      <div className='diceRollsLogContainer'>
        <ol reversed>
          {renderDiceLogs()}
        </ol>
      </div>
      <div className='diceInputContainer'>
      <button onClick={cleanLogs} className='diceRollsClearLogsButton'>Clear logs</button>
      <textarea name="diceRollsInput" id="diceRollsInput" onChange={(e)=>setDiceFormula(e.target.value)} className='diceRollingNumberInput'/>
        <button onClick={rollDice} className='diceRollsRollButton'>Roll</button>
      </div>
    </div>
  )
}
