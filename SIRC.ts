import { Decoder, IrdaCmd, Pulse, TimeEq } from "./Decoder-if";



export class SIRCDecoder implements Decoder{
    Decode(pulse: Pulse[]): IrdaCmd {
        if (!pulse || pulse.length < 13){
            return null;
        }
        if ( !TimeEq(pulse[0].high, 2400) || !TimeEq(pulse[0].low, 600) ){
            return null;
        }
        let bits = [];
        try {
            for (let n = 1; n<pulse.length; n++){
                let p = pulse[n];
                let b = -1;
                if ( TimeEq(p.high, 1200) ){
                    b = 1;
                }else if ( TimeEq(p.high, 600) ){
                    b = 0;
                }else{
                    throw "Not valid SIRC high pulse with: "+p.high;
                }
                if ( TimeEq(p.low, 600) ){
                    bits.push(b);
                    continue;
                }
                if (p.low < 600){
                    throw "Not valid SIRC low pulse with: "+p.low;
                }
                if (p.low > 9000){//end bit
                    bits.push(b);
                    break;
                }
                throw "Not valid SIRC finish low pulse with: "+p.low;
            }
        }catch (e){
            console.log("SIRC Get bits fail", e);
            return null;
        }

        function bit2val(bits: number[]){
            let val = 0;
            for (let i=0; i<bits.length; i++){
                val |= bits[i] << i;
            }
            return val;
        }
        if (bits.length == 12){
            return {
                protocol: "SIRC12",
                param:{
                    val: bit2val(bits),
                    command: bit2val(bits.slice(0, 7)),
                    address: bit2val(bits.slice(7, 12)),
                }
            };
        }
        if (bits.length == 15){
            return {
                protocol: "SIRC15",
                param:{
                    val: bit2val(bits),
                    command: bit2val(bits.slice(0, 7)),
                    address: bit2val(bits.slice(7, 15)),
                }
            };
        }
        if (bits.length == 20){
            return {
                protocol: "SIRC20",
                param:{
                    val: bit2val(bits),
                    command: bit2val(bits.slice(0, 7)),
                    address: bit2val(bits.slice(7, 12)),
                    extend: bit2val(bits.slice(12, 20)),
                }
            };
        }
        console.log("Invalid SIRC command bit count: "+bits.length);
        return null;
    }
}
