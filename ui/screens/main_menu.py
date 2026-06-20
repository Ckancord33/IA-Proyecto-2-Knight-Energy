from textual.app import ComposeResult
from textual.screen import Screen
from textual.widgets import Static, Button
from textual.containers import Container, Vertical, Horizontal, ScrollableContainer
from textual.message import Message
from textual.widget import Widget

from ui.widgets.ascii_title import AsciiTitle

class AdjusterButton(Button):
    """A button for the value adjuster that doesn't steal keyboard focus."""
    can_focus = False

class ValueAdjuster(Widget):
    """
    An interactive adjuster widget with left/right buttons and a value display.
    Focusable, supports Left/Right arrow keys and mouse clicks.
    """
    can_focus = True

    class Changed(Message):
        """Sent when the value changes."""
        def __init__(self, value: int) -> None:
            self.value = value
            super().__init__()

    def __init__(
        self,
        value: int,
        min_value: int,
        max_value: int,
        is_size: bool = False,
        **kwargs
    ) -> None:
        super().__init__(**kwargs)
        self.value = value
        self.min_value = min_value
        self.max_value = max_value
        self.is_size = is_size

    def compose(self) -> ComposeResult:
        # Create buttons with can_focus=False so keyboard Tab jumps between adjusters,
        # and Left/Right keys are used for adjusting values.
        yield AdjusterButton("◀", id="dec", classes="adjuster-btn")
        yield Static(self.format_value(), id="val", classes="adjuster-value")
        yield AdjusterButton("▶", id="inc", classes="adjuster-btn")

    def format_value(self) -> str:
        if self.is_size:
            return f"{self.value}x{self.value}"
        return str(self.value)

    def update_value(self, new_val: int) -> None:
        self.value = new_val
        self.query_one("#val", Static).update(self.format_value())

    def on_button_pressed(self, event: Button.Pressed) -> None:
        event.stop()
        if event.button.id == "dec":
            self.decrement()
        elif event.button.id == "inc":
            self.increment()

    def decrement(self) -> None:
        if self.value > self.min_value:
            self.value -= 1
            self.query_one("#val", Static).update(self.format_value())
            self.post_message(self.Changed(self.value))

    def increment(self) -> None:
        if self.value < self.max_value:
            self.value += 1
            self.query_one("#val", Static).update(self.format_value())
            self.post_message(self.Changed(self.value))

    def on_key(self, event) -> None:
        if event.key == "left":
            self.decrement()
            event.stop()
        elif event.key == "right":
            self.increment()
            event.stop()


