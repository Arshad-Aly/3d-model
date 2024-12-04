import pyttsx3

def natural_text_to_speech():
    engine = pyttsx3.init()
    
    # List available voices
    voices = engine.getProperty('voices')
    for voice in voices:
        print(f"Voice: {voice.name}")
    
    # Select a specific voice (varies by system)
    engine.setProperty('voice', voices[0].id)  # Often changes male/female voice
    
    # Adjust parameters for more natural speech
    engine.setProperty('rate', 170)  # Adjust speaking speed
    engine.setProperty('volume', 0.8)  # Adjust volume
    
    engine.say("Hello")
    engine.runAndWait()

natural_text_to_speech()
