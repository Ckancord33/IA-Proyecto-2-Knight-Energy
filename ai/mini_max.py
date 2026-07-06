import math
from ai.heuristic import heuristic as heuristic
import model.game as game

def is_leaf(state, depth, max_depth):
    """
    Dice si un nodo es hoja por profundidad máxima o por ser un estado terminal del juego.
    """
    return depth == max_depth or game.is_terminal(state)

def get_children_states(state):
    """
    Genera los siguientes estados posibles a partir del actual aplicando 
    las reglas del juego.
    """
    if game.must_skip(state, state.turn): # si no hay energia, es skip
        return [game.apply_skip(state)]
        
    moves = game.legal_moves(state, state.turn) # si hay energia calcula movimientos legales
    return [game.apply_move(state, move) for move in moves]

def get_best_move(initial_state, max_depth):
    """
    Ejecuta el algoritmo minimax con poda alfa-beta sobre el estado inicial y retorna la 
    posición del movimiento recomendado para el jugador que tiene el turno.
    """
    if game.is_terminal(initial_state):
        return None
    if game.must_skip(initial_state, initial_state.turn):
        return None

    active_color = initial_state.turn

    def minimax_ab(state, depth, alpha, beta, is_max_turn):
        # parar si se topa con una hoja
        if is_leaf(state, depth, max_depth):
            # Evalua la heurística desde la perspectiva del jugador original osea el active_color
            return heuristic(state, active_color), state

        children = get_children_states(state)
        best_state = None

        if is_max_turn:
            max_eval = -math.inf
            for child in children:
                # Llamada recursiva asumiendo el turno del oponente
                eval_val, _ = minimax_ab(child, depth + 1, alpha, beta, False)
                
                # Actualizar el mejor escenario para si misma (max)
                if eval_val > max_eval:
                    max_eval = eval_val
                    best_state = child
                
                # Poda de los hijos de max:
                # Si el valor de este nodo eval_val es mayor o igual que beta podamos
                if eval_val >= beta:
                    break
                    
                # Actualizamos el valor alfa asegurado por max
                alpha = max(alpha, eval_val)
                
            return max_eval, best_state
            
        else:
            min_eval = math.inf
            for child in children:
                # Llamada recursiva asumiendo nuestro turno (max)
                eval_val, _ = minimax_ab(child, depth + 1, alpha, beta, True)
                
                # Actualizar el mejor escenario para min (el que mas perjudica al agente)
                if eval_val < min_eval:
                    min_eval = eval_val
                    best_state = child
                
                # Poda de los hijos de min
                # Si el valor de este nodo eval_val es menor o igual que alfa, podamos
                if eval_val <= alpha:
                    break
                    
                # Actualizamos el valor beta asegurado por min
                beta = min(beta, eval_val)
                
            return min_eval, best_state

    # La primera llamada es para el turno actual del agente buscando maximizar
    _, best_next_state = minimax_ab(initial_state, 0, -math.inf, math.inf, True)

    if best_next_state is None:
        return None

    # Extraemos la posición a la que se movió el caballo activo
    return best_next_state.knights[active_color].position
