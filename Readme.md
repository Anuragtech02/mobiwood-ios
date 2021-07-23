#ios

1. Comment flipper from the Podfile in ios folder.
2. run command after if still any error occurrs "cd ios && pod install && cd ..", than can run project in Xcode or terminal.
3. Remove Double quotes (") from Search paths settings in "Build Setting" options xcode.
4. Removing duplicate font files in Copy Bundle Resources worked for me.

   The problem seems to be caused by the new autolinking feature in React Native 0.60 - the line use_native_modules! in ios/Podfile means when you do pod install, any pods found in node_modules are automatically linked. This means that links to all font files are added to [CP] Copy Pods Resources when you do pod install.

   If you previously installed react-native-vector-icons manually by adding the font files to Copy Bundle Resources, you then get a "Multiple commands produce..." fatal build error.

   So to fix the problem, just remove the font files from Copy Bundle Resources, so that they are only in [CP] Copy Pods Resources.
