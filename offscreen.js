chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "play-sound") {
        const audio = new Audio(chrome.runtime.getURL("assets/audio/notification.mp3"));
        audio.play();
    }
});
