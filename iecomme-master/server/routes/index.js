var express = require('express');
var router = express.Router();

var connection = require('../db/sql.js')




// //展示所有笔记信息
// router.get("/showAllProducts", function(req, res, next) {
//     connection.query('SELECT * FROM product JOIN User ON product.userid = User.U_userId', function(error, results, fields) {
//         if (error) throw error;
//         console.log('The solution is: ', results);
//         res.send(results)
//     });

// });
router.post("/showAllProducts", function(req, res, next) {
	console.log(123)
    const sql = `
        SELECT *, favor.isFav as F_isFav
        FROM product
        JOIN User ON product.userid = User.U_userId
        LEFT JOIN favor ON product.id = favor.F_productid AND favor.F_userid = ?;
    `;

    const userId = req.body.GlobalUserId; // 获取用户 ID
    connection.query(sql, [userId], function(error, results, fields) {
        if (error) {
            console.error('查询失败:', error);
            return res.status(500).send('查询失败');
        }
                console.log(userId)
        //console.log('查询结果: ', results);
        res.send(results);
    });
});


//获取单个笔记信息
router.get('/getProduct/:id', function(req, res) {
    connection.query('SELECT * FROM product JOIN User ON product.userid = User.U_userId WHERE product.id = ?', [req.params.id], function(err, result) {
        console.log(result);
        res.send(result);
    }); // 添加这行的闭合大括号
});

//user表获取作者昵称
router.get('/getUserName/:id', (req, res) => {
   connection.query('SELECT * from User where U_userId = ?', [req.params.id], function(err, result) {
       console.log(result);
       res.send(result);
   }); // 添加这行的闭合大括号
});
//上传笔记
const fs = require('fs'); // 引入文件系统模块
const path = require('path'); // 引入路径模块

router.post('/add', function(req, res) {
    var sql = 'INSERT INTO product SET title=?, description=?, store=?, price1=?, price2=?, isFav=?, userid=?';
    var params = [
        req.body.title,
        req.body.description,
        req.body.store,
        req.body.price1,
        req.body.price2,
        false, // isFav 默认为 false
        req.body.userid
    ]; // 使用 req.body 以获取请求体中的数据
        var images = req.body.selectedImages;
    connection.query(sql, params, function(err, result) {
        if (err) {
            console.error('新增数据失败:', err);
            return res.status(500).send('新增数据失败'); // 返回 500 错误
        }
                console.log(images)
        const productId = result.insertId; // 获取新插入的物品 ID
        const folderPath = path.join(__dirname, '../../static/products/', productId.toString()); // 创建文件夹路径
        // 创建文件夹
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('创建文件夹失败:', err);
                return res.status(500).send('创建文件夹失败'); // 返回 500 错误
            }

            // 返回成功响应及新插入的物品 ID
            res.send({
                message: '增加数据成功',
                productId: productId // 返回新插入的物品 ID
            });
        });
    });
});




//登录
router.post('/user/login', function(req, res) {
    const { username, password } = req.body;
    const sql = 'SELECT U_userId,U_userName FROM User WHERE U_userName = ? AND U_userPassword = ?';
    const params = [username, password]; // 这里不加密密码，直接存储

    connection.query(sql, params, function(err, result) {
        if (err) {
            console.error('登录失败:', err);
            return res.status(500).send({ status: "error", message: "登录失败" });
        }

        if (result.length > 0) {
            // 登录成功，返回 U_userId
            res.send({ status: "success", U_userId: result[0].U_userId ,U_userName: result[0].U_userName });
        } else {
            // 用户名或密码错误
            res.send({ status: "error", message: "用户名或密码错误" });
        }
    });
});


//注册
router.post('/user/register', function(req, res) {
    const { phone, password, username } = req.body;

    // 进行字段验证
    if (!phone || !password || !username) {
        return res.status(400).send({ status: "error", message: "请填写所有必需字段" });
    }

    // SQL 插入语句
    const sql = 'INSERT INTO User (U_userPhone, U_userPassword, U_userName) VALUES (?, ?, ?)';
    const params = [phone, password, username];

    // 执行插入操作
    connection.query(sql, params, function(err, result) {
        if (err) {
            console.error('注册失败:', err);
            return res.status(500).send({ status: "error", message: "注册失败" });
        }
        res.send({ status: "success", message: "注册成功" });
    });
});

