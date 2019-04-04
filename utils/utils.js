let argv = {};
process.argv.forEach(v => {
    if (new RegExp('.+=.+').test(v)) {
        let p = v.split('='),
            key = p[0],
            val = p[1];
            argv[key] = val;
    }
})

const typeCheck = function () {
    let ret = {};
    ['String', 'Number', 'Array', 'Object', 'Function', 'Undefined'].forEach(function (val) {
        ret["is" + val] = function (arg) {
            return Object.prototype.toString.call(arg) === "[object " + val + "]";
        };
    });
    return ret;
}();

const isEmpty = p => {
    if (typeCheck.isObject(p)) {
        let keys = Object.getOwnPropertyNames(p);
        return keys.length === 0;
    }

    if (typeCheck.isArray(p)) {
        return p.length === 0;
    }

    if (p === null || p === undefined || p === '') {
        return true;
    }

    return false;
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
const getClientIP = req => {
    let origin = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
    
    return origin.replace(/(,|\s+)|(127\.0\.0\.1)/g,"");
};

module.exports = {
    argv,
    typeCheck,
    isEmpty,
    getClientIP
}