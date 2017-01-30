#!/bin/bash

# Be verbose and exit on any error
set -o errexit
set -o pipefail
set -o xtrace

function main()
{
  local domain=${PWD##*/}
  local version="`date +\%Y\%m\%d\%H\%M\%S`"
  local agent_unzip=tools/agent_unzip.sh
  local agent_active=tools/agent_active.sh
  local agent_user=deploy
  local agent_hosts='tadu1'
  local agent_port=7878
  
  # build  
  npm run clean
  npm run build

  # zip the ball
  \cp -f package.json build/
  \cp -f env/forever/forever-*.json build/
  zip -r $version.zip build/

  # send the ball to servers and unzip it there
  for host in ${agent_hosts}; do
    echo "Send the ball to host: $host"
    scp -P $agent_port $version.zip $agent_user@$host:/var/www/deploy/$domain/

    echo "Unzip the ball in host: $host"
    ssh -p $agent_port $agent_user@$host d=$domain v=$version 'bash -s' < $agent_unzip
  done

  # switch active
  for host in ${agent_hosts}; do
    echo "Switch active in host: $host"
    ssh -p $agent_port $agent_user@$host h=$host d=$domain v=$version 'bash -s' < $agent_active
  done

  rm -f $version.zip
}

main "$@"

