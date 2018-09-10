import { NECDecoder } from "./NECDecoder";
import { DecodePulseSequence, IrdaCmd } from "./Decoder-if";
import { SIRCDecoder } from "./SIRC";

let necDecode: NECDecoder = new NECDecoder();
let sircDecode: SIRCDecoder = new SIRCDecoder();

export function doDecode(lines: string[]): IrdaCmd{
    if (lines && lines.length > 0){
        let pulse = DecodePulseSequence(lines);
        if (pulse && pulse.length > 0){
            // console.log(JSON.stringify(pulse, null, ' '));
            let cmd = necDecode.Decode(pulse);
            if (cmd){
                console.log("cmd: ", JSON.stringify(cmd, null, ' '));
                return cmd;
            }
            cmd = sircDecode.Decode(pulse);
            if (cmd){
                console.log("cmd: ", JSON.stringify(cmd, null, ' '));
                return cmd;
            }

            console.log("unknown cmd: ",JSON.stringify(pulse, null, ' '));
        }
    }
    return null;
}
