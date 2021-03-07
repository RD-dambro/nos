import { execFile, spawn, fork } from "child_process";

interface spawnArgs {
    app: string,
    channel: string,
    algo: string
};

const execProducer = (args: spawnArgs) => {
    execFile(
        './src/socket-worker/env/bin/python', 
        [
            './src/socket-worker/publisher1.py', 
            args.app, 
            args.channel, 
            args.algo
        ], 
        //   (error, stdout, stderr) => {
        //     if(stderr) console.log(stderr)
        //     if(stdout) console.log(stdout)
        //     if(error) console.log(error)
        //   }
)};

const execConsumer = (args: spawnArgs) => {
    execFile(
        './src/socket-worker/env/bin/python', 
        [
            './src/socket-worker/client2.py', 
            args.app, 
            args.channel, 
            args.algo
        ], 
        //   (error, stdout, stderr) => {
        //     if(stderr) console.log(stderr)
        //     if(stdout) console.log(stdout)
        //     if(error) console.log(error)
        //   }]
)};

export const algo_lookup: {[key: string]: string} = {
    "motion": "bgsub",
} 

export const filter_lookup: {[key: string]: string | boolean} = {
    "bgsub": true,
} 

export class ProcessManagerService {

    publish(app: string, channel: string, filter: string)
    {
        execProducer({app, channel, algo:filter});
        console.log("publishing: ", channel, filter)
    }

    consume(app: string, channel: string, algo: string)
    {
        execConsumer({app, channel, algo});
        console.log("connecting: ", channel, algo);
    }

    constructor(){}
}