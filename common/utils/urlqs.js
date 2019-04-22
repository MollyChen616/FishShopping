/* 地址参数处理 */
/**
 * 本方法中的
 * 	parse,stringify
 * 兼容了 qs.js 如果本方法出现bug 可以切换为 qs.js
 **/
let _if_encode = true,
	_if_decode = true;
const rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	op = Object.prototype,
	ap = Array.prototype,
	aeach = ap.forEach,
	ostring = op.toString;
const isFunction = function(it) {
	return ostring.call(it) === '[object Function]';
}
const isArray = function(it) {
	return ostring.call(it) === '[object Array]';
}
const isObject = function(it) {
	return ostring.call(it) === '[object Object]';
}
const _encodeValue = function(value) {
	if (_if_encode) {
		return encodeURIComponent(value);
	}
	return value;
}
const _decodeValue = function(value) {
	if (_if_decode) {
		return decodeURIComponent(value);
	}
	return value;
}
// 对象 转为 string
const stringify = function(a, if_encode = true) {
	if (!a) {
		return '';
	}
	_if_encode = if_encode;
	let prefix, s = [];
	const add = function(key, valueOrFunction) {
		let value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
		s[s.length] = key + '=' +
			_encodeValue(value == null ? '' : value);
	};
	const buildParams = function(prefix, obj, add) {
		if (isArray(obj)) {
			aeach.call(obj, function(v, i) {
				if (rbracket.test(prefix)) {
					add(prefix, v);
				} else {
					buildParams(
						// prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
						prefix + '[' + i + ']',
						v,
						add
					);
				}
			});
		} else if (isObject(obj)) {
			for (let name in obj) {
				buildParams(prefix + '[' + name + ']', obj[name], add);
			}
		} else {
			add(prefix, obj);
		}
	}
	if (isArray(a)) {
		aeach.call(a, function(item) {
			add(item.name, item.value);
		});
	} else {
		for (prefix in a) {
			buildParams(prefix, a[prefix], add);
		}
	}
	return s.join('&');
};
/* 字符串解析成对象 str = > obj */
const parse = function(p, if_decode = true) {
	_if_decode = if_decode;
	let _p = p;
	let params = {};
	if (!p) {
		return params;
	}
	if (typeof p == 'string') {
		let pairs = p.split('&');
		if (pairs.length < 1) {
			return params;
		}
		_p = {};
		for (let i = 0; i < pairs.length; i++) {
			let pair = pairs[i].split('=');
			_p[pair[0]] = pair[1];
		}
	}
	for (let key in _p) {
		let accessors = [];
		let value = _decodeValue(_p[key]);
		let name = key.replace(/\[([a-zA-Z0-9_-]*)\]/g, function(k, acc) {
			accessors.push(acc);
			return "";
		});
		accessors.unshift(name);
		let o = params;
		let _l = accessors.length - 1;
		let acc;
		for (let j = 0; j < _l; j++) {
			acc = accessors[j];
			let nextAcc = accessors[j + 1];
			if (!o[acc]) {
				if ((nextAcc == "") || (/^[0-9]+$/.test(nextAcc)))
					o[acc] = [];
				else
					o[acc] = {};
			}
			o = o[acc];
		}
		acc = accessors[_l];
		if (acc == "") {
			o.push(value);
		} else {
			o[acc] = value;
		}
	}
	return params;
};
const url_split_query = function(input = '') {
	/* 分割地址串 */
	let res = {
		url: input,
		query: '',
		hash: '',
	}
	let u_arr = input.split('?');
	let q_arr = [];
	// 获取hash
	aeach.call(u_arr, function(v, index) {
		const h = v.split('#');
		if (!res.hash && h[1]) {
			// 仅仅取第一个有效 - 一般单页面路由 仅仅是第一个作为路由？！
			res.hash = h[1];
		}
		if (index === 0) {
			res.url = h[0];
		} else {
			q_arr.push(h[0]);
		}
	});
	if (q_arr.length > 0) {
		res.query = q_arr.join('&')
	}
	return res;
}
/* 地址串追加新的参数 return string*/
const url_add_query = (url_str, query, if_encode = true) => {
	if (!url_str) {
		console.error('参数url_str有误');
		return '';
	}
	let url_obj = url_split_query(url_str);
	let res_url = url_obj.url;
	let res_query_arr = [];
	if (url_obj.query) {
		res_query_arr.push(url_obj.query);
	}
	// 新追加的参数
	if (query) {
		let res_query = stringify(query, if_encode);
		if (res_query) {
			res_query_arr.push(res_query);
		}
	}
	// 拼接新地址
	if (res_query_arr.length > 0) {
		res_url += '?' + res_query_arr.join('&');
	}
	// 拼接hash
	if (url_obj.hash) {
		res_url += '#' + url_obj.hash;
	}
	return res_url;
};
/* 从地址上获取请求的参数  return obj*/
const url_get_query = (param, if_decode = true) => {
	let res = {};
	if (!param) {
		return {};
	}
	if (typeof param == 'string') {
		let url_obj = url_split_query(param);
		if (url_obj.query) {
			res = parse(url_obj.query, if_decode);
		}
	} else {
		res = parse(param, if_decode);
	}
	return res;
};
export default {
	parse,
	stringify,
	url_add_query,
	url_get_query,
	url_split_query
}
