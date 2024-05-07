const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const TargetType = require("../../extension-support/target-type");

class Scratch3YourExtension {
  constructor(runtime) {
    // put any setup for your extension here
  }

  /**
   * Returns the metadata about your extension.
   */
  getInfo() {
    return {
      // unique ID for your extension
      id: "yourScratchExtension",

      // name that will be displayed in the Scratch UI
      name: "Alex",

      // colours to use for your extension blocks
      color1: "#031C28",
      color2: "#69F2FA",

      // icons to display
      blockIconURI: "http://localhost:8000/logo/logo.png",
      menuIconURI: "http://localhost:8000/logo/logo.png",

      // your Scratch blocks
      blocks: [
        {
          opcode: "myFirstBlock",

          blockType: BlockType.REPORTER,

          text: "Recognize this text [MY_STRING]",

          terminal: false,

          filter: [TargetType.SPRITE, TargetType.STAGE],

          arguments: {
            MY_STRING: {
              // default value before the user sets something
              defaultValue: "hello",

              // type/shape of the parameter - choose from:
              //     ArgumentType.ANGLE - numeric value with an angle picker
              //     ArgumentType.BOOLEAN - true/false value
              //     ArgumentType.COLOR - numeric value with a colour picker
              //     ArgumentType.NUMBER - numeric value
              //     ArgumentType.STRING - text value
              //     ArgumentType.NOTE - midi music value with a piano picker
              type: ArgumentType.STRING,
            },
          },
        },
      ],
    };
  }

  myFirstBlock({ MY_STRING }) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const modelUrl = params.get("url");
    const token = params.get("token");

    const apiUrl = "http://localhost:8000";
    const reqBody = { example: MY_STRING, modelUrl: modelUrl };

    return fetch(`${apiUrl}/user/test_model`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const labels = Object.keys(data.result);
        const probabilities = Object.values(data.result);

        const highestIndex = probabilities.indexOf(Math.max(...probabilities));

        const highestLabel = labels[highestIndex];

        return highestLabel;
      });
  }
}

module.exports = Scratch3YourExtension;
