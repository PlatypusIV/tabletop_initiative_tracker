import './DiceRollsContainer.css';
import {useEffect, useState} from 'react';

interface DiceRollLog {
  total: number;
  separateValues: number[];
  originalFormula: string;
}

export default function DiceRollsContainer(): JSX.Element {
  const [diceRollsLog, setDiceRollsLog] = useState<DiceRollLog[]>([]);
  const [diceFormula, setDiceFormula] = useState<string>('');


  useEffect(()=>{
    console.log('diceFormula: ', diceFormula);
  },[diceFormula]);


  //clean this up
  useEffect(()=>{
    if(diceRollsLog.length > 10){
      diceRollsLog.shift()
      setDiceRollsLog([...diceRollsLog]);
    }
  },[diceRollsLog]);


  //TODO: separate validation from rollDice
  function rollDice(): void{
    if(!diceFormula)return;

    const tempDiceRoll: DiceRollLog = {total:0, separateValues:[], originalFormula: ''};

    const mathOperatorSeparator = /[+-]/g;
    const mathOperators = diceFormula.match(/[-+]/g);


    const diceCombos = [...diceFormula.replace(' ','').toLowerCase().split(mathOperatorSeparator)];

    const results:number[] = [];

    for(let i = 0;i<diceCombos.length;i++){
      const combo = diceCombos[i];
      // if(/[^\d{1,3},d?,\d]/g.test(combo)) return;
      if(/[d*]/g.test(combo)){
        const elementsInCombo = combo.split('d');
        const amountOfDiceToRoll = parseInt(elementsInCombo[0]);
        const diceToRoll = parseInt(elementsInCombo[1]);
        if(isNaN(amountOfDiceToRoll) || isNaN(diceToRoll) || amountOfDiceToRoll <1 || diceToRoll < 2) throw new Error('Incorrect input!');

        let roll = 0;
        for(let j = 0; j <amountOfDiceToRoll; j++){
          roll += Math.floor(Math.random()*diceToRoll)+1;
        }
        console.log('roll: ', roll);
        results.push(roll);
      }else{
        results.push(parseInt(combo));
      }
    }

    tempDiceRoll.total = results[0];
    mathOperators?.forEach((operator, i) => {
      operator === '+' ? tempDiceRoll.total+= results[i+1] : tempDiceRoll.total-= results[i+1]
    });
    tempDiceRoll.separateValues= [...results];
    tempDiceRoll.originalFormula = diceFormula;

    console.log('diceRoll: ', JSON.stringify(tempDiceRoll));
    setDiceRollsLog([...diceRollsLog, tempDiceRoll]);
  }

  function renderDiceLogs(){
    return diceRollsLog.map((diceRollLog, index)=>{return<li key={index}>{diceRollLog.total}</li>});
  }

  return (
    <div className="diceRollsContainer" >
      <div className='diceRollsLogContainer'>
        <ul>
          {renderDiceLogs()}
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
