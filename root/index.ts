import BaseComponent from "../components/BaseComponent.ts";
import drawManager from "../DrawManager.ts";

export default class RootComponent extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:drawManager.width/2, y:drawManager.height/2}).withSize({w:drawManager.width, h:drawManager.height});
  }

}