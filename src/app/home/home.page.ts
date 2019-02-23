import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(
        private camera: Camera,
        private webview: WebView,
        private file: File,
        private sanitizer: DomSanitizer,
        private httpClient: HttpClient
    ) {
    }

    public currentImagePath: string = null;
    public currentImageSaveUrl: SafeUrl = null;

    public takePicture(): void {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: false
        };

        from(this.camera.getPicture(options)).subscribe(
            imagePath => {
                this.currentImagePath = imagePath;
                const compatibleUrl = this.webview.convertFileSrc(imagePath);   // create url the webview understands
                this.currentImageSaveUrl = this.sanitizer.bypassSecurityTrustUrl(compatibleUrl);    // make url trustworthy (ios needs this)
                console.log(this.currentImagePath);
                console.log(compatibleUrl);
                console.log(this.currentImageSaveUrl);
            }, (err) => {
                console.log(err);
            });
    }

    public uploadPicture(filePath: string): void {
        this.uploadFile(filePath).subscribe(
            () => {
                console.log('OK');
            },
            error => {
                console.log(error);
            }
        );
    }

    private uploadFile(filePath: string): Observable<boolean> {
        const url = 'http://10.0.0.10:55384/api/instaboard/foto/upload';
        const filename = 'test.jpg';

        return from(this.file.resolveLocalFilesystemUrl(filePath)).pipe(
            // convert filePath into blob. see:
            // https://cordova.apache.org/blog/2017/10/18/from-filetransfer-to-xhr2.html
            mergeMap((fileEntry: FileEntry) => {
                // wrap callback into observable
                return Observable.create(observer => {
                    fileEntry.file(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const imgBlob = new Blob([reader.result], { type: file.type });
                            observer.next(imgBlob);
                            observer.complete();
                        };
                        reader.readAsArrayBuffer(file);
                    }, error => {
                        observer.error(error);
                    });
                });
            }),
            mergeMap((imgBlob: Blob) => {
                const formData = new FormData();
                formData.append('file', imgBlob, filename);

                return this.httpClient
                    .post(url, formData).pipe(
                        map(() => true)
                    );
            })
        );
    }
}

