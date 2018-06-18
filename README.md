# Jsmpeg-stream-server

`npm install`

Start stream server

`nodemon websocket-relay-server.js 8081 8082`


Start admin page
`node app.js`


Navigate browser to `localhost:3000`


push stream

On Linux: `ffmpeg -f x11grab -video_size 1920x1080 -i :0.0+1920,0 -codec:v mpeg1video -codec:a mp2 -f mpegts "http://127.0.0.1:8081/myapp/mystream"`


