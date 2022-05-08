# My Personal Dotfiles

**Warning**:This is my personal dotfiles don't copy unless you know what you are doing

---
test
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

[defx.nvim](https://github.com/Shougo/defx.nvim) - A file explorer

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










