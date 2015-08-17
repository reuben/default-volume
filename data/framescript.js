let Cc = Components.classes;
let Ci = Components.interfaces;
let Cu = Components.utils;
let Cr = Components.results;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let AudioPlaybackListener = {
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),

  mSetup: false,
  mVolume: 1.0,

  init() {
    Services.obs.addObserver(this, "audio-playback", false);
    addMessageListener("default-volume@jetpack:setVolume", this);
    addEventListener("unload", () => {
      AudioPlaybackListener.uninit();
    });
  },

  uninit() {
    Services.obs.removeObserver(this, "audio-playback");
    removeMessageListener("default-volume@jetpack:setVolume", this);
  },

  observe(subject, topic, data) {
    if (topic === "audio-playback") {
      if (subject && subject.top == content) {
        if (this.mSetup && data === "active") {
          this.setVolume();
        }
      }
    }
  },

  receiveMessage(msg) {
    if (msg.name == "default-volume@jetpack:setVolume") {
      this.mSetup = true;
      this.mVolume = msg.data.volume;
    }
  },

  setVolume() {
    // let windowUtils = content.QueryInterface(Ci.nsIInterfaceRequestor)
    //                          .getInterface(Ci.nsIDOMWindowUtils);
    // windowUtils.audioVolume = this.mVolume;

    let video = content.document.querySelectorAll("video");
    for (let v of video) {
      if (!v.__defaultVolumeSet) {
        v.volume = this.mVolume;
        v.__defaultVolumeSet = true;
      }
    }

    let audio = content.document.querySelectorAll("audio");
    for (let a of audio) {
      if (!a.__defaultVolumeSet) {
        a.volume = this.mVolume;
        a.__defaultVolumeSet = true;
      }
    }
  }
};
AudioPlaybackListener.init();
