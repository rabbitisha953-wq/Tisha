Tisha Chat - Full Combo (Expo Managed)

Features:
- Phone input "login" (mock, saves locally) and creates users/{phone} in Firestore
- Firestore chat rooms (rooms/{roomId}/messages) with realtime updates
- Image picker + upload to Firebase Storage
- Video call via Jitsi Meet inside WebView (works in Expo Go)
- Firebase config prefilled (edit firebase.js if needed)

Run (Termux):
1) termux-setup-storage
2) mv /storage/emulated/0/Download/Tisha_Full_Combo_New.zip ~/
3) unzip ~/Tisha_Full_Combo_New.zip -d ~/
4) cd ~/Tisha_Full_Combo_New
5) npm config set registry https://registry.npmmirror.com
6) npm install --legacy-peer-deps
7) npx expo start --tunnel

Notes:
- For real phone OTP on Firebase you'll need a standalone build and proper recaptcha/safetyNet setup.
- If npm install fails due to permissions, copy project into ~/ (home) before running npm install.
