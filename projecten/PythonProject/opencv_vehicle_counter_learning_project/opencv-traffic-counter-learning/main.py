from pathlib import Path
import cv2
import numpy
VIDEO_PATH = Path("assets/synthetic_traffic.mp4")


def main():
    # STAGE 1:
    video = cv2.VideoCapture(VIDEO_PATH)
    if video.isOpened():
        print("File is open")
    frame_number = 1
    
    while True:
        ret, frame = video.read()
        cv2.line(frame, (0,320), (854,320), (0,0,0), 5)
        frame = frame[200:460, 50:800]
        # height, width, channels = frame.shape
        
        # print(height, width, channels, 30, frame_number)
        if not ret:
            break
        cv2.imshow("video", frame)
        if cv2.waitKey(33) & 0xFF == ord("q"):
           break
        frame_number+=1
    video.release()
    cv2.destroyAllWindows()





if __name__ == "__main__":
    main()
