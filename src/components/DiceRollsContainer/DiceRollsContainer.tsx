import './DiceRollsContainer.css';
import {useEffect, useState} from 'react';

export default function DiceRollsContainer(): JSX.Element {
  const [currentDice, setCurrentDice] = useState(0);
  const [currentDiceCount, setCurrentDiceCount] = useState(0);


  useEffect(()=>{
    console.log('currentDice: ', currentDice);
  },[currentDice]);

  useEffect(()=>{
    console.log('currentDiceCount: ', currentDiceCount);
  },[currentDiceCount]);

  function rollDice(){
    console.log(`You rolled a d${currentDice} ${currentDiceCount} times`);
  }

  return (
    <div className="diceRollsContainer" >
      <div className='diceInputContainer'>
        <table>
          <tbody>
            <tr>
              <td><input type="number" className='diceRollingNumberInput' onChange={(e)=>setCurrentDiceCount(parseInt(e.target.value))}/></td>
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
              <td><button onClick={rollDice}>Roll</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
