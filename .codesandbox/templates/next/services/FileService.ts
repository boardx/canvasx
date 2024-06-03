//**Redux Store */
import store from '../redux/store';

//**Axios */
import axios from 'axios';

//**Services */
import UtilityService from '../services/UtilityService';

//**Aws */
import AWS from 'aws-sdk';

//**Utils */
import imageCompression from 'browser-image-compression';

export default class FileService {
  static service: FileService;

  private r2;

  private albumBucketName; //aws bucket name

  //todo: need to refactoring the method
  private uploadSettings = {
    R2EndPoint: 'https://files.boardx.us',
    R2AccessKeyId: 'public-read',
    R2SecretAccessKey: 'boardx',
    R2BucketName: 'boardx',
  }; //store?.getState()?.system.settings.uploadSettings;

  static getInstance(): FileService {
    if (FileService.service == null) {
      FileService.service = new FileService();
      // Boardx.Instance.OrgService = FileService.service;
    }

    return FileService.service;
  }

  constructor() {
    this.r2 = new AWS.S3({
      endpoint: this.uploadSettings.R2EndPoint,
      accessKeyId: this.uploadSettings.R2AccessKeyId,
      secretAccessKey: this.uploadSettings.R2SecretAccessKey,
      signatureVersion: 'v4',
      region: 'us-east-1',
    });

    this.albumBucketName = this.uploadSettings.R2BucketName;
  }

  //todo: need to refactoring the method
  // upload files to AWS S3
  async uploadFileToR2inBoard(path: string, file: any) {
    let uuId = UtilityService.getInstance().generateUUID();

    let photoKey;

    let myFile = file;

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1680,
      useWebWorker: false,
    };

    myFile = await imageCompression(file, options);

    const extension = file.name.slice(
      ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
    );

    photoKey = path + 'images/' + 'smallPic/' + uuId + '.' + extension;

    let bigphotoKey = path + 'images/' + 'bigPic/' + uuId + '.' + extension;

    await this.uploadFileToR2(bigphotoKey, file);

    let uploadResponse = await this.uploadFileToR2(photoKey, myFile);

    return uploadResponse;
  }

  // upload Json to AWS S3
  async uploadJsonToR2(path: string, file: any) {
    let key =
      path +
      'backup/' +
      store.getState().user.userInfo.userId +
      '/' +
      file.name;

    let signature = await this.r2.getSignedUrlPromise('putObject', {
      Bucket: this.albumBucketName,
      Key: key,
      Expires: 3600,
    });

    return axios
      .put(signature, file, { headers: { 'Content-Type': file.type } })
      .then((res: any) => {
        return 'https://files.boardx.us/' + key;
      })
      .catch((error) => {});
  }

  // upload Json to AWS S3
  async uploadRecordToR2(path: string, file: any) {
    let time = Date.now();

    let extension = '.mp3';

    let key =
      path +
      'record/' +
      store.getState().user.userInfo.userId +
      '/' +
      time +
      extension;

    let signature = await this.r2.getSignedUrlPromise('putObject', {
      Bucket: this.albumBucketName,
      Key: key,
      Expires: 3600,
    });

    let contentType = 'audio/mp3';

    await axios.put(signature, file, {
      headers: { 'Content-Type': contentType },
    });

    let url = 'https://files.boardx.us/' + key;

    return url;
  }

  // upload AVATAR to AWS S3
  async uploadAvatarToR2(path: string, file: any) {
    let photoKey = path + 'avatar/' + file.name;

    let uploadResponse = await this.uploadFileToR2(photoKey, file);

    return uploadResponse;
  }

  async uploadFileToR2(photoKey: string, file: any) {
    let signature = await this.r2.getSignedUrlPromise('putObject', {
      Bucket: this.albumBucketName,
      Key: photoKey,
      Expires: 3600,
    });

    const response = await axios.put(signature, file, {
      headers: { 'Content-Type': file.type },
    });

    let result = 'https://files.boardx.us/' + photoKey;

    return result;
  }

  async uploadFileToR2Async(path: string, file: any) {
    if (file && file.name) {
      const extension = file.name.slice(
        ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
      );

      let photoKey = path + 'files/' + Date.now() + '.' + extension;

      let uploadResponse = await this.uploadFileToR2(photoKey, file);

      return uploadResponse;
    }
  }

  async uploadThumbnailToR2Async(path: string, file: any) {
    if (file && file.name) {
      let now = Date.now();

      let photoKey = path + 'thumbnail/' + file.name;

      let uploadResponse = await this.uploadFileToR2(photoKey, file);

      return uploadResponse + '?timestamp=' + now;
    }
  }

  // async uploadImageToUser(base64Image, callback){

  //     try {
  //       // Get the captured data URL from the store.
  //       const dataUrl = base64Image;

  //       // Convert the data URL to a Blob object.
  //       const originalFile = await Util.dataURIToBlob(dataUrl);

  //       // Define compression options for the image.
  //       const options = {
  //         maxSizeMB: 1,
  //         maxWidthOrHeight: 960,
  //         useWebWorker: true
  //       };

  //       // Compress the image.
  //       const file = await Util.compressImage(originalFile, options);

  //       // Set the name of the compressed file.
  //       const randomName = Math.random().toString(36).substring(7);
  //       file.name = randomName + '.png';

  //       // Get the upload path for R2.
  //       const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
  //         store.getState().user.userInfo.userId
  //       );

  //       // Upload the compressed thumbnail image to R2.
  //       const key: any = await FileService.getInstance().uploadThumbnailToR2Async(
  //         r2UploadPath,
  //         file,
  //         {
  //           // Progress callback (can be implemented if needed).
  //           progress(e,r) {
  //             console.log('progress', e, r)
  //           }
  //         }
  //       );

  //       // Set the thumbnail source (URL) to the uploaded key.
  //       return key;

  //     } catch (e) {
  //       // Handle and log any errors that occur during the update process.
  //       console.error('update whiteboard thumbnail err', e);
  //     }

  // }

  // async readContentFromFileAsync(object) {
  //   server.call('readContentFromFile', { id: object.id, name: object.name, boardId: object.whiteboardId, src: object.src, objType: object.objType, url: object.url }).then(res => {

  //   }).catch(err => {
  //     console.log(err)
  //   });

  // };
}
