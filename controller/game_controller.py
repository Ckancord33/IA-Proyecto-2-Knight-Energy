# controller/game_controller.py

from model.state import State, Position
import model.game as game
from ai.mini_max import get_best_move

class GameController:
    """
    Controlador principal del flujo del juego Knight Energy.
    Mantiene el estado actual, gestiona los turnos para jugadores humanos y de IA,
    y mantiene un historial que permite deshacer jugadas.
    """
    def __init__(
        self,
        state: State,
        white_player_type: str = "human",  # "human" o "ai"
        black_player_type: str = "ai",     # "human" o "ai"
        white_depth: int = 3,
        black_depth: int = 3,
    ):
        self.state = state
        self.player_types = {
            "white": white_player_type,
            "black": black_player_type,
        }
        self.depths = {
            "white": white_depth,
            "black": black_depth,
        }
        self.history: list[State] = []
        
        # Callbacks (Subscripciones) para comunicarse con la UI de forma reactiva
        self.on_state_changed = None  # Se ejecuta tras cada movimiento exitoso, pasándole el nuevo State
        self.on_game_over = None      # Se ejecuta al finalizar el juego, pasándole el ganador (o None si hay empate)

    def start_game(self):
        """Inicia el juego notificando el estado inicial y procesando el primer turno."""
        self._notify_ui()
        self.process_turn()

    def process_turn(self):
        """
        Analiza el estado actual del juego. Si el juego terminó o si es un skip,
        actúa de forma automática. Si le toca a la IA, calcula e implementa.
        Si es el turno de un humano, cede el control a la UI (deteniendo la ejecución).
        """
        # 1. Comprobar si el juego ha terminado
        if game.is_terminal(self.state):
            winner_color = game.winner(self.state)
            if self.on_game_over:
                self.on_game_over(winner_color)
            return

        current_color = self.state.turn
        current_type = self.player_types[current_color]

        # 2. Comprobar si corresponde perder el turno por falta de energía (Skip)
        if game.must_skip(self.state, current_color):
            self.history.append(self.state.clone())
            self.state = game.apply_skip(self.state)
            self._notify_ui()
            # Continuar con el siguiente turno
            self.process_turn()
            return

        # 3. Comprobar si le corresponde a la IA actuar de forma automática
        if current_type == "ai":
            self.history.append(self.state.clone())
            depth = self.depths[current_color]
            
            # Ejecutar el movimiento de la IA directamente en el controlador
            best_move = get_best_move(self.state, depth)
            if best_move is None:
                raise ValueError(f"No se encontró ningún movimiento posible para la IA en el turno de {self.state.turn}")
                
            self.state = game.apply_move(self.state, best_move)
            self._notify_ui()
            
            # Continuar con el siguiente turno
            self.process_turn()
            return

        # 4. Turno Humano
        # Detiene el flujo automático. La UI debe detectar que el turno es "human"
        # y habilitar la interacción para que el usuario haga clic.

    def play_human_move(self, position: Position):
        """
        Invocado por la UI cuando un jugador humano realiza una jugada.
        Valida que el turno actual realmente pertenezca a un humano, ejecuta
        el movimiento, notifica a la UI y reactiva el bucle de turnos.
        """
        current_color = self.state.turn
        if self.player_types[current_color] != "human":
            raise ValueError(f"No es el turno de un jugador humano. Turno actual: {current_color} ({self.player_types[current_color]})")

        # Validar el movimiento del jugador humano
        if not game.is_legal_move(self.state, position):
            raise ValueError(f"El movimiento {position} no es legal para el turno actual ({self.state.turn})")

        # Guardamos en el historial antes de aplicar cambios
        self.history.append(self.state.clone())

        # Ejecutar el movimiento del humano directamente en el controlador
        self.state = game.apply_move(self.state, position)
        self._notify_ui()

        # Continuamos con el ciclo (que podría ser el turno de la IA o de otro humano)
        self.process_turn()

    def undo_move(self):
        """
        Regresa el juego al estado anterior si existe historial.
        Reactiva el proceso de turnos para actualizar el estado del juego correctamente.
        """
        if not self.history:
            return

        self.state = self.history.pop()
        self._notify_ui()
        self.process_turn()

    def _notify_ui(self):
        """Dispara el callback de subscripción si está registrado."""
        if self.on_state_changed:
            self.on_state_changed(self.state)
