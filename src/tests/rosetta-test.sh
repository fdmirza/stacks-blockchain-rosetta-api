#!/usr/bin/env bash
set -o nounset -o pipefail -o errexit

# Kill all dangling processes on exit.
cleanup() {
    printf "${OFF}"
    pkill -P $$ || true
}
trap "cleanup" EXIT

# ANSI escape codes to brighten up the output.
GRN=$'\e[32;1m'
OFF=$'\e[0m'
rosetta="${HOME}/go/bin/rosetta-cli"
function checkData() {
    printf "${GRN}### Run rosetta-cli check:data${OFF}\n"
    printf "${rosetta}"
    "${rosetta}" check:data --configuration-file rosetta-cli-config/rosetta-config.json &
    dataCheckPID=$!

    # injecting some test transactions
    npm run rosetta:test
    sleep 10 #wait for the last candidate action

    while ps -p $dataCheckPID &>/dev/null; do
        sleep 10
    done
    printf "${GRN}### Run rosetta-cli check:data succeeded${OFF}\n"
}

printf "${GRN}### Start testing${OFF}\n"

checkData

printf "${GRN}### Tests finished.${OFF}\n"
