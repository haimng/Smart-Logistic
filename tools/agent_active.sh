#!/bin/bash

function main()
{
  local host=$h
  local domain=$d
  local version=$v
  local deploy_dir=/var/www/deploy/$domain
  local forever=../forever

  pushd $deploy_dir

  echo "Agent: switch active"
  rm -f active
  ln -s $version active

  mkdir -p $forever
  \cp -f active/package.json $forever/
  \cp -f active/forever-${host}.json $forever/forever.json
  
  cd $forever
  npm install
  npm update

  FOREVER_ROOT=/var/log/forever forever restart $domain

  popd
}

main "$@"
