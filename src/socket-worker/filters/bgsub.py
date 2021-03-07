import cv2 as cv
import time
import numpy as np

class bgsub():
    
    def __init__(self,transport, channel) -> None:
        self.transport = transport
        self.backSub = cv.createBackgroundSubtractorMOG2()
        self.capture = cv.VideoCapture(channel)


    def loop(self):
        
        while True:
            
            ret, frame = self.capture.read()
            
            if frame is not None:
                fgMask = self.backSub.apply(frame)
                ret2, frame2 = cv.imencode('.png', fgMask)

                # cv.imshow('FG Mask', fgMask)
                # keyboard = cv.waitKey(10)
                # if keyboard == 'q' or keyboard == 27:
                #     break

                self.send(frame2)

    def send(self, frame):
        self.transport.stdin.write(frame.tobytes())