# Knight Energy - Proyecto 2 (Inteligencia Artificial)

**Knight Energy** es un juego de estrategia por turnos para dos jugadores (Blancas vs. Negras), en el cual cada uno controla un caballo de ajedrez sobre un tablero de $8 \times 8$.

---

## 📖 Contexto del Proyecto

Para conocer en detalle el contexto, las reglas del juego y los requerimientos del proyecto, por favor consulta el enunciado oficial: **[Proyecto2 2026-I.pdf](Proyecto2%202026-I.pdf)**.

---

## 🚀 Cómo Ejecutar el Proyecto

Sigue estos pasos para configurar el entorno virtual e iniciar el juego:

1. **Crear el entorno virtual (venv):**
   ```bash
   python -m venv .venv
   ```

2. **Activar el entorno virtual:**
   * **En Windows (PowerShell):**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   * **En Windows (Símbolo del sistema / CMD):**
     ```cmd
     .\.venv\Scripts\activate.bat
     ```
   * **En Linux / macOS:**
     ```bash
     source .venv/bin/activate
     ```

3. **Instalar dependencias (requirements.txt):**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar el juego:**
   * **Modo Interfaz Gráfica (Eel / Navegador Web):**
     ```bash
     python main.py
     ```
   * **Modo Consola / Terminal:**
     ```bash
     python terminal_ui.py
     ```

---

## 🏗️ Arquitectura del Proyecto

El código está estructurado de manera modular y limpia en las siguientes carpetas:

* 📂 **`model/`**: Contiene la definición del estado del juego y las reglas de transición.
  * [board_generator.py](model/board_generator.py): Sortea de manera aleatoria y sin colisiones la distribución inicial de casillas de puntos, energía y las posiciones de los caballos.
  * [knight.py](model/knight.py): Modela las propiedades de cada caballo (color, posición, puntos, energía) y calcula los movimientos posibles en L.
  * [state.py](model/state.py): Estructura inmutable que captura una "foto" del juego en un instante dado (posición de elementos, estado de los caballos y turno actual).
  * [game.py](model/game.py): Contiene las reglas del juego. Define las transiciones de estado de forma pura y funcional (clonando estados). Aquí residen funciones cruciales como `apply_move`, `apply_skip` e `is_terminal`.
* 📂 **`ai/`**: Cerebro de la Inteligencia Artificial del juego.
  * [mini_max.py](ai/mini_max.py): Implementa la búsqueda recursiva con el algoritmo **Minimax y poda Alfa-Beta** para decidir el mejor movimiento del agente.
  * [heuristic.py](ai/heuristic.py): Define la evaluación de las hojas de búsqueda. Cuenta con una heurística simple (diferencia básica de puntos y energía) y una compleja (normalizada, con pesos dinámicos y cálculo de distancias por BFS hacia las casillas de energía más cercanas).
* 📂 **`controller/`**: Orquestación y control del flujo.
  * [game_controller.py](controller/game_controller.py): Controlador encargado de coordinar los turnos. Determina si juega un humano o la IA, maneja el historial de jugadas (para la opción de Deshacer / Undo) e interactúa mediante callbacks reactivos con la interfaz de usuario.
* 📂 **`ui/`**: Interfaz de usuario (Eel y Web).
  * [app.py](ui/app.py): Archivo Python que inicializa el servidor local de Eel exponiendo funciones nativas de Python hacia el Frontend JS.
  * 📂 **`web/`**: Recursos estáticos del Frontend (HTML, CSS dinámico, JS) encargados de renderizar visualmente el tablero en el navegador web.

---

## 🔄 Flujo del Juego (Paso a Paso)

```text
[Inicio: main.py] ➔ [ui/app.py: start_gui] ➔ [Interfaz Web: Configuración]
                                                      │
                                                      ▼
[Crear State inicial] ◀── [model/board_generator.py] ◀┘
         │
         ▼
[Inicializar GameController]
         │
         ▼
 ┌──▶ [controller/game_controller.py: process_turn]
 │       │
 │       ▼
 │    ¿Es Estado Terminal? ── Sí ──▶ [Notificar fin del juego a UI y Detener]
 │       │
 │      No
 │       ▼
 │    ¿Debe hacer Skip (sin energía)?
 │       ├── Sí ──▶ [Aplicar Skip: -3 puntos] ──┐
 │       │                                     │
 │      No                                     │
 │       ▼                                     │
 │    ¿Es el turno de la IA?                   │
 │       ├─ Sí ──▶ [Calcular en ai/mini_max.py] ─▶ [Aplicar movimiento] ──┐
 │       │            (Evalúa con ai/heuristic.py)                      │
 │       │                                                              │
 │      No (Turno Humano)                                               │
 │       └─ Esperar a UI ➔ [Jugar movimiento en UI] ➔ [Aplicar mov] ────┤
 │                                                                      │
 └──────────────────────────────────────────────────────────────────────┘
```

1. **Inicialización:** Al arrancar el programa desde [main.py](main.py), se llama a `start_gui()` de [ui/app.py](ui/app.py), el cual levanta una ventana de navegador usando Chrome/Edge en modo app.
2. **Creación del Escenario:** Al presionar "Iniciar Juego", el frontend envía los parámetros a `start_game_backend()` en Python. Este invoca a `generate_initial_layout()` en [board_generator.py](model/board_generator.py) para distribuir de manera aleatoria los elementos, y luego construye el `State` inicial.
3. **Control del Bucle de Juego:** Se instancia el `GameController` y se arranca la partida. El método `process_turn()` en [game_controller.py](controller/game_controller.py) evalúa el turno actual de la siguiente manera:
   - **Verificación:** Llama a `is_terminal(state)` y a `must_skip(state)` (de [game.py](model/game.py)).
   - **Si le toca a la IA:** Llama a `get_best_move()` de [mini_max.py](ai/mini_max.py). Este genera el árbol minimax hasta la profundidad indicada, utilizando una de las funciones en [heuristic.py](ai/heuristic.py) para evaluar las hojas de juego. Una vez decidida la mejor jugada, se ejecuta `apply_move()` en la lógica del juego.
   - **Si le toca al Humano:** El controlador suspende su bucle automático y espera de forma pasiva a que el Frontend (vía Eel) llame a `play_human_move_backend()`.
4. **Actualización de la UI:** Con cada cambio de estado, el controlador dispara el callback `on_state_changed()`, enviando una representación serializada del tablero a la interfaz de usuario en JS para volver a dibujar el HTML dinámicamente y mostrar los movimientos permitidos.
