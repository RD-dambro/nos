import ffmpeg
import time
import sys

from filters.bgsub import bgsub

try:
    app = sys.argv[1]
    channel = sys.argv[2]
    f = sys.argv[3]
except:
    print("excepted")
    pass

input_server = 'http://localhost:8000/' + app + '/' + channel + '.flv' # push server (output server)
output_server = 'rtmp://localhost:1935/' + channel + '/' + f # push server (output server)


process = (
    ffmpeg
    .input('pipe:')
    .output(output_server, vcodec='libx264', preset="ultrafast", video_bitrate='8M', 
    bufsize='2M', segment_time='6', format='flv', pix_fmt='yuv420p', tune='zerolatency')
    .run_async(pipe_stdin=True)
)

class Publisher():
    
    def __init__(self,transport, channel, algo) -> None:
        self.transport = transport
        self.algo = None

        if (algo == "bgsub"):
            self.algo = bgsub(process, input_server)



    def loop(self):
        self.algo.loop()



    def send(self, frame):
        self.transport.stdin.write(frame.tobytes())

            


time.sleep(3)
pub = Publisher(process, input_server, f)
pub.loop()