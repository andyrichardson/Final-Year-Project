'use strict'
const model = require('seraph-model');

class PostModel {
  init(db) {
    this.model = model(db, 'Post');
  }

  getModel() {
    return this.model;
  }
}

/* SINGLETON CLASS */
const postModel = new PostModel();

/* INITIALIZE CLASS */
module.exports.init = (db) => postModel.init(db);

/* RETURN MODEL */
module.exports.model = () => postModel.getModel();
