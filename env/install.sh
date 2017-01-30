#/bin/bash

rpm -ivh http://epel.mirror.net.in/epel/6/i386/epel-release-6-8.noarch.rpm

yum install -y npm --enablerepo=epel
npm install -g npm
npm -v

npm cache clean -f
npm install -g n
n stable
node -v 

npm install forever -g
forever --version

npm install --global babel-cli@6.3.15
npm install --global browserify@12.0.1
npm install --global babelify@7.2.0

# www
mkdir /var/log/forever
chown deploy:deploy /var/log/forever

mkdir -p /var/www/deploy/forever
chown deploy:deploy /var/www/deploy/forever

mkdir -p /var/www/deploy/smart-logistic; cd /var/www/deploy/smart-logistic
ln -s ../forever/node_modules .
chown deploy:deploy /var/www/deploy/smart-logistic

cp /usr/projects/base-app/env/forever/startup.sh /etc/init.d/forever
chmod 755 /etc/init.d/forever
chkconfig --add forever
chkconfig forever on
/etc/init.d/forever start

    su - deploy -c "FOREVER_ROOT=/var/log/forever forever list"
    su - deploy -c "FOREVER_ROOT=/var/log/forever forever logs"
    su - deploy -c "FOREVER_ROOT=/var/log/forever forever restart smart-logistic"
    su - deploy -c "FOREVER_ROOT=/var/log/forever forever start /var/www/deploy/forever/forever.json"
    su - deploy -c "FOREVER_ROOT=/var/log/forever forever stopall"

# logrotate
cp /usr/projects/base-app/env/logrotate/forever /etc/logrotate.d/
chmod 644 /etc/logrotate.d/forever

