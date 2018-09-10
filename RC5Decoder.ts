import { Decoder, IrdaCmd, Pulse, TimeEq } from "./Decoder-if";

function GetByte(pulse: Pulse[]): number{
    let r = 0;
    for (let i = 0; i<8; i++){
        let p = pulse[i];
        if (!p){
            throw "Empty bit";
        }
        if (!TimeEq(p.high, 560)){
            throw "Invalid high time";
        }
        if (TimeEq(p.low, 2250-560)){
            r += 1<<i;
        }else if (!TimeEq(p.low, 1120-560)){
            throw "Invalid low time";
        }
    }
    // console.log("byte: ", r.toString(16));
    return r;
}

export class RC5Decoder implements Decoder{
    Decode(pulse: Pulse[]): IrdaCmd {
        throw "todo";
        if (!pulse || pulse.length < 33){
            return null;
        }
        if ( !TimeEq(pulse[0].high, 9000) || !TimeEq(pulse[0].low, 4500) ){
            return null;
        }
        let i = 1;
        let bytes = [];
        try {
            for (let n = 0; n<4; n++){
                bytes.push(GetByte(pulse.slice(i, i+8)));
                i += 8;
            }
        }catch (e){
            console.log("Get byte fail", e);
            return null;
        }
        if (bytes[2] + bytes[3] != 0xff){
            console.log("command check fail");
            return null;
        }
        let addr = bytes[0];
        if (bytes[0] + bytes[1] != 0xff){
            console.warn("address inverse check fail, consider it as extended NEC protocol");
            addr += bytes[1]*256;
        }

        return {
            protocol: "RC5",
            address: addr,
            command: bytes[2]
        };
    }
}