//获取图片
const app = express();

router.get('/getProductImages', (req, res) => {
    const itemId = req.query.itemId; // 获取请求中的itemId
    const folderPath = path.join(__dirname, '../../static/products/', itemId);

    // 检查文件夹是否存在
    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: '文件夹不存在' });
    }

    // 读取文件夹中的所有图片
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('读取文件夹失败:', err);
            return res.status(500).json({ error: '读取文件夹失败' });
        }

        // 过滤出图片文件，并生成URL列表
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)) // 过滤出图片文件
            .map(file => `/static/products/${itemId}/${file}`); // 生成图片URL列表

        res.json(images);
                console.log(images);
    });
});

// 收藏列表
// 引入数据库连接

// 查询用户收藏的产品
router.get('/favor/:userId', (req, res) => {
    const userId = req.params.userId; // 获取用户 ID
        console.log(userId);
    const sql = `
        SELECT product.*
        FROM favor
        JOIN product ON favor.F_productid = product.id
        WHERE favor.F_userid = ? AND favor.isFav = TRUE;
    `;

    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).send('查询失败');
        }
        res.json(results); // 返回收藏的产品列表
    });
});

// 收藏成功
router.put('/favor/:userId/:productId', (req, res) => {
    const userId = req.params.userId;      // 获取用户 ID
    const productId = req.params.productId; // 获取产品 ID

    const sql = `
        UPDATE favor
        SET favor.isFav = TRUE
        WHERE F_userid = ? AND F_productid = ?;
    `;

    connection.query(sql, [userId, productId], (err, results) => {
        if (err) {
            console.error('更新失败:', err);
            return res.status(500).send('更新失败');
        }

        if (results.affectedRows === 0) {
            //return res.status(404).send('未找到记录');
                         const insertSql = `INSERT INTO favor (F_userid, F_productid, isFav) VALUES (?, ?, TRUE);`;
                                connection.query(insertSql, [userId, productId], (insertErr, insertResults) => {
                                    if (insertErr) {
                                        console.error('插入失败:', insertErr);
                                        return res.status(500).send('插入失败');
                                    }
                                    return res.status(201).send('插入成功');
                                });
                                return; // 确保这里的 return 防止之后的代码执行
        }

        res.status(200).send('更新成功'); // 返回成功消息
                console.log("成功");
    });
});


//取消收藏
router.put('/Notfavor/:userId/:productId', (req, res) => {
    const userId = req.params.userId;      // 获取用户 ID
    const productId = req.params.productId; // 获取产品 ID

    const sql = `
        UPDATE favor
        SET favor.isFav = FALSE
        WHERE F_userid = ? AND F_productid = ?;
    `;

    connection.query(sql, [userId, productId], (err, results) => {
        if (err) {
            console.error('更新失败:', err);
            return res.status(500).send('更新失败');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('未找到记录');
        }

        res.status(200).send('更新成功'); // 返回成功消息
    });
});


