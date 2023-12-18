var notificationSocket = {};
var greenhouseSocket ={};

function getNotificationWebSocket(newsocket){
    notificationSocket=newsocket;
    console.log("Websocket for Notifications"+notificationSocket.id);
}

function getGreenhouseWebSocket(newsocket){
    greenhouseSocket=newsocket;
    console.log("Websocket for Greenhouse"+greenhouseSocket.id);
}

async function sendWebsocket(type) {
    
    if (type ='newNotification'){
        notificationSocket.emit("notificationData","newNotification"); 
    }
    if (type ='greeenhouseData'){
        notificationSocket.emit("greeenhouseData","newGreeenhouseData"); 
    }

}




module.exports = { sendWebsocket,getNotificationWebSocket,getGreenhouseWebSocket };
