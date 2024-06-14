export default function DiceRollsContainer(): JSX.Element {
  return (
    <div style={{color:"white", display:"flex", flexDirection:"column", justifyContent:"space-between", maxHeight:"300px"}} >
                  <textarea name="diceRollingInput" id=""></textarea>
                  <label htmlFor="diceInput"><select value="20" style={{color:"black"}} id='diceSelectorInput' name='dice'>
                    <option value="d20">d20</option>
                    <option value="d12">d12</option>
                    <option value="d10">d10</option>
                    <option value="d8">d8</option>
                    <option value="d6">d6</option>
                    <option value="d4">d4</option>
                    <option value="d2">d2</option>
                    <option value="d100">d100</option>
                    </select>
                    </label>
                    <button>Roll</button>
                </div>
  )
}
