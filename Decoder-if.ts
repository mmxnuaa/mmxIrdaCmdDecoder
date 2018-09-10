
export interface NECParam{
    address: number;
    command: number;
}
export interface SIRCParam{
    val: number;
    address: number;
    command: number;
    extend?: number;
}

export interface IrdaCmd{
    protocol: string;
    param: NECParam | SIRCParam;
}

export interface Pulse{
    high: number;
    low: number;
}

export interface Decoder{
    Decode(pulse: Pulse[]): IrdaCmd;
}

const CARRIER_FREQ = 38; //Unit: Khz
const CARRIER_PERIOD = 1000/CARRIER_FREQ; //Unit: us

export function DecodePulseSequence(pulse: string[]): Pulse[]{
    let result: Pulse[] = [];
    let p: Pulse = null;
    try{
        pulse.forEach(s=>{
            let toks = s.split(/\s*[:|,]\s*/);
            let val = null;
            let up = false;
            if (toks[0] == "IrdaSigHigh"){
                val = parseInt(toks[1]);
                up = true;
            }else if (toks[0] == "IrdaSigLow"){
                val = parseInt(toks[1]);
            }else {
                return;
            }
            if (isNaN(val)){
                throw "Got no number in IrdaSigHigh/IrdaSigLow field";
            }
            val = Math.floor(val * CARRIER_PERIOD);
            if (up){
               p = {
                   high: val,
                   low: null
               }
            }else if (p){
                p.low = val;
                result.push(p);
                p = null;
            }
        });
    }catch (e){
        console.log("parse pulse error: ", e);
        return null;
    }

    return result;
}

export function TimeEq(t: number, exp: number):boolean{
    let tolerance = exp * 0.1;
    let max = exp * 0.4;
    if (tolerance < 100){
        tolerance = 100;
    }
    if (tolerance > max){
        tolerance = max;
    }
    return t > (exp - tolerance) && t < (exp + tolerance);
}