import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  dataAccepted: boolean =false;
  qrcodeValue:string = null;

  //ngIf values
  url_section:boolean =false;
  mail_section:boolean =false;
  phone_section:boolean =false;
  text_section:boolean =false;




  constructor(
    private _barcode: BarcodeScanner,
    private _toast: ToastController
  ) {}

  scan() {
    this._barcode
      .scan()
      .then((barcodeScannedData) => {
        console.log(barcodeScannedData);
        this.checkData(barcodeScannedData);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  checkData(data: BarcodeScanResult) {
    if (data.cancelled) {
      this.presentToast("Taratma işlemi iptal edilmiştir","top","warning")
      this.falseThemAll();
      this.dataAccepted=false;
    }
    else{
      this.falseThemAll();
      this.dataAccepted=true;
      let content=data.text;
      this.qrcodeValue=content;


      //My Regex
      let url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      let mail_regex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

      if(url_regex.test(content)){
        //url onaylandı.
        this.url_section=true;
        return;
      }
      if(mail_regex.test(content)){
        //mail onaylandı.
        this.mail_section=true;
        return;

      }
      if(phone_regex.test(content)){
        //telefon onaylandı.
        this.phone_section=true;
        return;

      }

      if(content !== null && content.trim() !== ""){
        //düz text geldi.
        this.text_section=true;
        return;

      }else{
        this.qrcodeValue=null;
        this.falseThemAll();
        this.dataAccepted=false;
        this.presentToast("Boş bir veri gelmiştir ya da QR kod hatalı olabilir.","top","danger")
      }



    }
  }

  async presentToast(
    message, 
    position: 'bottom' | 'top' | 'middle',
    color: 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'light'
    | 'medium'
    | 'dark'
    ) {
    const toast = await this._toast.create({
      position: position,
      message: message,
      color: color,
      duration: 2000,
    });
    toast.present();
  }



  falseThemAll(){
    this.url_section=false;
    this.mail_section=false;
    this.text_section=false;
    this.phone_section=false;
  }
}
