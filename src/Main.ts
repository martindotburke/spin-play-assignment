import { Application } from "pixi.js";
import { RootView } from "./view";
import { CoreUtils } from "./core";
import { APP_HEIGHT, APP_WIDTH } from ".";

(async () => {
  // Create a new application
  const app = new Application();
  //@ts-ignore
  globalThis.__PIXI_APP__ = app;
  // Initialize the application
  await app.init({
    background: "#1099bb",
    width: APP_WIDTH,
    height: APP_HEIGHT,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const core = new CoreUtils(app);

  await core.assetManager.loadAssets();

  app.stage.addChild(new RootView(core));

  core.gameController.showSplashScreen();

  window.addEventListener("resize", onResize);
  function onResize(): void {
    // TODO - this should fill screen as best as possible while maintaining aspect ratio
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }
})();
