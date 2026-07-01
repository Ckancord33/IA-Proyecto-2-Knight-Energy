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

def minimax(initial_state, max_depth):
    # nodo raiz
    root = Node(initial_state, 'MAX', 0)
    
    # pila como la estructura de datos principal
    stack = [root]
    
    # Arreglo para guardar los nodos construidos como historial
    nodes_array = []
    
    # construcción del árbol 
    while stack:
        current_node = stack.pop()
        nodes_array.append(current_node)
        
        if not is_leaf(current_node.state, current_node.depth, max_depth):
            # Obtener los hijos/movimientos posibles a partir del estado
            next_states = get_children_states(current_node.state)
            next_type = 'MIN' if current_node.node_type == 'MAX' else 'MAX'
            
            for state in next_states:
                # Se añaden a la pila los hijos
                child = Node(state, next_type, current_node.depth + 1, current_node)
                stack.append(child)
        else:
            # Cuando se expanda un nodo hoja se calcula su utilidad
            current_node.utility = heuristic(current_node.state)
            
    # actualizacion de la utilidad de abajo hacia arriba (bottom up)
    # se recorren los nodos desde los más profundos hasta la raíz. 
    nodes_array.sort(key=lambda node: node.depth, reverse=True)
    
    # Cada nodo informa al padre su utilidad
    for node in nodes_array:
        if node.parent is not None:
            if node.parent.node_type == 'MAX':
                # Si el padre es MAX, busca maximizar la utilidad
                if node.utility > node.parent.utility:
                    node.parent.utility = node.utility
            elif node.parent.node_type == 'MIN':
                # Si el padre es MIN, busca minimizar la utilidad
                if node.utility < node.parent.utility:
                    node.parent.utility = node.utility
                    
    # Cuando se llegue a la raíz se tendrá el valor minimax
    return root.utility
