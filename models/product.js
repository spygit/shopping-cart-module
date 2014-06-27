/**
 * Created by eliufch on 6/22/2014.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Product(product) {
    this.name = product.name;
    this.price = product.price;
    this.description = product.description;
};

module.exports = Product;


//存储商品信息
Product.prototype.save = function(callback) {
    //要存入数据库的用户文档
    var product = {
        name: this.name,
        price: this.price,
        description: this.description
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('products', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(product, {
                safe: true
            }, function (err, product) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, product[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
Product.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('products', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({
                name: name
            }, function (err, product) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, product);//成功！返回查询的用户信息
            });
        });
    });
};
//获取某个数据
Product.getOne = function(_id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('products', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({
                _id: new ObjectID(_id)
            }, function (err, product) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, product);//成功！返回查询的用户信息
            });
        });
    });
};

//读取多个数据,根据多个条件
Product.getList = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('products', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).toArray(function (err, product) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, product);//成功！返回查询的用户信息
            });
        });
    });
};

//读取多个数据,根据多个条件
Product.remove = function(_id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('products', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.remove({
                _id: new ObjectID(_id)
            },function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null);//成功！返回查询的用户信息
            });
        });
    });
};