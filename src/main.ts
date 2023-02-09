import { Plugin, addIcon, Notice } from "obsidian";
import { DataArray, getAPI, Result } from "obsidian-dataview";
import { D2PluginSettings, D2SettingsTab, DEFAULT_SETTINGS } from "./settings";
import { D2Processor } from "./processor";
import { RecompileIcon } from "./constants";
import HelpFunctions from "./functions";

export default class D2Plugin extends Plugin {
  settings: D2PluginSettings;
  processor: D2Processor;

  HelpFunctions = new HelpFunctions(this);

  async onload() {
    this.app.workspace.onLayoutReady(() => {
      const isDataviewInstalled = !!getAPI();
      if (!isDataviewInstalled) {
        new Notice(
          "The Release Timeline plugin requires Dataview to properly function."
        );
      }
    });

    addIcon("recompile", RecompileIcon);
    await this.loadSettings();
    this.addSettingTab(new D2SettingsTab(this.app, this));

    const processor = new D2Processor(this);

    this.registerMarkdownCodeBlockProcessor(
      "art",
      async (
        content: string,
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext
      ) => {
        let results =
          await this.HelpFunctions.renderQuery(content);
        // console.log(results);
        let returnVal: string = "direction: right \n ";
      
        results.forEach((result: { path: string; }[]) => {
          console.log(result);
          returnVal += result[0].path + "\n";
        });
        console.log(returnVal);
        processor.attemptExport(returnVal, el, ctx);
      }
    );

    this.processor = processor;
  }

  onunload() {
    const abortControllers = this.processor.abortControllerMap.values();
    Array.from(abortControllers).forEach((controller) => {
      controller.abort();
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
