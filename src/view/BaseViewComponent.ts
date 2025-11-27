import { Container } from "pixi.js";
import { CoreUtils } from "../core";

export abstract class BaseViewComponent extends Container {   
    protected readonly core: CoreUtils;

    constructor(core: CoreUtils) {
        super();
        this.core = core;
    }


    protected get app() {
        return this.core.app;
    }

    protected get assetManager() {
        return this.core.assetManager;
    }

    protected get gameController() {
        return this.core.gameController;
    }

    protected get events() {
        return this.core.events;
    }

    protected get dataStore() {
        return this.core.dataStore;
    }
}