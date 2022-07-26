# DTrejo's Dotfiles

Some of my dotfiles. Feel free to browse. I recommend copy-pasting rather
running the install script, so you know what's going on. Targets zsh.

Run

    # git clone this repo
    cd dotfiles
    chmod +x install.sh
    ./install.sh

to install.

## What it looks like

![Screenshot of my terminal](https://user-images.githubusercontent.com/56119/27526564-aa5e7c32-59fb-11e7-865b-46ee64874a62.png)

## What will it do?

- install my ~/.profile, ~/.gitconfig, and ~/.gitignore
- move your own versions of scripts into backup files
- install command line tools from npm that I find handy
- Set up **[ampline](https://github.com/DTrejo/ampline)** - which will make you way **faster with the git CLI**.

## TODO

- recommend `brew install nvm`
- recommend `npm -g i ampline`
- Rewrite install script in node so there's fewer bugs w/ it
- Don't forget to symlink `~/bin` to `./bin`
