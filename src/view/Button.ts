import { Container, Graphics, Text } from "pixi.js";

export class Button extends Container {
  constructor(label: string) {
    super();

    const background = new Graphics()
      .roundRect(-100, -40, 200, 80, 20)
      .fill(0x00cc00)
      .stroke({ color: 0x006600, width: 5 });

    const buttonText = new Text({
      text: label,
      style: {
        fill: "0xffffff",
        fontSize: 32,
        fontFamily: "Arial",
      },
      anchor: 0.5,
    });

    this.addChild(background);
    this.addChild(buttonText);

    this.interactive = true;
  }
}
