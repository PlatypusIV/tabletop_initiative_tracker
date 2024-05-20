//make error handling functions here

export function stringIsNumber(stringValue: string){
    const newDurationParsed = parseInt(stringValue);
    if(isNaN(newDurationParsed)) throw new Error('Incorrect value inserted');
}