// 新增收货地址
router.post('/addPath', (req, res) => {
    const { P_userid, P_name, p_tel, p_city, p_details, P_isDefault } = req.body;

        if (P_isDefault === true) {
            const query = 'UPDATE path SET P_isDefault = 0 WHERE P_userid = ?';
            connection.query(query, [P_userid], (error, results) => {
                if (error) {
                    console.error('Error updating P_isDefault:', error);
                } else {
                    console.log('P_isDefault updated successfully:', results);
                }
            });
        }
    const sql = `
        INSERT INTO Path (P_userid, P_name, p_tel, p_city, p_details, P_isDefault)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [P_userid, P_name, p_tel, p_city, p_details, P_isDefault];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('插入数据失败:', error);
            return res.status(500).send('插入数据失败');
        }
        console.log('插入成功，路径ID为:', results.insertId);
        res.status(201).send({ message: '插入成功', pathId: results.insertId });
    });
});

// 更新 P_isDefault 为 FALSE 的接口
router.post('/updateDefault', (req, res) => {
    const { id } = req.body; // 从请求体获取要更新的记录 ID

    // 确保传入的 ID 是有效的
    if (!id) {
        return res.status(400).json({ success: false, message: '缺少记录 ID' });
    }

    // 更新 P_isDefault 为 FALSE
    const updateSql = `
        UPDATE path
        SET P_isDefault = FALSE
        WHERE P_id = ? AND P_isDefault = TRUE
    `;

    connection.query(updateSql, [id], (error, results) => {
        if (error) {
            console.error('更新失败:', error);
            return res.status(500).json({ success: false, message: '更新失败' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '未找到要更新的记录或记录已是 FALSE' });
        }

        res.status(200).json({ success: true, message: '更新成功，可以插入或更新 P_isDefault 为 TRUE 的记录' });
    });
});


// 查询某个用户的地址信息
router.get('/getUserAddresses', function (req, res) {
    const userId = req.query.userId; // 从请求的查询参数中获取用户 ID

    // 检查用户 ID 是否存在
    if (!userId) {
        return res.status(400).json({ message: '缺少用户 ID' });
    }

    // SQL 查询语句，查找指定用户的所有地址信息
    const sql = `
        SELECT *
        FROM Path
        WHERE P_userid = ?
    `;

    // 执行 SQL 查询
    connection.query(sql, [userId], function (error, results) {
        if (error) {
            console.error('查询失败:', error);
            return res.status(500).json({ message: '查询失败' });
        }
        res.status(200).json({ addresses: results });
    });
});

router.put('/updateUserAddress', function (req, res) {
    const { name,tel,city,details,isdefault,userId, addressId} = req.body; // 从请求的 body 中获取用户 ID、地址 ID 和新的地址信息
        console.log(req.body)
    // 检查用户 ID、地址 ID 和新地址是否存在
    if (!userId || !addressId || !city || !name || !tel || !details) {
        return res.status(400).json({ message: '缺少用户 ID、地址 ID 或新的地址信息' });
    }
        if (isdefault === true) {
            const query = 'UPDATE path SET P_isDefault = 0 WHERE P_userid = ?';
            connection.query(query, [userId], (error, results) => {
                if (error) {
                    console.error('Error updating P_isDefault:', error);
                } else {
                    console.log('P_isDefault updated successfully:', results);
                }
            });
        }
    // SQL 更新语句，修改指定用户的指定地址
    const sql = `
        UPDATE path
        SET P_name = ?,p_tel = ?,p_city = ?,p_details = ?,P_isDefault = ?
        WHERE P_userid = ? AND P_id = ?
    `;

    // 执行 SQL 更新查询
    connection.query(sql, [name,tel,city,details,isdefault,userId, addressId], function (error, results) {
        if (error) {
            console.error('更新失败:', error);
            return res.status(500).json({ message: '更新失败' });
        }

        // 检查是否有行受到影响
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: '地址未找到或未发生更改' });
        }

        res.status(200).json({ message: '地址更新成功' });
    });
});

// 路由：查询用户的默认地址
router.get('/getDefaultAddress', function (req, res) {
    const userId = req.query.userId; // 从查询参数中获取用户ID

    // 检查用户ID是否存在
    if (!userId) {
        return res.status(400).json({ message: '缺少用户 ID' });
    }

    // SQL 查询语句，查找指定用户的默认地址信息
    const sql = `
        SELECT *
        FROM Path
        WHERE P_userid = ? AND P_isDefault = TRUE
        LIMIT 1
    `;

    // 执行 SQL 查询
    connection.query(sql, [userId], function (error, results) {
        if (error) {
            console.error('查询失败:', error);
            return res.status(500).json({ message: '查询失败' });
        }

        // 检查是否找到默认地址
        if (results.length === 0) {
            return res.status(404).json({ message: '未找到默认地址' });
        }

        res.status(200).json({ defaultAddress: results[0] });
    });
});


// 购买接口
router.post('/purchase', (req, res) => {
    const { productId, buyId, sellId, addressId, unitPrice, quantity, totalPrice } = req.body;
    console.log(req.body);

    // 检查数据完整性
    if (!productId || !buyId || !sellId || !addressId || !unitPrice || !quantity || !totalPrice) {
        return res.status(400).json({ message: '缺少必要的购买信息' });
    }

    // 插入购买数据的 SQL 语句
    const insertSql = `
        INSERT INTO Purchase (productId, buyId, sellId, addressId, price, number, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // 执行 SQL 插入操作
    connection.query(insertSql, [productId, buyId, sellId, addressId, unitPrice, quantity, totalPrice], (error, results) => {
        if (error) {
            console.error('购买记录插入失败:', error);
            return res.status(500).json({ message: '购买失败' });
        }

            // 更新库存
            const updateStockSql = `
                UPDATE product SET store = store - ? WHERE id = ?
            `;

            connection.query(updateStockSql, [quantity, productId], (error) => {
                if (error) {
                    console.error('更新产品库存失败:', error);
                    return res.status(500).json({ message: '购买失败' });
                }

                res.status(200).json({ message: '购买成功', purchaseId: results.insertId });

        });
    });
});

// 查询某个用户的物品
router.get('/products/:userId', (req, res) => {
    const userId = req.params.userId;

    // 检查用户ID是否存在
    if (!userId) {
        return res.status(400).json({ message: '缺少用户ID' });
    }

    // 查询用户的物品
    const sql = `
        SELECT * FROM product WHERE userid = ?
    `;

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('查询用户物品失败:', error);
            return res.status(500).json({ message: '查询失败' });
        }

        res.status(200).json(results); // 返回查询到的物品
                console.log(results);
    });
});

