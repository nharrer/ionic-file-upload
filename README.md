# ionic-file-upload
Example ionic 4 project which shows how to upload an image taken with the camera plugin without the deprecated FileTransfer plugin.

This is based on the empty ionic 4 starter project with following plugins installer:

 * File: https://ionicframework.com/docs/native/file
 * Camera: https://ionicframework.com/docs/native/camera
 * Ionic Webview: https://ionicframework.com/docs/native/ionic-webview

See [home.page.ts](src/app/home/home.page.ts) for the essential code.

It's basically the js-example from [cordova](https://cordova.apache.org/blog/2017/10/18/from-filetransfer-to-xhr2.html) in a typescript/rxjs way (all wrapped into an observable).

