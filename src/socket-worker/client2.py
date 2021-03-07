import socketio
import sys
import time

from algos.motion1 import motion


try:
    app = sys.argv[1]
    channel = sys.argv[2]
    algo = sys.argv[3]
except:
    print("excepted")
    pass

streamChannel = 'http://localhost:8000/' + app + '/' + channel + '.flv'

sio = socketio.Client()


@sio.event
def connect():
    sio.emit('publisher', app + '/' + algo)
    print('connection established')
    
@sio.event
def my_message(data):
    print('message received with ', data)
    #sio.emit('message', {'response': 'my response'})

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:3001')

time.sleep(5)

todo = None
if(algo == 'motion'):
    todo = motion(sio, streamChannel)

if todo is not None:
    todo.loop()


sio.wait()
