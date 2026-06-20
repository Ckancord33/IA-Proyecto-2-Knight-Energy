from textual.app import App
from ui.screens.main_menu import MainMenu

class KnightEnergyApp(App):
    """
    Main Application class for Knight Energy TUI.
    Loads styles and mounts the MainMenu screen.
    """
    # Load stylesheet relative to app.py
    CSS_PATH = "styles.tcss"
    
    # Global keyboard bindings
    BINDINGS = [
        ("q", "quit", "Salir")
    ]

    def on_mount(self) -> None:
        # Push the main menu screen when the app starts
        self.push_screen(MainMenu())

    def on_start_game(self, difficulty: str) -> None:
        """
        Placeholder method called when 'Iniciar Partida' is pressed.
        This hook serves as the integration point with the game logic module.
        """
        print(f"\n[Knight Energy TUI] on_start_game called with difficulty: {difficulty}")

if __name__ == "__main__":
    app = KnightEnergyApp()
    app.run()
