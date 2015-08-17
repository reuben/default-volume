const Data = require("sdk/self").data;
const {Cc, Ci, Cu} = require("chrome");
const Tabs = require("sdk/tabs");
const TabsUtils = require("sdk/tabs/utils");
const ViewCore = require("sdk/view/core");
const SimplePrefs = require("sdk/simple-prefs");

Cu.import("resource://gre/modules/Services.jsm");

Services.ppmm.addMessageListener("default-volume@jetpack:loaded", (msg) => {
  msg.target.sendAsyncMessage("default-volume@jetpack:setVolume", {
    volume: SimplePrefs.prefs["defaultVolume"]
  });
});

Services.ppmm.addMessageListener("default-volume@jetpack:log", (msg) => {
  console.log(msg.data);
});

SimplePrefs.on("defaultVolume", () => {
  Services.ppmm.broadcastAsyncMessage("default-volume@jetpack:setVolume", {
    volume: SimplePrefs.prefs["defaultVolume"]
  });
});

Services.ppmm.loadProcessScript(Data.url("framescript.js"), true);
