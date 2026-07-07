from model.knight import L_OFFSETS
from collections import deque
import model.game as game

def bfs_energy_distance(origen: tuple[int,int],
                        energies: dict[tuple[int,int], int],
                        n: int, max_depth:int = 6) -> int | None:
    """
    Busca la distancia mínima en moviemientos de caballo desde el punto de origen a cualquier casilla de energía y si no hay energías alcanzables retorna none
    """
    if not energies:
        return None
    
    cola= deque()
    cola.append((origen,0))
    visitados = {origen}

    while cola:
        pos,dist=cola.popleft()

        if pos in energies:
            return dist

        if dist>=max_depth:
            continue

        for dx, dy in L_OFFSETS:
            nx, ny = pos[0]+dx, pos[1]+dy
            
            if 0<=nx <n and 0 <=ny <n and (nx,ny) not in visitados:
                visitados.add((nx,ny))
                cola.append(((nx,ny), dist+1))
    return None
    

# =====================================================================
# HEURÍSTICA 1: COMPLEJA (Prioriza puntos/energía según peso dinámico)
# =====================================================================
def heuristica1(state, max_color: str) -> float:
    """
    Heurística compleja que utiliza pesos dinámicos y normalización para
    priorizar la recolección de energía o puntos según la situación del caballo.
    """
    # determinar quien es el rival
    min_color = game.other_color(max_color)

    # Condición de estado terminal
    if game.is_terminal(state):
        w = game.winner(state)
        if w == max_color:
            return float('inf')
        elif w == min_color:
            return -float('inf')
        else:
            return 0.0  # Empate

    # Extraer valores de cada jugador
    knight_max = state.knights[max_color]
    knight_min = state.knights[min_color]

    P_MAX = knight_max.points
    P_MIN = knight_min.points

    E_MAX = knight_max.energy
    E_MIN = knight_min.energy

    M_MAX = len(knight_max.get_candidate_moves(state.n))
    M_MIN = len(knight_min.get_candidate_moves(state.n))

    # Diferencias de max y min
    delta_P = P_MAX - P_MIN
    delta_E = E_MAX - E_MIN
    delta_M = M_MAX - M_MIN
    
    # Normalización
    MAX_POINTS = state.max_points
    MAX_ENERGY = state.max_energy
    MAX_MOVES = 8

    delta_P_norm = delta_P / MAX_POINTS
    delta_E_norm = delta_E / MAX_ENERGY
    delta_M_norm = delta_M / MAX_MOVES

    # Pesos según energía restante vs distancia a una energía 
    d_min = bfs_energy_distance(knight_max.position, state.energies, state.n)

    if d_min is not None and E_MAX <= d_min + 1:
        # priorizar conseguir energía
        w1, w2, w3 = 1.0, 1.5, 0.5
    else:
        # priorizar puntos
        w1, w2, w3 = 1.0, 0.5, 0.5
    
    # Valor de la heurística al final 
    h = w1 * delta_P_norm + w2 * delta_E_norm + w3 * delta_M_norm
    return float(h)


# =====================================================================
# HEURÍSTICA 2: SIMPLE (Diferencia de puntos + diferencia de energía)
# =====================================================================
def heuristica2(state, max_color: str) -> float:
    """
    Heurística simple que es solo la diferencia de puntos más la diferencia de energía,
    con la condición de estado terminal.
    """
    min_color = game.other_color(max_color)
    
    # Condición de estado terminal
    if game.is_terminal(state):
        w = game.winner(state)
        if w == max_color:
            return float('inf')
        elif w == min_color:
            return -float('inf')
        else:
            return 0.0  # Empate
            
    # Diferencia de puntos + diferencia de energías
    p_max = state.knights[max_color].points
    p_min = state.knights[min_color].points
    e_max = state.knights[max_color].energy
    e_min = state.knights[min_color].energy
    
    return float((p_max - p_min) + ((e_max - e_min) / 2))


# Compatibilidad hacia atrás
heuristic = heuristica1
complex_heuristic = heuristica1
simple_heuristic = heuristica2