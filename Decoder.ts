import { NECDecoder } from "./NECDecoder";
import { DecodePulseSequence } from "./Decoder-if";

let necDecode: NECDecoder = new NECDecoder();

export function doDecode(lines: string[]){
    if (lines && lines.length > 0){
        let pulse = DecodePulseSequence(lines);
        if (pulse && pulse.length > 0){
            // console.log(JSON.stringify(pulse, null, ' '));
            let cmd = necDecode.Decode(pulse);
            if (cmd){
                console.log("cmd: ", JSON.stringify(cmd, null, ' '));
            }else{
                console.log("unknown cmd: ",JSON.stringify(pulse, null, ' '));
            }
        }
    }
}