// 查询我购买的
router.get('/buy/:userId', (req, res) => {
     const userId = req.params.userId;

        // SQL 查询语句
        const sql = `
            SELECT
                p.purchaseId,
                pr.id AS productId,
                pr.title,
                pr.description,
                pr.price1,
                pr.price2,
                p.buyId,
                p.sellId,
                p.addressId,
                                p.number,
                                p.total
            FROM
                Purchase p
            JOIN
                product pr ON p.productId = pr.id
            WHERE
                p.buyId = ?
        `;

        // 执行查询
        connection.query(sql, [userId], (error, results) => {
            if (error) {
                console.error('查询购买记录失败:', error);
                return res.status(500).json({ message: '查询失败' });
            }
                        console.log(results);
            res.status(200).json(results); // 返回查询结果
        });
});

// 查询我卖出的
router.get('/sell/:userId', (req, res) => {
     const userId = req.params.userId;

        // SQL 查询语句
        const sql = `
            SELECT
                p.purchaseId,
                pr.id AS productId,
                pr.title,
                pr.description,
                pr.price1,
                pr.price2,
                p.buyId,
                p.sellId,
                p.addressId,
                                p.number,
                                p.total
            FROM
                Purchase p
            JOIN
                product pr ON p.productId = pr.id
            WHERE
                p.sellId = ?
        `;

        // 执行查询
        connection.query(sql, [userId], (error, results) => {
            if (error) {
                console.error('查询购买记录失败:', error);
                return res.status(500).json({ message: '查询失败' });
            }
                        console.log(results);
            res.status(200).json(results); // 返回查询结果
        });
});


router.get('/goods/search', (req, res) => {
        console.log('搜索请求到达'); // 调试信息
    const keyword = req.query.name;  // 从请求中获取搜索关键词
    console.log(`搜索关键词: ${keyword}`);

    // 请求验证
    if (!keyword) {
        return res.status(400).json({ message: '关键词不能为空' });
    }

    const sql = 'SELECT * FROM product WHERE title LIKE ?'; // 使用LIKE进行模糊查询

    connection.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) {
            console.error('数据库查询错误:', err);
            return res.status(500).json({ message: '服务器错误' });
        }

        // 检查是否有结果
        if (results.length === 0) {
            return res.status(404).json({ message: '未找到相关商品' });
        }

        console.log('查询结果:', results); // 打印查询结果
        res.status(200).json(results);  // 返回查询结果
    });
});

