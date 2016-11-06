'use strict'
const model = require('seraph-model')

class PostModel {
    init(db){
        this.model = model(db, 'Post')
    }
    getModel(){
        return this.model;
    }
}

var postModel = new PostModel();

module.exports = {
    init: function(db){
        return postModel.init(db);
    },
    model: function(){
        return postModel.getModel();
    }
}
