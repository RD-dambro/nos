import { MediaServer, CameraInfo } from "./components/media-server";
import { SocketServer } from "./components/socket-server";
import { ProcessManagerService, algo_lookup, filter_lookup } from"./components/procman-service";

const nms = new MediaServer;
const sio = new SocketServer;
const pm = new ProcessManagerService;

import express from 'express';

const port = 3000;

const app = express();


app.get('/algos', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // for(let a in algo_lookup)
    // {
    //     algos.push(a)
    // }
    res.send(algo_lookup);
})

app.get('/streams', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(nms.ListOfApps);
})

app.get('/:uid/:algo', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let cam: CameraInfo = nms.ListOfApps[req.params.uid];

    if(cam)
    {
        let algo = req.params.algo;
        let filter = algo_lookup[algo] 
        // check algo
        if(filter)
        {
            if(nms.ListOfApps[cam.name].filters.find((fil: string) => fil == filter)) {}
            else {
                // spawn filters
                pm.publish('live', cam.name, filter);
                nms.ListOfApps[cam.name].filters.push(filter);
            }
            
            if(nms.ListOfApps[cam.name].algos.find((a: string) => a == algo)) {}
            else {
                // spawn consumers
                pm.consume(cam.name, filter, algo);
                nms.ListOfApps[cam.name].algos.push(algo);
            }
            
        }
        

        res.send(cam);
    }
    else res.send("some error");
})

app.get('/', (req, res) => {
    res.send("hello from nos");
})

app.listen(port, () => {
    console.log("listening at port", port);
});



// app.use('/streams', (req, res, next) => {
//     console.log("middleware");

//     return next('route');
// }, (req, res, next) => {
//     console.log("next middleware");

//     return next('route');
// });