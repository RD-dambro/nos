import cv2 as cv
import ffmpeg
import subprocess as sp
#from pygame.time import Clock
import time
import numpy as np
import sys

FPS = 60

try:
    app = sys.argv[1]
    channel = sys.argv[2]
    algo = sys.argv[3]
except:
    print("excepted")
    pass

input_server = 'http://localhost:8000/' + app + '/' + channel + '.flv' # push server (output server)
output_server = 'rtmp://localhost:1935/' + channel + '/' + algo # push server (output server)


process = (
    ffmpeg
    .input('pipe:')
    .output(output_server, vcodec='libx264', preset="ultrafast", video_bitrate='8M', 
    bufsize='2M', segment_time='6', format='flv', pix_fmt='yuv420p', tune='zerolatency')
    .run_async(pipe_stdin=True)
)

class opencv_publisher():
    
    def __init__(self,transport, channel) -> None:
        self.transport = transport
        self.backSub = cv.createBackgroundSubtractorMOG2()
        self.capture = cv.VideoCapture(channel)
        # self.clock = Clock()


    def loop(self):
        
        while True:
            
            ret, frame = self.capture.read()   
            
            fgMask = self.backSub.apply(frame)
            ret2, frame2 = cv.imencode('.png', fgMask)

            #cv.imshow('FG Mask', fgMask)
            #keyboard = cv.waitKey(10)
            # if keyboard == 'q' or keyboard == 27:
            #     break

            self.send(frame2)

    def send(self, frame):
        self.transport.stdin.write(frame.tobytes())

            

time.sleep(3)
algo = opencv_publisher(process, input_server)
algo.loop()