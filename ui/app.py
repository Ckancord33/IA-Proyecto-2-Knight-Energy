import os
import sys
import eel

# Resolve absolute path to the 'web' directory in the same folder as this file
base_dir = os.path.dirname(os.path.abspath(__file__))
web_dir = os.path.join(base_dir, 'web')

def start_gui():
    print("Initializing Knight Energy GUI...")
    eel.init(web_dir)
    
    # Define an initial dummy expose to test communication
    @eel.expose
    def ping():
        print("Received ping from frontend!")
        return "pong"

    # Start Eel in dedicated app window mode (Chrome app or Edge app)
    # This prevents opening in standard browser tabs with address bars.
    try:
        print("Launching GUI in Chrome App Mode...")
        eel.start('index.html', mode='chrome', size=(1280, 768), port=8686)
    except EnvironmentError:
        try:
            print("Chrome not found. Launching GUI in Microsoft Edge App Mode...")
            eel.start('index.html', mode='edge', size=(1280, 768), port=8686)
        except EnvironmentError:
            print("App mode not supported. Falling back to default system browser...")
            eel.start('index.html', mode='default', size=(1280, 768), port=8686)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        # Allow clean shutdown
        print("GUI application stopped.")
        pass

if __name__ == '__main__':
    start_gui()
