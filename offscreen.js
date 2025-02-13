chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "play-sound" && message.sound) {
        const audio = new Audio(chrome.runtime.getURL(`assets/audio/${message.sound}`));
        audio.play().catch(err => console.error("Audio play error:", err));
    }
});
