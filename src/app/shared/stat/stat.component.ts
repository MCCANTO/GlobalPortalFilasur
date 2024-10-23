import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit{
  
  @Input() icon!: string;
  @Input() count!: number;
  @Input() label!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
