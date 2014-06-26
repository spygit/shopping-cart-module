/**
 * Created by eliufch on 6/25/2014.
 */
var mongodb = require('./db');

function Order(order) {
    this.pid = order.name;
    this.password = order.password;
    this.email = order.email;
};

module.exports = Order;


//存储用户信息
Order.prototype.save = function(callback) {
    //要存入数据库的用户文档
    var member = {
        name: this.name,
        password: this.password,
        email: this.email
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('members', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(member, {
                safe: true
            }, function (err, member) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, member[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
Order.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('members', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, member) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, member);//成功！返回查询的用户信息
            });
        });
    });
};

Order.getList = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('members', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //查找用户名（name键）值为 name 一个文档
            collection.find(query).toArray(function (err, member) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, member);//成功！返回查询的用户信息
            });
        });
    });
};