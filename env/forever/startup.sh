#!/bin/bash
# chkconfig: 345 88 08
# description: Forever for Node.js

FOREVER_USER=deploy
FOREVER_DIR=/var/log/forever
FOREVER_CONFIG=/var/www/deploy/forever/forever.json

execute() {
    su - $FOREVER_USER -c "FOREVER_ROOT=$FOREVER_DIR $1"
}

case "$1" in
    start)
        execute "forever start $FOREVER_CONFIG"
        ;;
    stopall)
        execute "forever stopall"
        ;;
    restartall)
        execute "forever restartall"
        ;;        
    list)
        execute "forever list"
        ;;
    *)
        echo "Usage: /etc/init.d/forever {start|stopall|restartall|list}"
        exit 1
        ;;
esac
