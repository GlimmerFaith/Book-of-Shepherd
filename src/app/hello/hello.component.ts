import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit{

  name:string = "Jack"
  date: any;
  box:string = 'div_box'

  constructor(){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
