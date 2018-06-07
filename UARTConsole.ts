import * as SerialPort from "serialport";
import { doDecode } from "./Decoder";
import * as readline from "readline";

if (process.argv.length < 3){
    console.error("Usage: node Uartconsole.js <comport>");
}else {
    let port = new SerialPort("\\\\.\\COM"+process.argv[2], {
        baudRate: 115200
    });

    let lines: string[] = [];
    const Readline = SerialPort.parsers.Readline;
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', (line)=>{
        if (line == "IrdaSigEndSequence"){
            doDecode(lines);
            lines = [];
        }else if(line.startsWith("IrdaSigHigh") || line.startsWith("IrdaSigLow")){
            lines.push(line);
        }else {
            console.log(line);
        }
    });

    const rl = readline.createInterface(<any>{
        input: process.stdin,
        output: process.stdout,
        prompt: 'CMD> '
    });

    port.on('error', err=>{
        console.error("\nUart error: ", err);
        rl.close();
    });

    port.on('open', ()=>{
        rl.prompt();
    });
    // rl.prompt();

    rl.on('line', (line) => {
        line = line.trim();
        switch (line) {
            case 'help':
            case '?':
                console.log(`cmds:
                (1)IrdaReceiveStart:[ms]
                (2)IrdaReceiveStop
                NEC:\<addr\>,\<cmd\>`);
                break;
            case '1':
                port.write('IrdaReceiveStart\n');
                break;
            case '2':
                port.write('IrdaReceiveStop\n');
                break;
            default:
                port.write(line + '\n');
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });

}
