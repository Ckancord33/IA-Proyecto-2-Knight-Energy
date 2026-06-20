from model.board import Board
from model.knight import Knight

class Game:
    """
    Estado del juego: tablero, caballos activos, turno y reglas.
    """
    def __init__(self, board: Board, knights: list[Knight]):
        self.board = board
        self.knights = knights
