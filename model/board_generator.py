"""
Genera el reparto inicial del tablero de Knight Energy: posiciones de
puntos, de energía y de los dos caballos.
"""

import random
from dataclasses import dataclass

Position = tuple[int, int]

DEFAULT_POINTS_VAL: list[int] = [2, 3, 4, 5, 6, 8, 9]   # según enunciado
DEFAULT_ENERGYS_VAL: list[int] = [2, 3, 4, 5]


@dataclass(frozen=True)
class InitialLayout:
    """
    Resultado inmutable del reparto inicial del tablero.

    Una vez generado no cambia: cualquier evolución de la partida
    (casillas consumidas, caballos moviéndose) vive en State, no acá.
    """
    points: dict[Position, int]
    energies: dict[Position, int]
    white_position: Position
    black_position: Position


def generate_initial_layout(
    n: int = 8,
    points_val: list[int] | None = None,
    energies_val: list[int] | None = None,
) -> InitialLayout:
    """
    Sortea el reparto inicial completo del tablero: casillas de puntos,
    casillas de energía, y la posición de cada caballo, garantizando
    que ninguna posición se repita.
    """
    points_val = points_val if points_val is not None else DEFAULT_POINTS_VAL
    energies_val = energies_val if energies_val is not None else DEFAULT_ENERGYS_VAL

    occupied: set[Position] = set()

    points: dict[Position, int] = {}
    for val in points_val:
        pos = _random_free_pos(n, occupied)
        points[pos] = val
        occupied.add(pos)

    energies: dict[Position, int] = {}
    for val in energies_val:
        pos = _random_free_pos(n, occupied)
        energies[pos] = val
        occupied.add(pos)

    white_position = _random_free_pos(n, occupied)
    occupied.add(white_position)

    black_position = _random_free_pos(n, occupied)

    return InitialLayout(
        points=points,
        energies=energies,
        white_position=white_position,
        black_position=black_position,
    )


def _random_free_pos(n: int, occupied: set[Position]) -> Position:
    """Devuelve una posición aleatoria dentro del tablero que no esté en `occupied`."""
    while True:
        pos = (random.randint(0, n - 1), random.randint(0, n - 1))
        if pos not in occupied:
            return pos