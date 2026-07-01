import math

class Node:
    def __init__(self, state, node_type, depth, parent=None):
        """
        Se debe guardar el tipo de nodo, MAX o MIN, la profundidad y la utilidad.
        Inicializar la utilidad de los nodos MAX en -∞ y los MIN en +∞
        """
        self.state = state
        self.node_type = node_type  # MAX/MIN
        self.depth = depth
        self.parent = parent
        
        if self.node_type == 'MAX':
            self.utility = -math.inf
        else:
            self.utility = math.inf
