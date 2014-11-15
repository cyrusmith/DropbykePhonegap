1) Run in project folder "gulp"
2) Run in www folder r.js.cmd -o optimize=none

3) Create android app, execute this on cmd:

SET FB_APP_ID=123
call rmdir /S /Q Dropbyke
call cordova create Dropbyke com.dropbyke Dropbyke
call cd Dropbyke
call cordova platform add android
call cordova plugin add com.ionic.keyboard
call cordova plugin add org.apache.cordova.camera
call cordova plugin add org.apache.cordova.device
call cordova plugin add org.apache.cordova.geolocation
call cordova plugin add org.apache.cordova.network-information
call cordova plugin add org.apache.cordova.file-transfer
call cordova plugin add org.apache.cordova.inappbrowser
call cordova plugin add https://github.com/cyrusmith/cordova-gps-checker.git
call cordova -d plugin add d:\Workspace\InteroSite\projects\PGDropbike\phonegap-facebook-plugin\ --variable APP_ID="%FB_APP_ID%" --variable APP_NAME="Dropbike"

4) Copy contents of www folder to assets folder of android project

5) Import in eclipse Dropbike\platforms\android and run


Setup ubuntu server

1) Install tomcat
sudo apt-get update
sudo apt-get install tomcat7
sudo apt-get install tomcat7

Edit manager users:
sudo nano /etc/tomcat7/tomcat-users.xml

Execute:
sudo nano /etc/defaults/tomcat7

Add these lines:
JAVA_OPTS="${JAVA_OPTS} -Xms128m -Xmx512m -XX:MaxPermSize=512m -server"

And optionally:
JAVA_OPTS="${JAVA_OPTS} -Dcom.sun.management.jmxremote"
JAVA_OPTS="${JAVA_OPTS} -Dcom.sun.management.jmxremote.port=9991"
JAVA_OPTS="${JAVA_OPTS} -Dcom.sun.management.jmxremote.authenticate=false"
JAVA_OPTS="${JAVA_OPTS} -Dcom.sun.management.jmxremote.ssl=false"
JAVA_OPTS="${JAVA_OPTS} -Dcom.sun.management.jmxremote.local.only=false"
JAVA_OPTS="${JAVA_OPTS} -Djava.rmi.server.hostname=<ec2 instance domain address>"


2) Install mysql
sudo apt-get install mysql-server
sudo apt-get install automysqlbackup

mysql -u root -p --execute="DROP DATABASE dropbike; CREATE DATABASE dropbike CHARACTER SET utf8 COLLATE utf8_general_ci;"