// 获取用户的搜索历史
router.get('/getSearchHistory', (req, res) => {
    const userId = req.query.userId; // 从查询参数获取用户 ID

    // 检查参数是否存在
    if (!userId) {
        return res.status(400).json({ message: '缺少用户 ID' });
    }

    // SQL 查询语句
    const sql = `
        SELECT H_history
        FROM SearchHistory
        WHERE H_userid = ?
    `;

    // 执行 SQL 查询
    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('查询失败:', error);
            return res.status(500).json({ message: '查询失败' });
        }

        // 检查查询结果
        if (results.length === 0) {
            return res.status(404).json({ message: '未找到相关历史记录' });
        }

        // 返回匹配的历史记录
        res.status(200).json({ history: results.map(result => result.H_history) });
    });
});

router.post('/addSearchHistory', (req, res) => {
    const { userId, history } = req.body;

    // 检查参数是否存在
    if (!userId || !history) {
        return res.status(400).json({ message: '缺少用户 ID 或历史记录' });
    }

    // SQL 插入语句
    const sql = `
        INSERT INTO SearchHistory (H_userid, H_history)
        VALUES (?, ?)
    `;

    // 执行 SQL 插入
    connection.query(sql, [userId, history], (error, results) => {
        if (error) {
            console.error('插入失败:', error);
            return res.status(500).json({ message: '插入失败' });
        }
        res.status(200).json({ message: '搜索历史添加成功' });
    });
});

router.delete('/clearSearchHistory', (req, res) => {
    const userId = req.body.userId;

    // 检查用户 ID 是否存在
    if (!userId) {
        return res.status(400).json({ message: '缺少用户 ID' });
    }

    // SQL 删除语句
    const sql = `
        DELETE FROM SearchHistory
        WHERE H_userid = ?
    `;

    // 执行 SQL 删除
    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('删除失败:', error);
            return res.status(500).json({ message: '删除失败' });
        }
        res.status(200).json({ message: '搜索记录已清除' });
    });
});


router.post('/deleteFav', (req, res) => {
    const { listId, globalUserId } = req.body; // 解构从请求体中获取 listId 和 globalUserId
    console.log('Received listId:', listId);
    console.log('Received globalUserId:', globalUserId);

    // 检查 listId 和 globalUserId 是否存在
    if (!listId || listId.length === 0 || !globalUserId) {
        return res.status(400).json({ success: false, message: '缺少商品 ID 或 GlobalUserId' });
    }

    // SQL 删除语句
    const sql = `
        DELETE FROM favor
        WHERE F_productid IN (?) AND F_userid = ?
    `;

    // 执行 SQL 删除，删除符合 listId 列表且匹配 globalUserId 的记录
    connection.query(sql, [listId, globalUserId], (error, results) => {
        if (error) {
            console.error('删除失败:', error);
            return res.status(500).json({ success: false, message: '删除失败' });
        }

        if (results.affectedRows > 0) {
            return res.status(200).json({ success: true, message: '收藏夹记录已删除' });
        } else {
            return res.status(404).json({ success: false, message: '未找到符合条件的记录' });
        }
    });
});

// 添加新用户的路由
router.post('/addUser', (req, res) => {
  const { U_userPhone, U_userName, U_userPassword } = req.body;

  // 插入用户
  const query = 'INSERT INTO user (U_userPhone, U_userName, U_userPassword) VALUES (?, ?, ?)';
  connection.query(query, [U_userPhone, U_userName, U_userPassword], (error, results) => {
    if (error) {
      return res.status(400).json({ message: '创建用户失败', error: error.message });
    }
    res.status(201).json({ message: '用户创建成功', userId: results.insertId });
  });
});

// 定义上传图像的路由

router.post('/uploadImage', async (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, ''); // 去除头部
    console.log(base64Data)
        const buffer = Buffer.from(base64Data, 'base64');

    // 保存路径为项目中的 `../../static/test/image.jpg`
    const filePath = path.join(__dirname, '../../static/test', 'image.jpg');

    // 将 Buffer 写入文件
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('文件保存失败:', err);
        return res.status(500).json({ message: '文件保存失败' });
      }
      res.status(201).json({ message: '文件上传成功' });
    });
  } catch (error) {
    console.error('上传时出错:', error);
    res.status(500).json({ message: '上传时出错' });
  }
});

module.exports = router;
