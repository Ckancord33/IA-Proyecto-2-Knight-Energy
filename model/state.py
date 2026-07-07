"""
foto del estado de una partida de Knight Energy en un momento
dado. Guarda datos, no decide nada
"""

from dataclasses import dataclass

from model.board_generator import InitialLayout
from model.knight import Knight

Position = tuple[int, int]
Color = str  # 'white' | 'black'

STARTING_ENERGY = 7


@dataclass
class State:
    """
    Foto del juego en un turno dado: qué casillas quedan, cómo está
    cada caballo, y de quién es el turno.
    """
    n: int
    points: dict[Position, int]
    energies: dict[Position, int]
    knights: dict[Color, Knight]
    turn: Color
    max_points: int = 37
    max_energy: int = 20

    @classmethod
    def new_game(
        cls,
        layout: InitialLayout,
        n: int = 8,
        starting_energy: int = STARTING_ENERGY,
    ) -> "State":
        """
        Arma el State inicial a partir de un InitialLayout recién
        generado por board_generator.generate_initial_layout().
        """
        knights: dict[Color, Knight] = {
            "white": Knight("white", layout.white_position, energy=starting_energy),
            "black": Knight("black", layout.black_position, energy=starting_energy),
        }
        total_points = sum(layout.points.values())
        total_energy = starting_energy + sum(layout.energies.values())
        return cls(
            n=n,
            points=dict(layout.points),
            energies=dict(layout.energies),
            knights=knights,
            turn="white",  # la máquina siempre empieza y juega blancas
            max_points=total_points,
            max_energy=total_energy,
        )

    def clone(self) -> "State":
        """
        Copia profunda de este state
        """
        cloned_knights: dict[Color, Knight] = {
            color: knight.clone() for color, knight in self.knights.items()
        }
        return State(
            n=self.n,
            points=dict(self.points),
            energies=dict(self.energies),
            knights=cloned_knights,
            turn=self.turn,
            max_points=self.max_points,
            max_energy=self.max_energy,
        )

    def __repr__(self) -> str:
        white, black = self.knights["white"], self.knights["black"]
        return (
            f"State(turn={self.turn}, points_left={len(self.points)}, "
            f"energies_left={len(self.energies)}, white={white}, black={black})"
        )