import sys
from controller.game_controller import GameController
from model.state import State
from model.board_generator import generate_initial_layout
import model.game as game

def print_board(state: State):
    n = state.n
    print("\n" + "=" * 45)
    print(f" TABLERO (Turno actual: {state.turn.upper()})")
    print("=" * 45)
    
    # Cabecera de columnas
    header = "     " + "   ".join(f"{c}" for c in range(n))
    print(header)
    print("   " + "----" * n + "-")
    
    for r in range(n):
        row_str = f" {r} |"
        for c in range(n):
            pos = (r, c)
            if pos == state.knights["white"].position:
                cell = "W"
            elif pos == state.knights["black"].position:
                cell = "B"
            elif pos in state.points:
                cell = f"P{state.points[pos]}"
            elif pos in state.energies:
                cell = f"E{state.energies[pos]}"
            else:
                cell = "."
            row_str += f" {cell:^3} |"
        print(row_str)
        print("   " + "----" * n + "-")
        
    w = state.knights["white"]
    b = state.knights["black"]
    print(f" BLANCAS (W): Puntos = {w.points:<3} | Energía = {w.energy}")
    print(f" NEGRAS  (B): Puntos = {b.points:<3} | Energía = {b.energy}")
    print("=" * 45)

def main():
    print("Generando tablero inicial...")
    initial_layout = generate_initial_layout(8)
    
    # Inicialización correcta usando State.new_game
    state = State.new_game(initial_layout, n=8)
    
    controller = GameController(
        state, 
        white_player_type='ai', 
        black_player_type='ai',
        white_depth=3,
        black_depth=3
    )

    # Suscribir los callbacks para actualizar la consola
    def on_state_changed(current_state):
        print_board(current_state)
        # Si es el turno de la IA y el juego no ha terminado, pausar para pedir Enter
        if controller.player_types[current_state.turn] == "ai" and not game.is_terminal(current_state):
           # input("\n[Turno de la IA] Presiona Enter para que la máquina realice su movimiento...")
           pass

    def on_game_over(winner):
        print_board(controller.state)
        print("\n" + "#" * 40)
        print("           ¡FIN DEL JUEGO!")
        if winner:
            print(f"      El ganador es: {winner.upper()}")
        else:
            print("      ¡La partida terminó en Empate!")
        print("#" * 40)
        sys.exit(0)

    controller.on_state_changed = on_state_changed
    controller.on_game_over = on_game_over

    # Iniciar el juego
    controller.start_game()

    # Bucle principal para el turno del Humano
    while not game.is_terminal(controller.state):
        current_turn = controller.state.turn
        if controller.player_types[current_turn] == "human":
            moves = game.legal_moves(controller.state, current_turn)
            print(f"\nMovimientos legales disponibles para {current_turn.upper()}:")
            for i, move in enumerate(moves):
                print(f"  {i}: {move}")
            
            try:
                choice = input("\nSelecciona el número de tu movimiento (o 'u' para deshacer): ").strip()
                if choice.lower() == 'u':
                    controller.undo_move()
                    continue
                
                idx = int(choice)
                if 0 <= idx < len(moves):
                    controller.play_human_move(moves[idx])
                else:
                    print("Número fuera de rango. Inténtalo de nuevo.")
            except ValueError:
                print("Entrada no válida. Introduce un número de la lista o 'u'.")

if __name__ == "__main__":
    main()
