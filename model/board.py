import random


class Board:
    """
    Genera y almacena el tablero inicial de Knight Energy.

    Responsabilidad: posicionar aleatoriamente las casillas de puntos
    y energía, garantizando que no coincidan entre sí.
    La posición de los caballos la asigna Game usando get_free_position().
    """

    DEFAULT_POINTS_VAL: list[int] = [2, 3, 4, 5, 6, 8, 9]   # según enunciado
    DEFAULT_ENERGYS_VAL: list[int] = [2, 3, 4, 5]

    def __init__(
        self,
        n: int = 8,
        points_val: list[int] | None = None,
        energies_val: list[int] | None = None,
    ) -> None:
        self.n = n
        self.points_val = points_val if points_val is not None else self.DEFAULT_POINTS_VAL
        self.energies_val = energies_val if energies_val is not None else self.DEFAULT_ENERGYS_VAL

        # dict posición → valor; vacíos hasta que se llame generate_board()
        self.points:  dict[tuple[int, int], int] = {}
        self.energies: dict[tuple[int, int], int] = {}

        self.generate_board()

    # ------------------------------------------------------------------
    # Generación
    # ------------------------------------------------------------------

    def generate_board(self) -> None:
        """Genera aleatoriamente las posiciones de puntos y energía."""
        self.points = {}
        self.energies = {}
        occupied: set[tuple[int, int]] = set()

        for val in self.points_val:
            pos = self._random_free_pos(occupied)
            self.points[pos] = val
            occupied.add(pos)

        for val in self.energies_val:
            pos = self._random_free_pos(occupied)
            self.energies[pos] = val
            occupied.add(pos)

    def _random_free_pos(self, occupied: set[tuple[int, int]]) -> tuple[int, int]:
        """Devuelve una posición aleatoria que no esté en `occupied`."""
        while True:
            pos = (random.randint(0, self.n - 1), random.randint(0, self.n - 1))
            if pos not in occupied:
                return pos

    # ------------------------------------------------------------------
    # Consultas (las usará Game y Agent)
    # ------------------------------------------------------------------

    def get_free_position(self) -> tuple[int, int]:
        """Posición libre para ubicar un caballo al inicio de la partida."""
        occupied = set(self.points) | set(self.energies)
        return self._random_free_pos(occupied)

    def all_occupied(self) -> set[tuple[int, int]]:
        """Todas las celdas con ficha (útil para colocar caballos)."""
        return set(self.points) | set(self.energies)

    def __repr__(self) -> str:
        return f"Board(n={self.n}, points={self.points}, energies={self.energies})"