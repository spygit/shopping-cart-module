/**
 * Created by eliufch on 6/22/2014.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Category(category) {
    this.name = category.name;
};

module.exports = Category;


//存储商品信息
Category.prototype.save = function(callback) {
    //要存入数据库的用户文档
    var category = {
        name: this.name
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('categorys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(category, {
                safe: true
            }, function (err, category) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, category[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

Category.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('categorys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, category) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, category);//成功！返回查询的用户信息
            });
        });
    });
};
Category.getList = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('categorys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //查找用户名（name键）值为 name 一个文档
            collection.find(query).toArray(function (err, category) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, category);//成功！返回查询的用户信息
            });
        });
    });
};

Category.remove = function(_id, callback) {
    mongodb.open(function(err, db) {
        if(err) {
            mongodb.close();
            return callback(err);
        }
        db.collection('categorys', function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                _id: new ObjectID(_id)
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        });
    })
}