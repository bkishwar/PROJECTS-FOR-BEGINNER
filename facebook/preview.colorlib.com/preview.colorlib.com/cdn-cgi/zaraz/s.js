(function(w, d) {
    zaraz.debug = (dg = "") => {
        document.cookie = `zarazDebug=${dg}; path=/`;
        location.reload()
    };
    window.zaraz._al = function(cv, cw, cx) {
        w.zaraz.listeners.push({
            item: cv,
            type: cw,
            callback: cx
        });
        cv.addEventListener(cw, cx)
    };
    zaraz.preview = (cy = "") => {
        document.cookie = `zarazPreview=${cy}; path=/`;
        location.reload()
    };
    zaraz.i = function(cY) {
        const cZ = d.createElement("div");
        cZ.innerHTML = unescape(cY);
        const c$ = cZ.querySelectorAll("script");
        for (let da = 0; da < c$.length; da++) {
            const db = d.createElement("script");
            c$[da].innerHTML && (db.innerHTML = c$[da].innerHTML);
            for (const dc of c$[da].attributes) db.setAttribute(dc.name, dc.value);
            d.head.appendChild(db);
            c$[da].remove()
        }
        d.body.appendChild(cZ)
    };
    zaraz.f = async function(dd, de) {
        const df = {
            credentials: "include",
            keepalive: !0,
            mode: "no-cors"
        };
        if (de) {
            df.method = "POST";
            df.body = new URLSearchParams(de);
            df.headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        return await fetch(dd, df)
    };
    window.zaraz._p = async u => new Promise((v => {
        if (u) {
            u.e && u.e.forEach((w => {
                try {
                    new Function(w)()
                } catch (x) {
                    console.error(`Error executing script: ${w}\n`, x)
                }
            }));
            Promise.allSettled((u.f || []).map((y => fetch(y[0], y[1]))))
        }
        v()
    }));
    zaraz.pageVariables = {};
    zaraz.__zcl = zaraz.__zcl || {};
    zaraz.track = async function(cz, cA, cB) {
        return new Promise(((cC, cD) => {
            const cE = {
                name: cz,
                data: {}
            };
            for (const cF of [localStorage, sessionStorage]) Object.keys(cF || {}).filter((cH => cH.startsWith("_zaraz_"))).forEach((cG => {
                try {
                    cE.data[cG.slice(7)] = JSON.parse(cF.getItem(cG))
                } catch {
                    cE.data[cG.slice(7)] = cF.getItem(cG)
                }
            }));
            Object.keys(zaraz.pageVariables).forEach((cI => cE.data[cI] = JSON.parse(zaraz.pageVariables[cI])));
            Object.keys(zaraz.__zcl).forEach((cJ => cE.data[`__zcl_${cJ}`] = zaraz.__zcl[cJ]));
            cE.data.__zarazMCListeners = zaraz.__zarazMCListeners;
            //
            cE.data = { ...cE.data,
                ...cA
            };
            cE.zarazData = zarazData;
            fetch("/cdn-cgi/zaraz/t", {
                credentials: "include",
                keepalive: !0,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cE)
            }).catch((() => {
                //
                return fetch("/cdn-cgi/zaraz/t", {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cE)
                })
            })).then((function(cL) {
                zarazData._let = (new Date).getTime();
                cL.ok || cD();
                return 204 !== cL.status && cL.json()
            })).then((async cK => {
                await zaraz._p(cK);
                "function" == typeof cB && cB()
            })).finally((() => cC()))
        }))
    };
    zaraz.set = function(cM, cN, cO) {
        try {
            cN = JSON.stringify(cN)
        } catch (cP) {
            return
        }
        prefixedKey = "_zaraz_" + cM;
        sessionStorage && sessionStorage.removeItem(prefixedKey);
        localStorage && localStorage.removeItem(prefixedKey);
        delete zaraz.pageVariables[cM];
        if (void 0 !== cN) {
            cO && "session" == cO.scope ? sessionStorage && sessionStorage.setItem(prefixedKey, cN) : cO && "page" == cO.scope ? zaraz.pageVariables[cM] = cN : localStorage && localStorage.setItem(prefixedKey, cN);
            zaraz.__watchVar = {
                key: cM,
                value: cN
            }
        }
    };
    for (const {
            m: cQ,
            a: cR
        } of zarazData.q.filter((({
            m: cS
        }) => ["debug", "set"].includes(cS)))) zaraz[cQ](...cR);
    for (const {
            m: cT,
            a: cU
        } of zaraz.q) zaraz[cT](...cU);
    delete zaraz.q;
    delete zarazData.q;
    zaraz.fulfilTrigger = function(bA, bB, bC, bD) {
        zaraz.__zarazTriggerMap || (zaraz.__zarazTriggerMap = {});
        zaraz.__zarazTriggerMap[bA] || (zaraz.__zarazTriggerMap[bA] = "");
        zaraz.__zarazTriggerMap[bA] += "*" + bB + "*";
        zaraz.track("__zarazEmpty", { ...bC,
            __zarazClientTriggers: zaraz.__zarazTriggerMap[bA]
        }, bD)
    };
    window.dataLayer = w.dataLayer || [];
    zaraz._processDataLayer = dD => {
        for (const dE of Object.entries(dD)) zaraz.set(dE[0], dE[1], {
            scope: "page"
        });
        if (dD.event) {
            if (zarazData.dataLayerIgnore && zarazData.dataLayerIgnore.includes(dD.event)) return;
            let dF = {};
            for (let dG of dataLayer.slice(0, dataLayer.indexOf(dD) + 1)) dF = { ...dF,
                ...dG
            };
            delete dF.event;
            dD.event.startsWith("gtm.") || zaraz.track(dD.event, dF)
        }
    };
    const dC = w.dataLayer.push;
    Object.defineProperty(w.dataLayer, "push", {
        configurable: !0,
        enumerable: !1,
        writable: !0,
        value: function(...dH) {
            let dI = dC.apply(this, dH);
            zaraz._processDataLayer(dH[0]);
            return dI
        }
    });
    dataLayer.forEach((dJ => zaraz._processDataLayer(dJ)));
    zaraz._cts = () => {
        zaraz._timeouts && zaraz._timeouts.forEach((dM => clearTimeout(dM)));
        zaraz._timeouts = []
    };
    zaraz._rl = function() {
        w.zaraz.listeners && w.zaraz.listeners.forEach((dN => dN.item.removeEventListener(dN.type, dN.callback)));
        window.zaraz.listeners = []
    };
    history.pushState = function() {
        try {
            zaraz._rl();
            zaraz._cts && zaraz._cts()
        } finally {
            History.prototype.pushState.apply(history, arguments);
            setTimeout((() => {
                zarazData.l = d.location.href;
                zarazData.t = d.title;
                zaraz.pageVariables = {};
                zaraz.__zarazMCListeners = {};
                zaraz.track("__zarazSPA")
            }), 100)
        }
    };
    history.replaceState = function() {
        try {
            zaraz._rl();
            zaraz._cts && zaraz._cts()
        } finally {
            History.prototype.replaceState.apply(history, arguments);
            setTimeout((() => {
                zarazData.l = d.location.href;
                zarazData.t = d.title;
                zaraz.pageVariables = {};
                zaraz.track("__zarazSPA")
            }), 100)
        }
    };
    zaraz._c = ez => {
        const {
            event: eA,
            ...eB
        } = ez;
        zaraz.track(eA, { ...eB,
            __zarazClientEvent: !0
        })
    };
    zaraz._syncedAttributes = ["altKey", "clientX", "clientY", "pageX", "pageY", "button"];
    zaraz.__zcl.track = !0;
    d.addEventListener("visibilitychange", (eR => {
        zaraz._c({
            event: "visibilityChange",
            visibilityChange: [{
                state: d.visibilityState,
                timestamp: (new Date).getTime()
            }]
        }, 1)
    }));
    zaraz.__zcl.visibilityChange = !0;
    zaraz.__zarazMCListeners = {
        "google-analytics_v4_20ac": ["visibilityChange"]
    };
    zaraz._p({
        "e": ["(function(w,d){w.zarazData.executed.push(\"Pageview\");})(window,document)"],
        "f": [
            ["https://stats.g.doubleclick.net/g/collect?t=dc&aip=1&_r=3&v=1&_v=j86&tid=G-SEKJ4E9T4H&cid=b53f0955-1936-499d-99d1-b0dce04cfb46&_u=KGDAAEADQAAAAC%7E&z=1480034587", {}]
        ]
    })
})(window, document);