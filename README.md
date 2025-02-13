# Task Reminder Chrome Extension

## Overview
This Chrome extension allows users to create tasks and set reminders. When the time arrives, a push notification is triggered along with a custom notification sound. Completed tasks are automatically cleared from storage unless the user chooses to keep them.

## Features
- Add tasks with a scheduled reminder time
- Receive push notifications when the task is due
- Play a custom sound with notifications
- Automatically remove completed tasks (optional setting)
- Simple and clean UI using **Tailwind CSS**
- **Settings Page** to customize preferences (e.g., keep task history)

## Installation

1. **Download or Clone the Repository**
   ```sh
   git clone https://github.com/AustinKingOry/RemindMeExtension.git
   cd RemindMeExtension
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Build Tailwind CSS**
   Tailwind CSS must be precompiled to avoid Content Security Policy (CSP) issues in Chrome extensions. Run the following command to generate the required styles:
   ```sh
   npx tailwindcss -i ./tailwind.css -o ./dist/tailwind.min.css --minify
   ```
   During development, if you make changes to the Tailwind setup, run the following command to watch for updates:
   ```sh
   npx tailwindcss -i ./tailwind.css -o ./dist/tailwind.min.css --watch
   ```
   For more details on setting up Tailwind CSS, check the [official Tailwind documentation](https://tailwindcss.com/docs/installation).

4. **Open Chrome Extensions Page**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer Mode** (toggle in the top-right corner)
   - Click **Load unpacked** and select the project folder

5. **The extension is now installed and ready to use!**

## File Structure
```
📂 RemindMeExtension
 ├── 📂 icons           # Extension icons (16px, 48px, 128px)
 ├── background.js      # Handles alarms, notifications, and storage
 ├── popup.js          # Manages UI interactions in the popup
 ├── settings.js       # Manages user preferences in the settings page
 ├── styles.css        # Custom styling for UI (if needed)
 ├── tailwind.css      # Source Tailwind CSS file
 ├── dist/
 │   ├── tailwind.min.css  # Compiled Tailwind CSS file
 ├── popup.html        # Popup UI
 ├── settings.html     # User settings page
 ├── offscreen.html    # Offscreen document for handling audio playback
 ├── offscreen.js      # Logic for playing custom notification sounds
 ├── manifest.json     # Chrome extension configuration
 ├── README.md         # Project documentation
```

## Usage
1. Click on the extension icon in Chrome’s toolbar to open the popup.
2. Add a new task and set the reminder time.
3. When the time arrives, a notification with sound will appear.
4. The task will be automatically removed after notification (unless the setting to keep history is enabled).
5. Open the **Settings Page** to customize task history preferences.

## Technologies Used
- **JavaScript** for logic
- **Chrome Alarms API** for scheduling reminders
- **Chrome Notifications API** for push notifications
- **Chrome Storage API** for saving tasks and settings
- **Tailwind CSS** for styling (precompiled for CSP compliance)

## Known Issues
- If the notification sound does not play, ensure Chrome allows sound for notifications.
- Default Chrome notification sound may still play alongside the custom sound.

## Future Improvements
- Add an option to customize notification sounds
- Allow users to set recurring tasks
- Provide more customization options in settings

## License
This project is licensed under the MIT License.

