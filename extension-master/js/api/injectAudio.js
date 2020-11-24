var background = (function () {
    var _tmp = {};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        for (var id in _tmp) {
            if (_tmp[id] && (typeof _tmp[id] === "function")) {
                if (request.path === 'background-to-page') {
                    if (request.method === id) _tmp[id](request.data);
                }
            }
        }
    });
    /*  */
    return {
        "receive": function (id, callback) {_tmp[id] = callback},
        "send": function (id, data) {chrome.runtime.sendMessage({"path": 'page-to-background', "method": id, "data": data})}
    }
})();


var inject = function () {
    const FAKECONST1 = 0.18084812747347945; //Фэйковая константа 1, тип float 1-0. Изначально была Math.random()
    const FAKECONST2 = 0.10636908852247884; //Фэйковая константа 2, тип float 1-0. Изначально была Math.random()
    const config = {
        "BUFFER": null,
        "getChannelData": function (e) {
            const getChannelData = e.prototype.getChannelData;
            Object.defineProperty(e.prototype, "getChannelData", {
                "value": function () {
                    const results_1 = getChannelData.apply(this, arguments);
                    if (config.BUFFER !== results_1) {
                        config.BUFFER = results_1;
                        window.top.postMessage("audiocontext-fingerprint-defender-alert", '*');
                        for (var i = 0; i < results_1.length; i += 100) {
                            let index = Math.floor(FAKECONST1 * i);
                            results_1[index] = results_1[index] + FAKECONST2 * 0.0000001;
                            console.log(results_1);
                            console.log("results_1");
                        }
                    }
                    return results_1;
                }
            });
        },
        "createAnalyser": function (e) {
            const FAKECONST3 = 0.9982198866010061; //Фэйковая константа 3, тип float 1-0. Изначально была Math.random()
            const FAKECONST4 = 0.19740556943847642; //Фэйковая константа 4, тип float 1-0. Изначально была Math.random()
            const createAnalyser = e.prototype.__proto__.createAnalyser;
            Object.defineProperty(e.prototype.__proto__, "createAnalyser", {
                "value": function () {
                    const results_2 = createAnalyser.apply(this, arguments);
                    const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
                    Object.defineProperty(results_2.__proto__, "getFloatFrequencyData", {
                        "value": function () {
                            window.top.postMessage("audiocontext-fingerprint-defender-alert", '*');
                            const results_3 = getFloatFrequencyData.apply(this, arguments);
                            for (var i = 0; i < arguments[0].length; i += 100) {
                                let index = Math.floor(FAKECONST3 * i);
                                arguments[0][index] = arguments[0][index] + FAKECONST4 * 0.1;
                            }
                            console.log(results_3);
                            console.log("results_3");
                            return results_3;
                        }
                    });
                    console.log(results_2);
                    console.log("results_2");
                    return results_2;
                }
            });
        }
    };

    config.getChannelData(AudioBuffer);
    config.createAnalyser(AudioContext);
    config.createAnalyser(OfflineAudioContext);
    document.documentElement.dataset.acxscriptallow = true;
};

var script_1 = document.createElement('script');
script_1.textContent = "(" + inject + ")()";
document.documentElement.appendChild(script_1);

if (document.documentElement.dataset.acxscriptallow !== "true") {
    var script_2 = document.createElement('script');
    script_2.textContent = `{
    const iframes = window.top.document.querySelectorAll("iframe[sandbox]");
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow) {
        if (iframes[i].contentWindow.AudioBuffer) {
          if (iframes[i].contentWindow.AudioBuffer.prototype) {
            if (iframes[i].contentWindow.AudioBuffer.prototype.getChannelData) {
              iframes[i].contentWindow.AudioBuffer.prototype.getChannelData = AudioBuffer.prototype.getChannelData;
            }
          }
        }
        if (iframes[i].contentWindow.AudioContext) {
          if (iframes[i].contentWindow.AudioContext.prototype) {
            if (iframes[i].contentWindow.AudioContext.prototype.__proto__) {
              if (iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser) {
                iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser = AudioContext.prototype.__proto__.createAnalyser;
              }
            }
          }
        }
        if (iframes[i].contentWindow.OfflineAudioContext) {
          if (iframes[i].contentWindow.OfflineAudioContext.prototype) {
            if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__) {
              if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser) {
                iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser = OfflineAudioContext.prototype.__proto__.createAnalyser;
              }
            }
          }
        }
      }
    }
  }`;
    window.top.document.documentElement.appendChild(script_2);
}

window.addEventListener("message", function (e) {
    if (e.data && e.data === "audiocontext-fingerprint-defender-alert") {
        background.send("fingerprint", {"host": document.location.host});
    }
}, false);