class MainMenu(Screen):
    """
    The main menu screen for Knight Energy.
    Contains config options on the left, game explanation on the right,
    and visual action buttons at the bottom.
    """

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        # Game configuration reactive states
        self.selected_difficulty = "Principiante"
        self.board_size = 8
        self.points_count = 7
        self.energies_count = 4
        self.player_energy = 7
        self.machine_energy = 7
        
        # Available points and energies (default values)
        self.points_val_str = "2, 3, 4, 5, 6, 8, 9"
        self.energies_val_str = "2, 3, 4, 5"

    def compose(self) -> ComposeResult:
        # Header area
        with Container(id="header-container"):
            yield AsciiTitle()

        # Body panels
        with Container(id="main-body"):
            
            # Left panel - Configuration
            with Vertical(id="config-panel"):
                with ScrollableContainer(id="config-scrollable"):
                    
                    # 1. Dificultad Row
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("DIFICULTAD", classes="row-title")
                            yield Static("Profundidad Minimax", classes="row-subtitle")
                        
                        with Container(id="difficulty-grid"):
                            with Vertical(classes="diff-col"):
                                yield Button("PRINCIPIANTE", id="btn-diff-principiante", classes="diff-btn -selected")
                                yield Static("2", classes="diff-depth")
                            with Vertical(classes="diff-col"):
                                yield Button("AMATEUR", id="btn-diff-amateur", classes="diff-btn")
                                yield Static("4", classes="diff-depth")
                            with Vertical(classes="diff-col"):
                                yield Button("EXPERTO", id="btn-diff-experto", classes="diff-btn")
                                yield Static("6", classes="diff-depth")

                    # 2. Tablero Tamaño Row
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("TABLERO", classes="row-title")
                            yield Static("Tamaño del tablero", classes="row-subtitle")
                        with Container(classes="row-control-container"):
                            yield ValueAdjuster(self.board_size, 5, 15, is_size=True, id="adj-board-size")

                    # 3. Tablero Puntos Row
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("TABLERO", classes="row-title")
                            yield Static("Casillas con puntos", classes="row-subtitle")
                        with Container(classes="row-control-container"):
                            yield ValueAdjuster(self.points_count, 1, 20, id="adj-points-count")

                    # 4. Tablero Energía Row
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("TABLERO", classes="row-title")
                            yield Static("Casillas de energía", classes="row-subtitle")
                        with Container(classes="row-control-container"):
                            yield ValueAdjuster(self.energies_count, 1, 20, id="adj-energies-count")

                    # 5. Energía Inicial - Jugador
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("ENERGÍA INICIAL", classes="row-title")
                            yield Static("Jugador (Tú - Morado)", classes="row-subtitle")
                        with Container(classes="row-control-container"):
                            yield ValueAdjuster(self.player_energy, 1, 20, id="adj-player-energy")

                    # 6. Energía Inicial - Máquina
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("ENERGÍA INICIAL", classes="row-title")
                            yield Static("Máquina (Blanco)", classes="row-subtitle")
                        with Container(classes="row-control-container"):
                            yield ValueAdjuster(self.machine_energy, 1, 20, id="adj-machine-energy")

                    # 7. Valores de Puntos
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("VALORES DE PUNTOS", classes="row-title")
                            yield Static("Valores disponibles", classes="row-subtitle")
                        with Horizontal(classes="row-control-container"):
                            yield Static(self.points_val_str, id="lbl-points-vals", classes="values-display")
                            yield Button("Editar", id="btn-edit-points", classes="edit-btn")

                    # 8. Valores de Energía
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("VALORES DE ENERGÍA", classes="row-title")
                            yield Static("Valores disponibles", classes="row-subtitle")
                        with Horizontal(classes="row-control-container"):
                            yield Static(self.energies_val_str, id="lbl-energies-vals", classes="values-display")
                            yield Button("Editar", id="btn-edit-energies", classes="edit-btn")

                    # 9. Opciones Avanzadas
                    with Horizontal(classes="config-row"):
                        with Vertical(classes="row-label-container"):
                            yield Static("OPCIONES AVANZADAS", classes="row-title")
                        with Container(classes="row-control-container"):
                            yield Button("▶ Expandir", id="btn-advanced", classes="edit-btn")
            
            # Right panel - Info
            with Vertical(id="info-panel"):
                yield Static("Dos caballos. Un tablero. Reúne puntos, recarga tu energía y supera a tu rival.", classes="info-desc")
                
                # Info Items
                with Container(classes="info-item"):
                    yield Static("★", classes="info-icon")
                    with Vertical(classes="info-text-container"):
                        yield Static("PUNTOS", classes="info-title")
                        yield Static("Obtén la cantidad indicada (2-9)", classes="info-detail")

                with Container(classes="info-item"):
                    yield Static("⚡", classes="info-icon")
                    with Vertical(classes="info-text-container"):
                        yield Static("ENERGÍA", classes="info-title")
                        yield Static("Recupera energía (2-5 unidades)", classes="info-detail")

                with Container(classes="info-item"):
                    yield Static("♞", classes="info-icon")
                    with Vertical(classes="info-text-container"):
                        yield Static("TURNO", classes="info-title")
                        yield Static("Cada movimiento cuesta 1 energía", classes="info-detail")

                with Container(classes="info-item"):
                    yield Static("-3", classes="info-icon")
                    with Vertical(classes="info-text-container"):
                        yield Static("PENALIZACIÓN", classes="info-title")
                        yield Static("Si no puedes moverte, pierdes el turno y -3 puntos", classes="info-detail")

                yield Static("La máquina juega con el caballo BLANCO.", id="machine-status-box")

        # Bottom actions
        with Container(id="actions-container"):
            yield Button("▶ INICIAR PARTIDA", id="btn-start", classes="action-btn")
            yield Button("⟳ RESTABLECER DEFAULTS", id="btn-reset", classes="action-btn")
            yield Button("✕ SALIR", id="btn-exit", classes="action-btn")

        # Footer
        yield Static("[↑↓] Navegar  [←→] Cambiar valor  [Enter] Seleccionar  [Q] Salir", id="footer-bar")

    def on_mount(self) -> None:
        # Set border titles and alignment dynamically in Python
        config_panel = self.query_one("#config-panel")
        config_panel.border_title = "CONFIGURACIÓN DE PARTIDA ✦"
        config_panel.border_title_align = "center"

        info_panel = self.query_one("#info-panel")
        info_panel.border_title = "ⓘ ACERCA DEL JUEGO"
        info_panel.border_title_align = "center"

    def on_button_pressed(self, event: Button.Pressed) -> None:
        button_id = event.button.id
        
        # Difficulty Selectors
        if button_id in ("btn-diff-principiante", "btn-diff-amateur", "btn-diff-experto"):
            # Reset selections
            self.query(".diff-btn").remove_class("-selected")
            event.button.add_class("-selected")
            
            if button_id == "btn-diff-principiante":
                self.selected_difficulty = "Principiante"
            elif button_id == "btn-diff-amateur":
                self.selected_difficulty = "Amateur"
            elif button_id == "btn-diff-experto":
                self.selected_difficulty = "Experto"

        # Action buttons
        elif button_id == "btn-start":
            # Fire app hook
            self.app.on_start_game(self.selected_difficulty)
        
        elif button_id == "btn-reset":
            self.reset_defaults()
            
        elif button_id == "btn-exit":
            self.app.exit()

        # Placeholders for edits
        elif button_id in ("btn-edit-points", "btn-edit-energies", "btn-advanced"):
            # Show a print status or mock action
            print(f"Action triggered on: {button_id}")

    def on_value_adjuster_changed(self, event: ValueAdjuster.Changed) -> None:
        adjuster_id = event.control.id
        if adjuster_id == "adj-board-size":
            self.board_size = event.value
        elif adjuster_id == "adj-points-count":
            self.points_count = event.value
        elif adjuster_id == "adj-energies-count":
            self.energies_count = event.value
        elif adjuster_id == "adj-player-energy":
            self.player_energy = event.value
        elif adjuster_id == "adj-machine-energy":
            self.machine_energy = event.value

    def reset_defaults(self) -> None:
        # Reset difficulty
        self.query(".diff-btn").remove_class("-selected")
        self.query_one("#btn-diff-principiante", Button).add_class("-selected")
        self.selected_difficulty = "Principiante"

        # Reset adjusters
        self.board_size = 8
        self.points_count = 7
        self.energies_count = 4
        self.player_energy = 7
        self.machine_energy = 7

        self.query_one("#adj-board-size", ValueAdjuster).update_value(8)
        self.query_one("#adj-points-count", ValueAdjuster).update_value(7)
        self.query_one("#adj-energies-count", ValueAdjuster).update_value(4)
        self.query_one("#adj-player-energy", ValueAdjuster).update_value(7)
        self.query_one("#adj-machine-energy", ValueAdjuster).update_value(7)
