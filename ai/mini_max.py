from ai.heuristic import funcion as heuristic
from model.node import Node
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
    Ejecuta el algoritmo minimax sobre el estado inicial y retorna la 
    posición del movimiento recomendado para el jugador que tiene el turno.
    """
    if game.is_terminal(initial_state):
        return None
    if game.must_skip(initial_state, initial_state.turn):
        return None

    # Construimos y resolvemos el árbol minimax igual que en minimax()
    root = Node(initial_state, 'MAX', 0)
    stack = [root]
    nodes_array = []
    
    while stack:
        current_node = stack.pop()
        nodes_array.append(current_node)
        
        if not is_leaf(current_node.state, current_node.depth, max_depth):
            next_states = get_children_states(current_node.state)
            next_type = 'MIN' if current_node.node_type == 'MAX' else 'MAX'
            
            for state in next_states:
                child = Node(state, next_type, current_node.depth + 1, current_node)
                stack.append(child)
        else:
            current_node.utility = heuristic(current_node.state)
            
    nodes_array.sort(key=lambda node: node.depth, reverse=True)
    
    for node in nodes_array:
        if node.parent is not None:
            if node.parent.node_type == 'MAX':
                if node.utility > node.parent.utility:
                    node.parent.utility = node.utility
            elif node.parent.node_type == 'MIN':
                if node.utility < node.parent.utility:
                    node.parent.utility = node.utility

    # Encontrar el nodo hijo directo (depth 1) que coincida con la utilidad elegida en root
    best_child = None
    for node in nodes_array:
        if node.parent is root and node.utility == root.utility:
            best_child = node
            break

    if best_child is None:
        # Resguardo de seguridad
        children = [n for n in nodes_array if n.parent is root]
        if children:
            best_child = children[0]
        else:
            return None

    # Extraemos la posición a la que se movió el caballo activo
    active_color = initial_state.turn
    return best_child.state.knights[active_color].position

