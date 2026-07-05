import sys
import numpy as np
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
import os
import tempfile

def record_audio(filename, fs=16000, max_duration=10.0, silence_threshold=0.005, silence_duration=1.5):
    chunk_duration = 0.1
    chunk_samples = int(fs * chunk_duration)
    
    stream = sd.InputStream(samplerate=fs, channels=1, dtype='float32')
    with stream:
        audio_data = []
        silence_chunks = 0
        max_silence_chunks = int(silence_duration / chunk_duration)
        max_total_chunks = int(max_duration / chunk_duration)
        
        has_spoken = False
        speech_chunks = 0
        
        for _ in range(max_total_chunks):
            chunk, overflowed = stream.read(chunk_samples)
            audio_data.append(chunk)
            
            rms = np.sqrt(np.mean(chunk**2))
            
            if rms > silence_threshold:
                speech_chunks += 1
                if speech_chunks >= 2: # need 2 chunks
                    has_spoken = True
                silence_chunks = 0
            else:
                speech_chunks = 0
                if has_spoken:
                    silence_chunks += 1
            
            if has_spoken and silence_chunks >= max_silence_chunks:
                break
                
        recording = np.concatenate(audio_data, axis=0)
        sf.write(filename, recording, fs)

def main():
    temp_wav = os.path.join(tempfile.gettempdir(), "jarvis_stt_temp.wav")
    try:
        record_audio(temp_wav)
        
        r = sr.Recognizer()
        with sr.AudioFile(temp_wav) as source:
            audio = r.record(source)
            
        try:
            text = r.recognize_google(audio, language="en-US")
            print(text)
        except sr.UnknownValueError:
            print("[no speech detected]")
        except sr.RequestError as e:
            print(f"[no speech detected] API Error: {e}")
            
    except Exception as e:
        print(f"[no speech detected] Error: {e}", file=sys.stderr)
    finally:
        if os.path.exists(temp_wav):
            try:
                os.remove(temp_wav)
            except:
                pass

if __name__ == "__main__":
    main()
