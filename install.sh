#!/bin/sh

BASE=$(readlink -f $(pwd))

for x in $BASE/dot-* ; do
  fname=$(basename $x)
  realdot=$(echo $fname | sed -e 's/^dot-/./')

  if [ -f ~/$realdot ]; then
    echo Moving ~/$realdot to ~/$realdot.old`date +%m%d%H%M%Y.%S`
    mv $HOME/$realdot $HOME/$realdot.old
  fi

  echo Linking ~/$realdot to $x
  ln -s $x $HOME/$realdot

done
