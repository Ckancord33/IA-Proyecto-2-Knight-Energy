# model/knight.py

L_OFFSETS = [
    (-2, -1), (-2, 1), (-1, -2), (-1, 2),
    (1, -2),  (1, 2),  (2, -1),  (2, 1),
]

class Knight:
    """
    Representa al caballo de un jugador: su posición, energía y puntos.
    No conoce las reglas del juego, solo su propia
    geometría de movimiento y su estado.
    """

    def __init__(self, color: str, position: tuple[int, int], energy: int = 7):
        self.color = color
        self.position = position
        self.energy = energy
        self.points = 0

    def get_candidate_moves(self, n: int) -> list[tuple[int, int]]:
        """
        Todas las casillas en L desde la posición actual que caen
        dentro del tablero n x n. NO valida si están ocupadas o si
        hay energía suficiente: eso lo decide Game.
        """
        x, y = self.position
        moves = []
        for dx, dy in L_OFFSETS:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n:
                moves.append((nx, ny))
        return moves

    def has_energy(self) -> bool:
        return self.energy > 0

    def __repr__(self) -> str:
        return f"Knight({self.color}, pos={self.position}, e={self.energy}, pts={self.points})"