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

  const mathOperatorSeparator = /[+-]/g;

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

    const tempRollLogs = diceRollsLog;
    if(tempRollLogs.length >= 6){
      tempRollLogs.shift();
    }
    setDiceRollsLog([...tempRollLogs, tempDiceRoll]);
  }

  function cleanLogs(){
    setDiceRollsLog([]);
  }

  function renderDiceLogs(){
    return diceRollsLog.map((diceRollLog, index)=>{return<li key={index} className='diceRollListElement'><p>Result: {diceRollLog.total}</p></li>});
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
