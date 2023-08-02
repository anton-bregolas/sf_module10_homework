const websocketURL = "wss://echo-ws-service.herokuapp.com";

const inputPanel = document.querySelector(".input-container");
const outputBox = document.querySelector(".output-container");
const inputBox = inputPanel.querySelector(".chat-input")
const sendBtn = inputPanel.querySelector(".btn-send");
const geoBtn = inputPanel.querySelector(".btn-geo");

let ws;
let connected = 0;

function wsConnect() {
  ws = new WebSocket(websocketURL);

  ws.onopen = function(evt) {
    console.log("Connected to server!");
    showUserMsg("Connected to server!", "log");
    connected = 1;
  };

  ws.onclose = function(evt) {
    console.log("Disconnected from server!");
    showUserMsg("Connection lost!", "error");
    connected = 0;
  };

  ws.onmessage = function(evt) {
    if (evt.data !== `[object GeolocationPosition]`)
    {
      console.log(`Received message: '${evt.data}'`);
      showUserMsg(evt.data, "echo");
    }
  };

  ws.onerror = function(evt) {
    console.log(`Error message: '${evt.data}'`);
    showUserMsg(evt.data, "error");
  };
}

function initButtons() {

  sendBtn.addEventListener('click', () => {

    sendMessage();

  });
  
  geoBtn.addEventListener('click', () => {

    sendGeo();

  });
}

function sendMessage() {

  let msg = inputBox.value;

  if (msg && connected == 1) {

    switch(msg) {

      case "/disconnect":
        console.log('Disconnecting from server...');
        ws.close();
        ws = null;
        break;

      case "/connect":
        console.log('Active connection detected!');
        showUserMsg("Already connected!", "error");
        break;

      case "/help":
        console.log('Displaying help message...');
        showUserMsg(`
        {any}: get echo server response
        /disconnect: close connection
        /connect: reconnect to server
        /help: view list of commands
        `, "user");
        break;

      default:
        console.log(`Sending '${msg}' to server...`);
        showUserMsg(msg, "user");
        ws.send(msg);
    }

  } else if (msg && connected == 0) {

    switch(msg) {

      case "/connect":
        console.log('Connecting to server...');
        wsConnect();
        break;
      
      case "/help":
        console.log('Displaying help message...');
        showUserMsg(`
        /connect: reconnect to server
        /help: view list of commands
        `, "user");
        break;

      default:
        console.log('No connection detected!');
        showUserMsg("Not connected to the server!", "error");
    }
  }

  inputBox.value = "";
}

function sendGeo() {

  const geoError = () => {
    console.log('Error getting geolocation data!');
    showUserMsg("Unable to get geolocation!", "error");
  }

  const geoSuccess = (position) => {
    console.log('Getting coordinates:', position);
    ws.send(position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    showUserMsg(`
    My latitude is ${latitude}° and
    my longitude is ${longitude}°
    `, "user");

    showUserMsg(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`, `user`, true);
  }

  if (!navigator.geolocation) {
    console.log('Error getting geolocation data!');
    showUserMsg("Geolocation is not supported", "error");
  } else {
    console.log('Getting geolocation data…');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }

}

function listenEnterKey() {
  inputPanel.addEventListener("keyup", (event) => {
   if (event.key === "Enter" && inputBox.value) {
    console.log("Enter key pressed.");
    sendMessage();
   }
  });
}

function showUserMsg(msg, type, geo) {
  let userBubble = document.createElement("div");
  let userText = document.createTextNode(msg);

  if (type === "user") {
    userBubble.classList = "bubble bubble-input";
  } else if (type === "error") {
    userBubble.classList = "bubble bubble-output error";
  } else if (type === "echo") {
    userBubble.classList = "bubble bubble-output echo";
  } else {
    userBubble.classList = "bubble bubble-output";
  }
  outputBox.appendChild(userBubble);
  if (geo) {
    let geoLink = document.createElement("a");
    let geoText = document.createTextNode("Geolocation");
    geoLink.setAttribute("href", msg);
    geoLink.setAttribute('target', '_blank');
    userBubble.appendChild(geoLink).appendChild(geoText);
    
  } else {
    userBubble.appendChild(userText);
  }
  outputBox.scrollTop = outputBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {

  wsConnect();

  initButtons();

  listenEnterKey();
  
});



