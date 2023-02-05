import { Plugin, addIcon } from "obsidian";

import { D2PluginSettings, D2SettingsTab, DEFAULT_SETTINGS } from "./settings";
import { D2Processor } from "./processor";
import { RecompileIcon } from "./constants";

export default class D2Plugin extends Plugin {
  settings: D2PluginSettings;
  processor: D2Processor;

  async onload() {
    addIcon("file", RecompileIcon);
    await this.loadSettings();
    this.addSettingTab(new D2SettingsTab(this.app, this));

    const processor = new D2Processor(this);
    this.registerMarkdownCodeBlockProcessor("art", processor.attemptExport);

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
