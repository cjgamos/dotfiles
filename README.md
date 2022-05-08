# My Personal Dotfiles

**Warning**: This is my personal dotfiles don't copy unless you know what you are doing

---
## i3wm Dependencies / Configs

[i3wm](https://i3wm.org/) - A tiling window manager, completely written from scratch.

[Polybar](https://github.com/polybar/polybar) - A fast and easy-to-use tool for creating status bars.

[Rofi](https://github.com/davatorium/rofi) - A window switcher, Application launcher and dmenu replacement.

[Picom](https://github.com/ibhagwan/picom/tree/next-rebase) - a compositor for X, and a fork of [Compton](https://github.com/yshui/picom/blob/next/History.md).

[Alacritty](https://github.com/alacritty/alacritty) - A fast, cross-platform, OpenGL terminal emulator

[Nitrogen](https://wiki.archlinux.org/title/Nitrogen) - A fast and lightweight (GTK2) desktop background browser and setter for X Window.

[Scrot](https://github.com/resurrecting-open-source-projects/scrot) - A command line screen capture utility

[Ranger](https://github.com/ranger/ranger) - A console file manager with VIM key bindings. It provides a minimalistic and nice curses interface with a view on the directory hierarchy.


---

## Vim Setup

[vim plug](https://github.com/junegunn/vim-plug) - A minimalist Vim plugin manager

[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) - A collection of configurations for Neovim's built-in LSP

[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) - [Treesitter](https://github.com/tree-sitter/tree-sitter) configurations and abstraction layer for Neovim

[nvim-cmp](https://github.com/hrsh7th/nvim-cmp) - A completion plugin for neovim coded in Lua

[nvim-ts-autotag](https://github.com/windwp/nvim-ts-autotag) - An autoclose and autorename html tag

[lspsaga.nvim](https://github.com/tami5/lspsaga.nvim) - A light-weight LSP plugin based on Neovim built-in LSP with highly a performant UI

[nvim-lsp-installer](https://github.com/williamboman/nvim-lsp-installer) - An LSP server installer
 * It is used for installing an LSP server for Tailwind CSS
 
[telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) - A highly extendable fuzzy finder over lists

[defx.nvim](https://github.com/Shougo/defx.nvim) - A file explorer for Neovim

---

## Zsh Plugins

### Autocomplete 
Git Clone the `zsh-autocomplete` plugin in the OhMyZsh plugin folder.

```
$ sudo git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Once that is done, add the plugin in the `~/.zshrc` file's plugin list.
```
plugins=(
  ...
  zsh-autosuggestions
)
```

### Zsh Syntax Highlighting
Git Clone the `zsh-syntax-highlighting` plugin in the OhMyZsh plugin folder.

```
$ sudo git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

And once again add it in the plugins list of the `.zshrc` file.

```
plugins=(
  ... 
  zsh-syntax-highlighting
)
```
> Note: To reflect every change you make, do `source ~/.zshrc` in the terminal.

---
## Installation

> If you really want to install it. Make sure you understand everything.
> **WARNING: MAKE SURE TO MAKE A BACKUP BEFORE DOING SO** 

Copy paste this code, then just move the files.
```
git clone https://github.com/cjgamos/dotfiles.git
```

---

## Screenshots

![image1Left](https://github.com/cjgamos/dotfiles/blob/main/Screenshots/1Left.png)
![image1Right](https://github.com/cjgamos/dotfiles/blob/main/Screenshots/1Right.png)
![image2](https://github.com/cjgamos/dotfiles/blob/main/Screenshots/2.png)
![image3](https://github.com/cjgamos/dotfiles/blob/main/Screenshots/3.png)






