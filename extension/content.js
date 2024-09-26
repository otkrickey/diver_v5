function loadExternalScript(scriptPath) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(scriptPath);
        script.onload = () => {
            console.log(`External script ${scriptPath} loaded successfully`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load external script ${scriptPath}`);
            reject();
        };
        (document.head || document.documentElement).appendChild(script);
    });
}

function checkIframeDomain() {
    const target = "static-content.payment.global.rakuten.com";
    if (window !== window.top) {
        try {
            const iframeSrc = window.location.href;
            if (iframeSrc.includes(target)) {
                if (iframeSrc.includes("cvv.html")) {
                    actionCvv();
                }
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        if (window.location.href.includes("ticketdive.com")) {
            actionMain();
        }
    }
}
function actionMain() {
    console.log("actionMain");
    loadExternalScript("dist/prod.js");
}

function actionCvv() {
    console.log("actionCvv");
    const cvv = document.querySelector('input[name="cvv"]');
    if (cvv) {
        cvv.value = "846";
        cvv.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkIframeDomain);
} else {
    checkIframeDomain();
}