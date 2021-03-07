import { algo_lookup, filter_lookup } from './procman-service';
const NodeMediaServer = require('node-media-server');


interface eventArgs {
  id: string,
  streamPath?: string, 
  args: string 
}

interface ChannelInfo {
  app: string,
  channel: string
}

export interface CameraInfo {
  name: string,
  filters: string[],
  algos: string[]
}

const parseChannelInfo = (path:string) => {
  const parsed = path.split("/").filter(v => v!='');
  const info: ChannelInfo = {app:parsed[0], channel:parsed[1]};
  return info
}

const config = {
    rtmp: {
      port: 1935,
      chunk_size: 6000,
      gop_cache: false,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 8000,
      allow_origin: '*'
    }
}; 

export class MediaServer {

  service =  new NodeMediaServer(config);
  ListOfApps: {[key: string]: CameraInfo} = {};
  publishers_lookup: {[key: string]: string} = {};

  constructor(){

    this.service.on("postPublish", (id: string, StreamPath: string, args: string) => {
      console.log('Published:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      const stream = parseChannelInfo(StreamPath);

      this.publishers_lookup[id] = StreamPath;

      if (stream.app === 'live') 
      {
        const info: CameraInfo = {name: stream.channel,filters:[], algos:[]};
        this.ListOfApps[stream.channel] = info;
        // console.log(this.ListOfApps)
        // execProducer({app: path[0], channel: path[1], algo: 'bgsub'});
      }else if (this.ListOfApps[stream.app]) {
        if(algo_lookup[stream.channel]) {
          // this.ListOfApps[stream.app].algos.push(stream.channel)
          // this.ListOfApps[stream.app].algos.push(stream.channel)
        } else if (filter_lookup[stream.channel]) {
          // this.ListOfApps[stream.app].filters.push(stream.channel)
        }
      }
      
    });
    this.service.on('doneConnect', (id:string, args: string) => {
      console.log('[Disconnected]', `id=${id} args=${JSON.stringify(args)}`);
      // const stream = parseChannelInfo(StreamPath);
      let path = this.publishers_lookup[id];

      if(path) {
        let stream = parseChannelInfo(path);

        if (filter_lookup[stream.channel]) {
          this.ListOfApps[stream.app].filters = this.ListOfApps[stream.app].filters.filter(a => a == stream.channel)
        }
      }
    });
    this.service.run();
    console.log("media server service");
  }
}


