from textual.widgets import Static
from textual.reactive import reactive

class AsciiTitle(Static):
    """
    A custom widget that displays the Knight Energy ASCII art title.
    Includes the detailed chess knight profile on the left,
    and the text KNIGHT ENERGY stacked on the right.
    """

    def render(self) -> str:
        # 17 lines of the chess knight ascii art
        horse_lines = [
            "         ,....,       ",
            "      ,::::::<        ",
            "     ,::/^\\\"``.       ",
            "    ,::/, `   e`.     ",
            "   ,::; |        '.   ",
            "   ,::|  \\___,-.  c)  ",
            "   ;::|     \\   '-'   ",
            "   ;::|      \\        ",
            "   ;::|   _.=`\\       ",
            "   `;:|.=` _.=`\\      ",
            "     '|_.=`   __\\     ",
            "     `\\_..==`` /      ",
            "      .'.___.-'.      ",
            "     /          \\     ",
            "    ('--......--')    ",
            "    /'--......--'\\    ",
            "    `\"--......--\"     "
        ]

        # 6 lines of KNIGHT
        knight_lines = [
            "██╗  ██╗███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗",
            "██║ ██╔╝████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝",
            "█████╔╝ ██╔██╗ ██║██║██║  ███╗███████║   ██║   ",
            "██╔═██╗ ██║╚██╗██║██║██║   ██║██╔══██║   ██║   ",
            "██║  ██╗██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ",
            "╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   "
        ]

        # 6 lines of ENERGY
        energy_lines = [
            "███████╗███╗   ██╗███████╗██████╗  ██████╗ ██╗   ██╗",
            "██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝ ╚██╗ ██╔╝",
            "█████╗  ██╔██╗ ██║█████╗  ██████╔╝██║  ███╗ ╚████╔╝ ",
            "██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║  ╚██╔╝  ",
            "███████╗██║ ╚████║███████╗██║  ██║╚██████╔╝   ██║   ",
            "╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   "
        ]

        # Slogan line
        slogan = "[purple]ESTRATEGIA. MOVIMIENTO. ENERGÍA. VICTORIA.[/]"

        # Combine horse and title text line-by-line
        combined_lines = []
        for i in range(17):
            horse = horse_lines[i]
            
            # Center the 12 lines of text (2 blank, 6 knight, 1 blank, 6 energy, 2 blank)
            if 2 <= i < 8:
                txt = f"[white]{knight_lines[i-2]}[/]"
            elif i == 8:
                txt = " " * 52
            elif 9 <= i < 15:
                txt = f"[purple]{energy_lines[i-9]}[/]"
            else:
                txt = " " * 52
                
            combined_lines.append(f"[purple]{horse}[/]   {txt}")

        content = "\n".join(combined_lines) + "\n\n" + f"[bold]{slogan}[/]"
        return content
