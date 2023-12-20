var notificationSocket = {};
var greenhouseSocket ={};
var notificationSocketReceived=false;
var greenhouseSocketReceived=false;


function getNotificationWebSocket(newsocket){
    notificationSocket=newsocket;
    notificationSocketReceived=true;
    console.log("Websocket for Notifications"+notificationSocket.id);
}

function getGreenhouseWebSocket(newsocket){
    greenhouseSocket=newsocket;
    greenhouseSocketReceived=true;
    console.log("Websocket for Greenhouse"+greenhouseSocket.id);
}

async function sendWebsocket(type) {
    
    if (type ='newNotification' && notificationSocketReceived){
        notificationSocket.emit("notificationData","newNotification"); 
    }
    if (type ='greeenhouseData' && greenhouseSocketReceived){
        greenhouseSocket.emit("greeenhouseData","newGreeenhouseData"); 
    }

}




module.exports = { sendWebsocket, getNotificationWebSocket, getGreenhouseWebSocket };
