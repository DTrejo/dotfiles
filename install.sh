#!/bin/sh

BASE=$(readlink -f $(pwd))

for x in $BASE/dot-* ; do
  fname=$(basename $x)
  realdot=$(echo $fname | sed -e 's/^dot-/./')
  echo Linking ~/$realdot to $x
  ln -s $x $HOME/$realdot
done
