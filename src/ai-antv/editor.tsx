import getAIEditors from "./ai/editor-ai";

export default {
  '@resize': {
    options: ['width', 'height']
  },
  //'@ai': null,//取消外置AI
  '@ai': ({data}) => getAIEditors(),
}