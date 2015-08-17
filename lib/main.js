const Data = require("sdk/self").data;
const {Cc, Ci} = require("chrome");
const Tabs = require("sdk/tabs");
const TabsUtils = require("sdk/tabs/utils");
const ViewCore = require("sdk/view/core");
const SimplePrefs = require("sdk/simple-prefs");

let globalMM = Cc["@mozilla.org/globalmessagemanager;1"]
                  .getService(Ci.nsIMessageListenerManager);

globalMM.loadFrameScript(Data.url("framescript.js"), true);
globalMM.broadcastAsyncMessage("default-volume@jetpack:setVolume", {volume: SimplePrefs.prefs["defaultVolume"]});

Tabs.on("open", (sdkTab) => {
  sdkTab.on("ready", (sdkTab) => {
    let tab = ViewCore.viewFor(sdkTab);
    let browser = TabsUtils.getBrowserForTab(tab);
    let browserMM = browser.messageManager;
    browserMM.sendAsyncMessage("default-volume@jetpack:setVolume", {volume: SimplePrefs.prefs["defaultVolume"]});
  });
});
