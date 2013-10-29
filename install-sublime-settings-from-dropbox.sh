#!/bin/sh

BASE=${PWD}

SUBL_SETTINGS="$HOME/Library/Application Support/Sublime Text 3/Packages/User"

echo $BASE/sublime-settings

for x in $BASE/sublime-settings/* ; do
  fname=$(basename "$x")
  realdot=$(echo "$fname")

  if [ -f "$SUBL_SETTINGS/$realdot" ]; then
    echo Moving "$SUBL_SETTINGS/$realdot" to "$SUBL_SETTINGS/$realdot".old`date +%m%d%H%M%Y.%S`
    mv "$SUBL_SETTINGS/$realdot" "$SUBL_SETTINGS/$realdot".old`date +%m%d%H%M%Y.%S`
  fi

  echo Linking "$SUBL_SETTINGS/$realdot" to $x
  ln -s "$x" "$SUBL_SETTINGS/$realdot"

done
