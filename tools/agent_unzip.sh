#!/bin/bash
# Run on webs: unzip, switch active

function main()
{
  local domain=$d
  local version=$v
  local deploy_dir=/var/www/deploy/$domain

  pushd $deploy_dir
  
  echo "Agent: unzip $version.zip"
  unzip $version.zip
  mv -f build $version
  rm -f $version.zip
    
  popd 
}

main "$@"
