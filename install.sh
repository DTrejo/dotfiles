#!/bin/sh

BASE=${PWD}

for x in $BASE/dot-* ; do
  fname=$(basename $x)
  realdot=$(echo $fname | sed -e 's/^dot-/./')

  if [ -f ~/$realdot ]; then
    echo Moving ~/$realdot to ~/$realdot.old$(date +%m%d%H%M%Y.%S)
    mv $HOME/$realdot $HOME/$realdot.old
  fi

  echo Linking ~/$realdot to $x
  ln -s $x $HOME/$realdot

done

echo Also Linking ~/bin to $BASE/bin
ln -s $BASE/bin $HOME/bin

echo "create ~/.private, a place to put secrets"
touch $HOME/.private

echo "Editing ~/.zshrc so it sources ~/.profile"
echo "" >> $HOME/.zshrc
echo "# use github.com/dtrejo/dotfiles" >> $HOME/.zshrc
echo 'source $HOME/.profile' >> $HOME/.zshrc
