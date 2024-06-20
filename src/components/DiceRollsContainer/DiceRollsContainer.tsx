import './DiceRollsContainer.css';
import {useEffect, useState} from 'react';

interface DiceRollLog {
  total: number;
  separateValues: number[];
}

export default function DiceRollsContainer(): JSX.Element {
  const [currentDice, setCurrentDice] = useState(20);
  const [currentDiceCount, setCurrentDiceCount] = useState(0);
  const [diceRollsLog, setDiceRollsLog] = useState<DiceRollLog[]>([]);
  const [diceFormula, setDiceFormula] = useState<string>('');

  function validateDiceInput(diceCountInput:string): void{
    //separate by math numbers
    //separate dice combos

    const mathOperatorSeparator = /[+-]/g;

    const diceCombos = [];
    const mathOperators = [];
  }

  function rollDice(): void{
    if(!currentDice)return;
    if(!currentDiceCount)return;

    const tempDiceRoll: DiceRollLog = {total:0, separateValues:[]};
    for(let i = 0;i<currentDiceCount;i++){
      console.log(`You rolled a ${Math.floor(Math.random()*currentDice+1)}`);
      tempDiceRoll
    }
    console.log(`You rolled a d${currentDice} ${currentDiceCount} times`);

    // console.log(`You rolled a ${Math.floor(Math.random()*currentDice+1)}`);
  }

  // function renderDiceLogs(){
  //   diceRollsLog.map((diceRollLog, index)=>{return<li key={index}>{diceRollLog}</li>});
  // }

  return (
    <div className="diceRollsContainer" >
      <div className='diceRollsLogContainer'>
        <ul>
          
        </ul>
      </div>
      <div className='diceInputContainer'>
        <textarea name="diceRollsInput" id="diceRollsInput" onChange={(e)=>setDiceFormula(e.target.value)} />
        <button onClick={rollDice}>Roll</button>
        {/* <table>
          <tbody>
            <tr>
              <td><input type="number" className='diceRollingNumberInput' onChange={(e)=>validateDiceInput(e.target.value)}/></td>
              <td><label>D</label></td>
              <td>
                <select defaultValue="20" id='diceSelectorInput' name='dice' onChange={(e)=>setCurrentDice(parseInt(e.target.value))}>
                    <option value="20">20</option>
                    <option value="12">12</option>
                    <option value="10">10</option>
                    <option value="8">8</option>
                    <option value="6">6</option>
                    <option value="4">4</option>
                    <option value="2">2</option>
                    <option value="100">100</option>
                    </select>
                    </td>
              <td></td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  )
}
