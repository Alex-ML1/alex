const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const TargetType = require("../../extension-support/target-type");
const logo = require("./images/logo.png");
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
      blockIconURI: logo,
      menuIconURI: logo,

      // your Scratch blocks
      blocks: [
        {
          // name of the function where your block code lives
          opcode: "recognitionBlock",

          // type of block - choose from:
          //   BlockType.REPORTER - returns a value, like "direction"
          //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
          //   BlockType.COMMAND - a normal command block, like "move {} steps"
          //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
          blockType: BlockType.REPORTER,

          // label to display on the block
          text: "recognize this text [MY_STRING]",

          // true if this block should end a stack
          terminal: false,

          // where this block should be available for code - choose from:
          //   TargetType.SPRITE - for code in sprites
          //   TargetType.STAGE  - for code on the stage / backdrop
          // remove one of these if this block doesn't apply to both
          filter: [TargetType.SPRITE, TargetType.STAGE],

          // arguments used in the block
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

  /**
   * implementation of the block with the opcode that matches this name
   *  this will be called when the block is used
   */
  recognitionBlock({ MY_STRING }) {
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
        Authorization: `Bearer ${token}`, // Include your token in the Authorization header
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
        const labels = Object.keys(data);
        const probabilities = Object.values(data);

        const highestIndex = probabilities.indexOf(Math.max(...probabilities));

        const highestLabel = labels[highestIndex];

        return highestLabel;
      });
  }
}

module.exports = Scratch3YourExtension;
