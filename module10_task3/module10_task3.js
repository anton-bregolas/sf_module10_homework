const websocketURL = "wss://echo-ws-service.herokuapp.com";

const inputPanel = document.querySelector(".input-container");
const outputBox = document.querySelector(".output-container");
const inputBox = inputPanel.querySelector(".chat-input")
const sendBtn = inputPanel.querySelector(".btn-send");
const geoBtn = inputPanel.querySelector(".btn-geo");

let ws;

function wsConnect() {
  ws = new WebSocket(websocketURL);

  ws.onopen = function(evt) {
    console.log("Connected to server!");
    showUserMsg("Connected to server!", "server");
  };

  ws.onclose = function(evt) {
    console.log("Disconnected from server!");
    showUserMsg("Connection lost!", "error");
  };

  ws.onmessage = function(evt) {
    console.log(`Received message: '${evt.data}'`);
    showUserMsg(evt.data, "server");
  };

  ws.onerror = function(evt) {
    console.log(`Error message: '${evt.data}'`);
    showUserMsg(evt.data, "error");
  };
}

function initButtons() {

  sendBtn.addEventListener('click', () => {
    let msg = inputBox.value;
    
    if (msg === "disconnect" || msg === "Disconnect" || msg === "DISCONNECT") {
      console.log('Disconnecting from server...');
      ws.close();
      ws = null;
    } else if (msg === "connect" || msg === "Connect" || msg === "CONNECT") {
      console.log('Connecting to server...');
      wsConnect();
    } else if (msg) {
      console.log(`Sending '${msg}' to server...`);
      showUserMsg(msg, "user");
      ws.send(msg);
    }
    inputBox.value = "";
  });
  
  geoBtn.addEventListener('click', () => {
  
  });
}

function showUserMsg(msg, type) {
  let userBubble = document.createElement("div");
  let userText = document.createTextNode(msg);
  if (type === "user") {
    userBubble.classList = "bubble bubble-input";
  } else if (type === "error") {
    userBubble.classList = "bubble bubble-output error";
  } else {
    userBubble.classList = "bubble bubble-output";
  }
  outputBox.appendChild(userBubble);
  userBubble.appendChild(userText);
}

document.addEventListener("DOMContentLoaded", () => {

  wsConnect();

  initButtons();
  
});



