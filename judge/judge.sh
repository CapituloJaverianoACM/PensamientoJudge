#!/bin/bash
#Parameters
# $1 problemIn
# $2 expectedOut
# $3 programOutput
# $4 PathProgramExec
# $5 Time Limit

echo "run case $1";
echo "$1 $2 $3 $4 $5"
timeout "$5"s "$4" < "$1" > "$3" || { code="$?"  && if [ "$code" == 124 ];
  then exit 124;
  else exit 248;
  fi ;
};
diff -w "$3" "$2" || exit 64
