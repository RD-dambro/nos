import cv2 as cv

class motion():
    
    def __init__(self,transport, channel) -> None:
        self.transport = transport
        self.backSub = cv.createBackgroundSubtractorMOG2()
        self.capture = cv.VideoCapture(channel)

        # loop variables
        self.score = -1
        self.score_before_motion = self.score
        self.motion = False
        self.sensibility = 2
        self.white_min = 500

    def loop(self):
        while True:
            ret, frame = self.capture.read()
            if frame is not None:

                fgMask = self.backSub.apply(frame)
                white = cv.countNonZero(fgMask)
                
                # update score
                if self.motion is False:
                    self.score = 0.8*self.score + 0.2*white
                
                # trigger 
                whiteTH = self.score * self.sensibility
                if(whiteTH > self.white_min): 
                    if white > whiteTH and self.motion is False:
                        self.motion = True
                        self.score_before_motion = self.score
                        # motion start
                        self.__send_to_server(self.motion)
                    elif white < self.score_before_motion and self.motion is True:
                        self.motion = False
                        self.score_before_motion = -1
                        # motion stop
                        self.__send_to_server(self.motion)

        
    def __send_to_server(self,result):
        # print(result)
        self.transport.emit('message', {'motion': result})
