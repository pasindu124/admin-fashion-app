import { Component, OnInit, NgZone } from '@angular/core';
import { FileUploader, FileSelectDirective , FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload/ng2-file-upload';
import { RestserviceService } from '../restservice.service';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";

const URL = 'http://localhost:8080/api/upload/';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})


export class AdditemComponent implements OnInit {


  colorList = ['Blue', 'Red', 'Purple', 'White', 'Yellow', 'Green'];
  sizeList = ['Size XS', 'Size S', 'Size M', 'Size L', 'Size XL', 'Size XXL'];
  categoryList = ['Men', 'Women'];
  itemModel: any = {
    images: [],
    color: [],
    size: [],
    category: [],
    price: '',
    title: '',
    description: '',
    mainImage: ''
  };
  mainImage: any;
  messages: any = [];
  saving: boolean;
  private uploader: FileUploader;
  title = '';
  responses: Array<any>;



  constructor(public rest: RestserviceService, private cloudinary: Cloudinary, private zone: NgZone, private http: HttpClient) {
    this.title = '';
    this.responses = [];
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);


    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'myphotoalbum';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    const upsertResponse = fileItem => {

      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );

    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any) => {
      let res = JSON.parse(response);
      this.itemModel.images.push(res.url);
    }
  }

  ngOnInit() {

  }

  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
      _.remove(this.itemModel.images, function(n) {
        return n == data.url;
      });
      if (this.mainImage && this.mainImage.url == data.url) {
        this.mainImage = null;
        this.itemModel.mainImage = null;
      }
    });
  };

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }

  setMainImage(item: any) {
    this.mainImage = item.data;
    this.itemModel.mainImage = this.mainImage.url;
  }

  finishUploading() {
    return new Promise((resolve, reject) => {

      let refreshData = () => {
        let x = 1;

        if (!this.uploader.isUploading) {
          resolve(true);
          return;
        }

        setTimeout(refreshData, x * 1000);
      }
      refreshData();

    });
  }

  removeFromQueue(item: any) {
    if (this.mainImage && item == this.mainImage) {
      this.mainImage = null;
    }
    item.remove();
  }

  addItem() {
    this.saving = true;
    if (this.validateForm()) {
      let data = {
        title: this.itemModel.title,
        description: this.itemModel.description,
        price: this.itemModel.price,
        mainImage: this.itemModel.mainImage,
        images: this.itemModel.images,
        sizes: this.itemModel.size,
        colors: this.itemModel.color,
        categories: this.itemModel.category,
        mainCategory: this.itemModel.category[0]
      }
      this.rest.addItem(data).subscribe((result) => {
        this.resetModal();
        this.messages.push(
          {
            type: 'success',
            invalid: 'false',
            message: 'Item added succesfully.'
          }
        )
        this.saving = false;
      }, (err) => {
        console.log(err);
      });
    } else {
      this.saving = false;
    }
  }
  resetModal() {
    this.itemModel = {
      images: [],
      color: [],
      size: [],
      category: [],
      price: '',
      title: '',
      description: '',
      mainImage: ''
    }
    this.uploader.clearQueue();
    this.mainImage = null;
  }

  validateForm() {
    this.messages = [];
    if (!this.itemModel.title) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'title',
          message: 'Title is empty'
        }
      )
      return false;
    } else if (!this.itemModel.description) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'description',
          message: 'Description is empty'
        }
      )
      return false;

    } else if (!this.itemModel.price) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'price',
          message: 'Price is empty'
        }
      )
      return false;

    } else if (!this.itemModel.color.length) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'color',
          message: 'Please select at least one color'
        }
      )
      return false;

    } else if (!this.itemModel.size.length) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'size',
          message: 'Please select at least one size'
        }
      )
      return false;

    } else if (!this.itemModel.category.length) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'category',
          message: 'Please select at least one category'
        }
      )
      return false;

    } else if (isNaN(this.itemModel.price)) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'price',
          message: 'Invalid price'
        }
      )
      return false;

    } else if (!this.itemModel.images.length) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'images',
          message: 'Upload at least one image for your product'
        }
      )
      return false;
    } else if (this.itemModel.images.length > 5) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'images',
          message: 'Maximum only 5 images'
        }
      )
      return false;
    } else if (!this.mainImage) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'images',
          message: 'Please select a one image as Main Image '
        }
      )
      return false;
    }
    return true;


  }


}
