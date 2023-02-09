import D2Plugin from "./main";
import { getAPI } from "obsidian-dataview";

export default class HelpFunctions {
  plugin: D2Plugin;

  constructor(plugin: D2Plugin) {
    this.plugin = plugin;
  }

  createErrorMsg(errorText: string) {
    const errorTbl = createEl("table", { cls: "release-timeline" });
    const newI = createEl("i", { text: errorText });
    errorTbl.appendChild(newI);

    return errorTbl;
  }

  async renderQuery(content: string): DataArray<Result<QueryResult, string>> {
    const dv = getAPI();

    if (typeof dv == "undefined") {
      return this.createErrorMsg(
        "Dataview is not installed. The Release Timeline plugin requires Dataview to properly function."
      );
    }
    //get results from dataview
    try {
      var results;
      var results0 = await dv.query(content);
      let a = results0.value.values;
      results = dv.array(a);
    } catch (error) {
      return this.createErrorMsg("Error from dataview: " + error.message);
    }
    return results;
  }
}
