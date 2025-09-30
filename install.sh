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

# Handle home-* files that go into subdirectories
for x in $BASE/home-* ; do
  fname=$(basename $x)
  # Extract the subdirectory and filename from home-DIRNAME-FILENAME pattern
  # e.g., home-CLAUDE.md -> .claude/CLAUDE.md
  subdir_and_file=$(echo $fname | sed -e 's/^home-//')

  if [[ "$fname" == "home-CLAUDE.md" ]]; then
    target_dir="$HOME/.claude"
    target_file="$target_dir/CLAUDE.md"

    # Create directory if it doesn't exist
    mkdir -p "$target_dir"

    if [ -f "$target_file" ] || [ -L "$target_file" ]; then
      echo Moving $target_file to $target_file.old$(date +%m%d%H%M%Y.%S)
      mv "$target_file" "$target_file.old"
    fi

    echo Linking $target_file to $x
    ln -s $x "$target_file"
  fi
done

echo Also Linking ~/bin to $BASE/bin
ln -s $BASE/bin $HOME/bin

echo "create ~/.private, a place to put secrets"
touch $HOME/.private

echo "Editing ~/.zshrc so it sources ~/.profile"
echo "" >> $HOME/.zshrc
echo "# use github.com/dtrejo/dotfiles" >> $HOME/.zshrc
echo 'source $HOME/.profile' >> $HOME/.zshrc
