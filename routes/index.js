/* GET home page. */
var crypto = require('crypto'),
    Admin = require('../models/admin.js'),
    Member = require('../models/member.js');
    Product = require('../models/product.js');
    Category = require('../models/category.js');
    ShoppingCart = require('../models/shoppingcart.js');

module.exports = function(app) {
    app.get('/system/login', function (req, res) {
        res.render('system/login', {
            title: '购物车后台管理员登陆界面',
            admin: req.session.admin,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/system/login', function (req, res) {
        var name = req.body.name,
            password = req.body.password;
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
/*        var newAdmin = new Admin({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        Admin.get(newAdmin.name, function (err, admin) {
            if (admin) {
                req.flash('error', '用户已存在!');
                return res.redirect('/system/login');//返回注册页
            }
            //如果不存在则新增用户
            newAdmin.save(function (err, admin) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/system/login');//注册失败返回主册页
                }
                req.session.admin = admin;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });*/
        //检查用户是否存在
        Admin.get(req.body.name, function (err, admin) {
            if (!admin) {
                req.flash('error', '用户不存在!');
                return res.redirect('/system/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (admin.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/system/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.admin = admin;
            req.flash('success', '登陆成功!');
            res.redirect('/system/index');//登陆成功后跳转到主页
        });
    });
    app.get('/system/index',checkAdminLogin);
    app.get('/system/index', function (req, res) {
        res.render('system/index', {
            title: '购物车后台管理主页',
            admin: req.session.admin
        });
    });
    //管理员登出操作
    app.get('/system/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/system/login');//登出成功后跳转到主页
    });

    app.get('/system/member',checkAdminLogin);
    app.get('/system/member', function (req, res) {
        Member.getList(null, function (err, members) {
            if (err) {
                members = [];
            }
            res.render('system/member', {
                title: '主页',
                admin: req.session.admin,
                members: members,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/system/product_index',checkAdminLogin);
    app.get('/system/product_index', function (req, res) {
        Product.getList(null, function (err, products) {
            if (err) {
                products = [];
            }
            res.render('system/product_index', {
                title: '主页',
                products: products,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/system/product_add',checkAdminLogin);
    app.get('/system/product_add', function (req, res) {
        res.render('system/product_add', {
            title: '购物车后台管理主页',
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })

    app.post('/system/product_add',checkAdminLogin);
    app.post('/system/product_add', function (req, res) {
        var name = req.body.name,
            price = req.body.price,
            description = req.body.description;
        var newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });
        Product.get(newProduct.name, function (err, product) {
            if (product) {
                req.flash('error', '商品名称已经存在!');
                return res.redirect('/system/product_add');//返回注册页
            }
            //如果不存在则新增用户
            newProduct.save(function (err, product) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/system/product_add');//注册失败返回主册页
                }
                req.flash('success', '商品添加成功!');
                res.redirect('/system/product_add');//注册成功后返回主页
            });
        });
    });

    app.get('/system/category_index',checkAdminLogin);
    app.get('/system/category_index', function (req, res) {
        Category.getList(null, function (err, categorys) {
            if (err) {
                categorys = [];
            }
            res.render('system/category_index', {
                title: '主页',
                categorys: categorys,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/system/category_add',checkAdminLogin);
    app.get('/system/category_add', function (req, res) {
        res.render('system/category_add', {
            title: '购物车后台管理主页',
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })

    app.post('/system/category_add',checkAdminLogin);
    app.post('/system/category_add', function (req, res) {
        var name = req.body.name;
        var newCategory = new Category({
            name: req.body.name
        });
        Category.get(newCategory.name, function (err, category) {
            if (category) {
                req.flash('error', '商品类别名称已经存在!');
                return res.redirect('/system/category_add');//返回注册页
            }
            //如果不存在则新增用户
            newCategory.save(function (err, category) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/system/category_add');//注册失败返回主册页
                }
                req.flash('success', '商品添加成功!');
                res.redirect('/system/category_add');//注册成功后返回主页
            });
        });
    });


    //前台界面路由
    app.get('/', function (req, res) {
        Product.getList(null, function (err, products) {
            if (err) {
                products = [];
            }
            res.render('index', {
                title: '主页',
                products: products,
                member: req.session.member,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/detail/:_id', function(req, res) {
        Product.getOne(req.params._id, function (err, product) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('detail', {
                product: product,
                member: req.session.member,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.post('/addToCart', checkLogin);
    app.post("/addToCart", function (req,res) {
        var uid = req.body.uid;
        var pid = req.body.pid;
        var count = req.body.count;
        var newShoppingCart = new ShoppingCart({
            uid: req.body.uid,
            pid: req.body.pid,
            count: req.body.count
        });
            newShoppingCart.save(function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                req.flash('success', '商品已经成功添加至购物车!');
                res.redirect('/');//注册成功后返回主页
            });
    });

    app.get('/signup', function(req, res) {
        res.render('signup', {
            title: '购物车后台管理员登陆界面',
            member: req.session.member,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/signup', function (req, res) {
        var name = req.body.name,
            password = req.body.password;
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        /*        var newAdmin = new Admin({
         name: req.body.name,
         password: password,
         email: req.body.email
         });
         Admin.get(newAdmin.name, function (err, admin) {
         if (admin) {
         req.flash('error', '用户已存在!');
         return res.redirect('/system/login');//返回注册页
         }
         //如果不存在则新增用户
         newAdmin.save(function (err, admin) {
         if (err) {
         req.flash('error', err);
         return res.redirect('/system/login');//注册失败返回主册页
         }
         req.session.admin = admin;//用户信息存入 session
         req.flash('success', '注册成功!');
         res.redirect('/');//注册成功后返回主页
         });
         });*/
        //检查用户是否存在
        Member.get(req.body.name, function (err, member) {
            if (!member) {
                req.flash('error', '用户不存在!');
                return res.redirect('/signup');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (member.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/signup');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.member = member;
            req.flash('success', '登陆成功!');
            res.redirect('/');//登陆成功后跳转到主页
        });
    });

    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '购物车后台管理员登陆界面',
            member: req.session.member,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            re_password = req.body.re_password,
            email = req.body.email;
        //检验用户两次输入的密码是否一致
        if (re_password != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newMember = new Member({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        Member.get(newMember.name, function (err, member) {
            if (member) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newMember.save(function (err, member) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.member = member;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });

    //用户登出操作
    app.get('/logout', function (req, res) {
        req.session.member = null;
        req.flash('success', '登出成功!');
        res.redirect('/signup');//登出成功后跳转到主页
    });

    app.get('/info', checkLogin);
    app.get('/info', function(req, res) {
        res.render('info', {
            title: '购物车后台管理员登陆界面',
            member: req.session.member
        });
    });
    app.post('/info', function (req, res) {
        res.redirect('/order');
    });
    app.get('/cart', function(req, res) {
            res.render('cart', {
                title: '主页',
                member: req.session.member,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
    });
    app.get('/order',checkLogin);
    app.get('/order', function(req, res) {
        res.render('order', {
            title: '购物车后台管理员登陆界面',
            member: req.session.member
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.member) {
            req.flash('error', '未登录!');
            res.redirect('/signup');
        }
        next();
    }
    function checkAdminLogin(req, res, next) {
        if (!req.session.admin) {
            req.flash('error', '未登录!');
            res.redirect('/system/login');
        }
        next();
    }

}
