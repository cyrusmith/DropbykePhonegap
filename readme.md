1) Run in project folder "gulp"
2) Run in www folder r.js.cmd -o optimize=none

3) Create android app, execute this on cmd:

SET FB_APP_ID=123
call rmdir /S /Q Dropbike
call cordova create Dropbike
call cd Dropbike
call cordova platform add android
call cordova plugin add com.ionic.keyboard
call cordova plugin add org.apache.cordova.camera
call cordova plugin add org.apache.cordova.device
call cordova plugin add org.apache.cordova.geolocation
call cordova plugin add org.apache.cordova.network-information
call cordova plugin add org.apache.cordova.file-transfer
call cordova -d plugin add d:\tmp\phonegap-facebook-plugin --variable APP_ID="%FB_APP_ID%" --variable APP_NAME="Dropbike"

4) Copy contents of www folder to assets folder of android project

5) Import in eclipse Dropbike\platforms\android and run