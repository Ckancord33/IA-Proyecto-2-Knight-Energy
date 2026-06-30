from model.board_generator import Board
from model.knight import Knight

class Game:
    """
    Estado del juego: tablero, caballos activos, turno y reglas.
    """
    def __init__(self, board: Board, knight1: Knight, knight2: Knight):
        self.board = board
        self.knight1 = knight1
        self.knight2 = knight2
