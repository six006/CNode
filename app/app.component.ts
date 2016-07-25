import { Component, ElementRef, ViewChild, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { View } from "ui/core/view";
import {
  ScrollView
} from 'ui/scroll-view';
import {  
  Label
} from 'ui/label';
import {
  StackLayout
} from 'ui/layouts/stack-layout';
import {
  GestureTypes,
  TouchGestureEventData
} from 'ui/gestures';
import {
  device,
  platformNames,
  screen
} from 'platform';
import {
  TopicListService
} from './Services/topiclist.service';
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { Page } from "ui/page";
import { ActionItem } from "ui/action-bar";
import sideDrawerModule = require('nativescript-telerik-ui/sidedrawer');
import * as ObservableModule from "data/observable";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";

@Component({
    moduleId: module.id,
    selector: "mp-app",
    providers:[TopicListService],
    template:`
    <ActionBar title="test">
        <ScrollView orientation="horizontal" width="320">
          <AbsoluteLayout class="navigator-wrapper">
            <StackLayout orientation="horizontal" class="navigator">
              <Label class="navigator-item" text="全部"></Label>
              <Label class="navigator-item" text="精华"></Label>
              <Label class="navigator-item" text="分享"></Label>
              <Label class="navigator-item" text="问答"></Label>
            </StackLayout>
          <AbsoluteLayout class="indicator">
            <Label class="indicator-item" #indicator [left]="leftPos"></Label>
          </AbsoluteLayout>
          </AbsoluteLayout>
        </ScrollView>
    </ActionBar>
    <DockLayout stretchLastChild="true" class="main-body">
      <GridLayout dock="bottom" class="bottom-tab" rows="1,*" columns="1*,1*,1*,1*,1*">
        <Label class="border" row="0" col="0" colSpan="5"></Label>
        <AbsoluteLayout row="1" col="0" class="bottom-tab-item">
          <StackLayout orientation="vertical" class="major-gray-color">
            <Label text="&#xf015;" class="font-awesome tab-icon" ></Label>
            <Label text="首页" class="tab-label"></Label>
          </StackLayout>
        </AbsoluteLayout>

        <AbsoluteLayout row="1" col="1" class="bottom-tab-item">
          <StackLayout orientation="vertical" class="major-blue-color">
            <Label text="&#xf19d;" class="font-awesome tab-icon" ></Label>
            <Label text="招聘" class="tab-label "></Label>
          </StackLayout>
        </AbsoluteLayout>

        <AbsoluteLayout row="1" col="2" class="bottom-tab-item">
          <StackLayout orientation="vertical" class="major-gray-color">
            <Label text="&#xf004;" class="font-awesome tab-icon" ></Label>
            <Label text="收藏" class="tab-label"></Label>
          </StackLayout>
        </AbsoluteLayout>

        <AbsoluteLayout row="1" col="3" class="bottom-tab-item">
          <StackLayout orientation="vertical" class="major-gray-color">
            <Label text="&#xf0f3;" class="font-awesome tab-icon" ></Label>
            <Label text="通知" class="tab-label"></Label>
          </StackLayout>
        </AbsoluteLayout>

        <AbsoluteLayout row="1" col="4" class="bottom-tab-item">
          <StackLayout orientation="vertical" class="major-gray-color">
            <Label text="&#xf007;" class="font-awesome tab-icon" ></Label>
            <Label text="我" class="tab-label"></Label>
          </StackLayout>
        </AbsoluteLayout>
      </GridLayout>
      <StackLayout #wrapper class="scrollview-wrapper" dock="top">
          <ScrollView  #scrollview class="scrollview" orientation="horizontal" >
              <StackLayout class="scrollview-content" orientation="horizontal" >
                  <GridLayout class="scrollview-tab" rows="auto,*" [style.width]="tabWidth">
                    <ListView [items]="myItems" row="1">
                        <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                            <StackLayout>
                                <Label [text]='"index: " + i'></Label>
                                <Label [text]='"[" + item.id +"] " + item.name'></Label>
                            </StackLayout>
                        </template>
                    </ListView>
                  </GridLayout>
                  <StackLayout class="scrollview-tab" [style.width]="tabWidth"><Label text="2"></Label></StackLayout>
                  <StackLayout class="scrollview-tab" [style.width]="tabWidth"><Label text="3"></Label></StackLayout>
                  <StackLayout class="scrollview-tab" [style.width]="tabWidth"><Label text="4"></Label></StackLayout>
              </StackLayout>
          </ScrollView>
      </StackLayout>
     </DockLayout>
    `,
})
export class AppComponent implements OnInit,AfterViewInit {
  @ViewChild('scrollview') scrollViewRef: ElementRef;
  @ViewChild('wrapper') wrapperRef: ElementRef;
  @ViewChild('indicator') indicatorRef: ElementRef;
  private scrollView: ScrollView;
  private wrapper: StackLayout;
  private indicator: Label;
  public myItems;
  leftPos = 20;
  tabWidth = 0;
  /**
   * 0:no directin 1:right -1:left
   */
  private xDirection: number = 0;
  constructor( @Inject(Page) private page: Page, 
    private _changeDetectionRef: ChangeDetectorRef,
    private _topicListService: TopicListService) {
    this.myItems = [];
    for (var i = 0; i < 50; i++) {
        this.myItems.push({id:i, name:"data item " + i});
    }
  }

  ngOnInit() {
    this.onScrollViewScrolling = this.onScrollViewScrolling.bind(this);
    const topicParam = {
      tab:'job',
      limit:1
    };
    this._topicListService.getTopicList(topicParam)
  }

  private isAndroid():boolean {
    return device.os === platformNames.android;
  }

  private isIOS():boolean{
    return device.os === platformNames.ios;
  }

  private onScrollViewScrolling(event):void {
    let scrollX = event.scrollX;
    console.log(scrollX);
    this.leftPos = (scrollX / (this.tabWidth*3)) * 240 + 20;
    this._changeDetectionRef.detectChanges();
  }

 get dataItems() {
   return [{name:'test',description:'test'}];
  }
  
  ngAfterViewInit() {
    console.log(screen.mainScreen.widthDIPs);
    setTimeout(()=>{
      this.tabWidth = screen.mainScreen.widthDIPs;
      this.leftPos = 20;
    },1);
    this.scrollView = this.scrollViewRef.nativeElement;
    this.wrapper = this.wrapperRef.nativeElement;
    this.isAndroid() && this.scrollView.android.setShowsHorizontalScrollIndicator(false);
    this.scrollView.on('scroll',this.onScrollViewScrolling);
    if(this.isIOS()){
      this.scrollView.ios.showsHorizontalScrollIndicator = false;
      this.scrollView.ios.scrollEnabled = true;
      this.scrollView.ios.pagingEnabled = true;
    }
  }
}