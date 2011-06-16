alias editprofile='mate_wait ~/.profile;. ~/.profile'
alias o='open .'
alias m='mate .'
alias difflast='git diff HEAD^ HEAD > ~/Desktop/diff.diff'

export HISTCONTROL=ignoredups
export HISTSIZE=10000000
export HISTFILESIZE=10000000
export EDITOR="mate_wait"
export VISUAL="mate_wait"
export PAGER="less"
export CLICOLOR="yes"
export PROMPT_COLOR='1;1;40m';
export PS1="\h:\W \u\$ " # default

parse_git_branch() {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
# ~/dev/dotfiles(my-branch-name)§ 
export PS1="\w\[\e[0;33;49m\]\$(parse_git_branch)\[\e[0;0m\]§ "



#
# Random stuff
#

# start server
alias pr='post-review'
alias pgstart='/opt/local/lib/postgresql84/bin/pg_ctl -D /opt/local/var/db/postgresql84/defaultdb -l logfile start'

export MAVEN_OPTS="-server -Xms256m -Xmx512m"
