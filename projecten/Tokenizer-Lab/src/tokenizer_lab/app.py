"""Minimal application bootstrap for Tokenizer Lab."""

import tkinter as tk


def create_app() -> tk.Tk:
    root = tk.Tk()
    root.title("Tokenizer Lab")
    tk.Label(root, text="Tokenizer Lab").pack(padx=24, pady=24)
    return root


def main() -> None:
    create_app().mainloop()


if __name__ == "__main__":
    main()
