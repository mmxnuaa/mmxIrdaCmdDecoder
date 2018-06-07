import { DecodePulseSequence } from "./Decoder-if";
import { NECDecoder } from "./NECDecoder";
import { doDecode } from "./Decoder";

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    // input: fs.createReadStream('kk.txt')
    input: fs.createReadStream('bb.txt')
});

let lines: string[] = [];
rl.on('line', (line) => {
    // console.log(`Line from file: ${line}`);
    if (line == "IrdaSigEndSequence"){
        doDecode(lines);
        lines = [];
    }else {
        lines.push(line);
    }
}).on("close", ()=>{
    doDecode(lines);
});

