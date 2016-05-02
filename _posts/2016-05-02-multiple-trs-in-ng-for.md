---
title: How to loop over multiple tr's with *ngFor
layout: post
tags: [angular2, js]
---

I came across wanting to create a component in angular 2 that should display an edit section underneath a table row.

But because `*ngFor` only supports creating one element I hit a wall.

After some digging I found that by destructuring `*ngFor` into it's standalone attributes I could use them on a `<template>` and be able to create what I wanted.

```javascript

import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';

interface Asset {
  id: number;
  name: string;
  price: number;
  change?: string;
}

@Component({
  selector: 'assets',
  template: `
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <template ngFor let-asset [ngForOf]="assets" [ngForTrackBy]="assetTrackBy">
          <tr>
            <td>{{asset.id}}</td>
            <td>{{asset.name}}</td>
            <td>{{asset.price}}</td>
            <td>
              <button type="button" (click)="showEdit(asset)" *ngIf="enableEdit && !asset.isEditing">Edit</button>
              <button type="button" (click)="cancelEdit(asset)" *ngIf="asset.isEditing">Cancel</button>
            </td>
          </tr>
          <tr *ngIf="asset.isEditing">
            <td colspan="4">
              <div class="bg-gray p-a-2">
                <textarea [(ngModel)]="asset.change"></textarea>
                <button type="button" (click)="change(asset)">Save</button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  `
})
export class AssetsComponent {

  @Input() assets: Asset[];
  @Input() enableEdit: boolean = false;

  @Output() save: EventEmitter<Asset> = new EventEmitter();

  showEdit(asset) {
    asset.isEditing = true;
  }

  cancelEdit(asset) {
    asset.isEditing = false;
    asset.change = undefined;
  }

  change(asset) {
    asset.isEditing = false;
    this.save.emit(asset);
  }

  assetsTrackBy(index: number, asset: Asset) {
    return asset.id;
  }
}


```
