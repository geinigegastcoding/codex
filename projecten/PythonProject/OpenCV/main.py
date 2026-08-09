import cv2
import pafy

URL="https://www.youtube.com/watch?v=wqctLW0Hb_0"
play=pafy.new(URL).streams[-1]
assert play is not None
stream = cv2.VideoCapture(play.url)