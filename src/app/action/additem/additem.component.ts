import { Component, OnInit } from '@angular/core';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { RestserviceService } from '../restservice.service';

const URL = 'http://localhost:8080/api/upload/';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})


export class AdditemComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: URL });


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


  constructor(public rest: RestserviceService) {
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any) => {
      let res = JSON.parse(response);
      let imagename = 'public/images/' + res.data.filename;
      this.itemModel.images.push(imagename);
      if (item === this.mainImage) {
        this.itemModel.mainImage = 'public/images/' + res.data.filename;
      }
    }
  }

  ngOnInit() {

  }

  setMainImage(item: any) {
    this.mainImage = item;
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
      this.uploader.uploadAll();
      this.finishUploading().then((res) => {
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

    } else if (!this.uploader.queue.length) {
      this.messages.push(
        {
          type: 'error',
          invalid: 'images',
          message: 'Upload at least one image for your product'
        }
      )
      return false;
    } else if (this.uploader.queue.length > 5) {
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
