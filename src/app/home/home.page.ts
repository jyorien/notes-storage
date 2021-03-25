import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HomePageRoutingModule } from './home-routing.module';
const { Storage } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notes: any = [];
  constructor(private alertController: AlertController, private localNotifications: LocalNotifications) {
  }

  add() {
    const alert = this.alertController.create({
      header: 'New note',
      inputs: [{name:'title',type:'text'}],
      buttons:[
        {text:'Cancel', role:'cancel'},
        {text:'Add', handler: (alertData) => {
          this.setStorageItem(alertData.title)
          
        }}
      ]
    }).then(alert => alert.present());
  }

  async delete(note) {
    this.notes.splice(this.notes.indexOf(note),1)
    await Storage.set({
      key: 'notes',
      value: JSON.stringify(this.notes)
    })
  }

  async deleteAll() {
    const alert = this.alertController.create({
      header:'Delete all notes?',
      buttons:[
        {text:'Cancel',role:'cancel'},
        {text:'Delete all',handler:()=>{
          this.notes = []
          Storage.set({
            key: 'notes',
            value: JSON.stringify(this.notes)
          })
        }}
      ]}).then(alert => alert.present())
  }

  async edit(note) {
    const alert = this.alertController.create({
      header: 'Edit note',
      inputs: [{name:'title',type:'text',value:note}],
      buttons:[
        {text:'Cancel', role:'cancel'},
        {text:'Update', handler: (alertData) => {
          this.notes[this.notes.indexOf(note)] = [alertData.title]
          Storage.set({
            key: 'notes',
            value: JSON.stringify(this.notes)
          })
        }}
      ]
    }).then(alert => alert.present());
  }

  async setStorageItem(data) {
    this.notes.push(data);
  
    await Storage.set({
      key: 'notes',
      value: JSON.stringify(this.notes)
    })
  }

  async getStorageItems() {
    const res  = await Storage.get({key:'notes'})
    this.notes = JSON.parse(res.value)
  }

  setReminder(note) {
    const alert = this.alertController.create({
      header: "Set time",
      inputs: [{name: 'time',type:'number',placeholder:'minutes'}],
      buttons:[
      {text:"Cancel",role:'cancel'},
      {text:"Set", handler: (alertData) => {
        console.log(alertData)
        var milisecs = alertData.time * 60000
        this.setNotification(note.toString(),milisecs)
        

      }}
    ]
    }).then(alert => alert.present())
  }

  setNotification(note,milisec) {
    this.localNotifications.schedule({
      text: note,
      trigger: { at: new Date(new Date().getTime() + milisec)},
    })
  }

  ngOnInit() {
    this.getStorageItems()
  }

  
}
