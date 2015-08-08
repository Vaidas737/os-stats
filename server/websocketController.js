module.exports = {
  connection: function(osUsage, freq, ws) {
    var id = setInterval(function() {
      ws.send(JSON.stringify(osUsage.usage), function() { /* ignore errors */ });
    }, freq);

    console.log("websocket connection start");

    ws.on("close", function() {
      console.log("websocket connection close");
      clearInterval(id);
    });
  }
};