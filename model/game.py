"""
Funciones de transición de estado para Knight Energy. Cumplen el rol
de "rules": reciben un State y devuelven un State nuevo (o una
consulta sobre uno existente). No guardan nada propio — toda mutación
ocurre sobre un clon, nunca sobre el State que entra por parámetro.
"""

from model.state import State, Position, Color


def other_color(color: Color) -> Color:
    """El color del rival."""
    return "black" if color == "white" else "white"


def legal_moves(state: State, color: Color) -> list[Position]:
    """
    Casillas en L disponibles para el caballo de `color`, dentro del
    tablero, excluyendo la posición ocupada por el rival.
    No filtra por energía: eso lo resuelve must_skip().
    """
    knight = state.knights[color]
    opponent_knight = state.knights[other_color(color)]
    candidates = knight.get_candidate_moves(state.n)
    return [pos for pos in candidates if pos != opponent_knight.position]


def must_skip(state: State, color: Color) -> bool:
    """
    True si el caballo de `color` no tiene energía para moverse este
    turno (y por lo tanto pierde el turno automáticamente).
    """
    return not state.knights[color].has_energy()


def is_legal_move(state: State, move: Position) -> bool:
    """Valida que `move` sea legal para quien tiene el turno (state.turn)."""
    return move in legal_moves(state, state.turn)


def apply_move(state: State, move: Position) -> State:
    """
    Aplica el movimiento de state.turn hacia `move` sobre una copia de
    `state` y la devuelve. Cobra 1 de energía, suma puntos/energía si
    la casilla destino tiene algo, la consume, y pasa el turno.

    Lanza ValueError si el movimiento no es legal o si a quien tiene
    el turno le tocaba pasar por falta de energía (eso se resuelve
    con apply_skip, no acá).
    """
    color = state.turn
    if must_skip(state, color):
        raise ValueError(f"{color} no tiene energía: corresponde apply_skip, no apply_move")
    if not is_legal_move(state, move):
        raise ValueError(f"{move} no es un movimiento legal para {color}")

    new_state = state.clone()
    knight = new_state.knights[color]

    knight.position = move
    knight.energy -= 1

    if move in new_state.points:
        knight.points += new_state.points.pop(move)
    if move in new_state.energies:
        knight.energy += new_state.energies.pop(move)

    new_state.turn = other_color(color)
    return new_state


def apply_skip(state: State) -> State:
    """
    Aplica la pérdida de turno de quien tiene el turno (state.turn)
    por falta de energía: resta 3 puntos y pasa el turno. No toca el
    tablero.
    """
    color = state.turn
    if not must_skip(state, color):
        raise ValueError(f"{color} sí tiene energía: no corresponde apply_skip")

    new_state = state.clone()
    new_state.knights[color].points -= 3
    new_state.turn = other_color(color)
    return new_state


def is_terminal(state: State) -> bool:
    """
    El juego termina cuando no quedan casillas de puntos, o cuando
    ningún jugador puede ya moverse (ambos en energía 0 — estado
    permanente, ver nota arriba).
    """
    if not state.points:
        return True
    return must_skip(state, "white") and must_skip(state, "black")


def winner(state: State) -> Color | None:
    """
    Color del ganador según puntos acumulados, o None si hay empate.
    No valida que el juego haya terminado: eso es responsabilidad de
    quien llama (normalmente el Controller, una vez is_terminal).
    """
    white_points = state.knights["white"].points
    black_points = state.knights["black"].points
    if white_points == black_points:
        return None
    return "white" if white_points > black_points else "black"