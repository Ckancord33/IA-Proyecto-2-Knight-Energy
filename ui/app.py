import os
import sys
import eel

# Add parent directory to sys.path to enable clean imports from the root folder
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from controller.game_controller import GameController
from model.state import State
from model.board_generator import generate_initial_layout
import model.game as game

# Resolve absolute path to the 'web' directory in the same folder as this file
base_dir = os.path.dirname(os.path.abspath(__file__))
web_dir = os.path.join(base_dir, 'web')

# Global reference to active GameController
current_controller = None

def serialize_state(state: State) -> dict:
    """Translates Python State structures into plain serializable dictionaries for Eel."""
    return {
        "n": state.n,
        "turn": state.turn,
        "points": {f"{r},{c}": val for (r, c), val in state.points.items()},
        "energies": {f"{r},{c}": val for (r, c), val in state.energies.items()},
        "knights": {
            color: {
                "color": knight.color,
                "position": [knight.position[0], knight.position[1]],
                "points": knight.points,
                "energy": knight.energy
            } for color, knight in state.knights.items()
        }
    }

@eel.expose
def ping():
    print("Received ping from frontend!")
    return "pong"

@eel.expose
def start_game_backend(board_size, difficulty, player_color, energies, points):
    global current_controller
    print(f"Backend: Starting game. Board size: {board_size}, Difficulty: {difficulty}, Player Color: {player_color}")
    
    # 1. Generate layout from user arrays
    layout = generate_initial_layout(n=board_size, points_val=points, energies_val=energies)
    
    # 2. Build initial state (starting energy set to 10)
    state = State.new_game(layout, n=board_size, starting_energy=10)
    
    # 3. Determine white vs black types
    if player_color == 'white':
        white_player = 'human'
        black_player = 'ai'
    else:
        white_player = 'ai'
        black_player = 'human'
        
    # 4. Map difficulty to minimax depths
    depth = 3
    if difficulty == 'facil':
        depth = 1
    elif difficulty == 'dificil':
        depth = 6
        
    # 5. Initialize controller with lambda eel.sleep delay
    current_controller = GameController(
        state=state,
        white_player_type=white_player,
        black_player_type=black_player,
        white_depth=depth,
        black_depth=depth,
        sleep_fn=lambda: eel.sleep(1.0)
    )
    
    # 6. Bind state change & game over callbacks
    def on_state_changed(current_state):
        state_dict = serialize_state(current_state)
        # Compute valid moves for human player
        valid_moves = []
        current_turn = current_state.turn
        if current_controller.player_types[current_turn] == 'human':
            valid_moves = [[pos[0], pos[1]] for pos in game.legal_moves(current_state, current_turn)]
        
        eel.update_game_state_js(state_dict, valid_moves)
        
    def on_game_over(winner_color):
        eel.game_over_js(winner_color)
        
    current_controller.on_state_changed = on_state_changed
    current_controller.on_game_over = on_game_over
    
    # 7. Start the game logic inside a non-blocking background greenlet
    eel.spawn(current_controller.start_game)

@eel.expose
def play_human_move_backend(r, c):
    global current_controller
    if current_controller:
        print(f"Backend: Human requesting move to {r},{c}")
        # Run asynchronously in background greenlet
        eel.spawn(current_controller.play_human_move, (r, c))

@eel.expose
def undo_move_backend():
    global current_controller
    if current_controller:
        print("Backend: Human requesting Undo")
        # Run asynchronously in background greenlet
        eel.spawn(current_controller.undo_move)

def start_gui():
    print("Initializing Knight Energy GUI...")
    eel.init(web_dir)
    
    # Start Eel in dedicated app window mode (Chrome app or Edge app)
    try:
        print("Launching GUI in Chrome App Mode...")
        eel.start('index.html', mode='chrome', size=(1280, 768), port=8686, cmdline_args=['--autoplay-policy=no-user-gesture-required'])
    except EnvironmentError:
        try:
            print("Chrome not found. Launching GUI in Microsoft Edge App Mode...")
            eel.start('index.html', mode='edge', size=(1280, 768), port=8686, cmdline_args=['--autoplay-policy=no-user-gesture-required'])
        except EnvironmentError:
            print("App mode not supported. Falling back to default system browser...")
            eel.start('index.html', mode='default', size=(1280, 768), port=8686)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        print("GUI application stopped.")
        pass

if __name__ == '__main__':
    start_gui()
