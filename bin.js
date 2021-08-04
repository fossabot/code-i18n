#!/usr/bin/env node
'use strict';

var commander = require('commander');
var lodash = require('lodash');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var ora = require('ora');
var parser = require('@babel/parser');
var vueEslintParserPrivate = require('vue-eslint-parser-private');
var generate = require('@babel/generator');
var traverse = require('@babel/traverse');
var t = require('@babel/types');
var prettier = require('prettier');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var generate__default = /*#__PURE__*/_interopDefaultLegacy(generate);
var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var t__namespace = /*#__PURE__*/_interopNamespace(t);

var version = "2.4.0";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Plugins = {
  js: [],
  vue: [],
  jsx: ['jsx'],
  ts: ['typescript'],
  tsx: ['jsx', 'typescript']
};

var Parser = /*#__PURE__*/function () {
  function Parser(props) {
    _classCallCheck(this, Parser);

    var DEFAULT_PARSER_OPTIONS = {
      // https://github.com/eslint/espree#options
      vue: {
        sourceType: 'module',
        ecmaVersion: 11,
        ecmaFeatures: {
          experimentalObjectRestSpread: true
        }
      },
      babel: {
        sourceType: 'module'
      }
    };
    this.parserOptions = lodash.merge(DEFAULT_PARSER_OPTIONS, props.parserOptions);
    this.content = props.content;
    this.type = props.type;
    this.ast = this._parser();
  }

  _createClass(Parser, [{
    key: "_parser",
    value: function _parser() {
      if (this.type === 'vue') {
        return vueEslintParserPrivate.parse(this.content, this.parserOptions.vue);
      }

      var options = this.parserOptions.babel;
      options.plugins = (options.plugins || []).concat(Plugins[this.type]);
      return parser.parse(this.content, options);
    }
  }]);

  return Parser;
}();

function isContainChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var VueHelpers = /*#__PURE__*/function () {
  function VueHelpers(parser, options) {
    var _this$options;

    _classCallCheck(this, VueHelpers);

    _defineProperty(this, "identifier", '$t');

    this.map = new Map();
    this.options = options;
    this.parser = parser;
    this.stack = [];
    this.content = this.parser.content;
    this.identifier = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.identifier) || this.identifier;
  }

  _createClass(VueHelpers, [{
    key: "_renderKey",
    value: function _renderKey(ast) {
      var _this$options2;

      var loc = ast.loc;
      return (_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.ruleKey ? this.options.ruleKey(ast, this.options.path) : "".concat(ast.type, "_").concat(loc.start.line, "_").concat(loc.start.column, "_").concat(loc.end.line, "_").concat(loc.end.column);
    }
  }, {
    key: "_generate",
    value: function _generate() {
      var _this$stack;

      var stack = [];

      var map = _toConsumableArray(this.map.entries());

      var code = this.content;

      var _iterator = _createForOfIteratorHelper(map),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              k = _step$value[0],
              v = _step$value[1];

          code = code.slice(0, k.range[0]) + v + code.slice(k.range[1]);
          stack.push(_defineProperty({}, k.key, k.language)); // recalculate

          for (var i = 0; i < map.length; i++) {
            var _map$i = _slicedToArray(map[i], 1),
                k1 = _map$i[0];

            if (k1.range[0] > k.range[1]) {
              var diff = k.length - (k.sourceLength || k.source.length);
              var range = [k1.range[0] + diff, k1.range[1] + diff];
              map[i][0] = _objectSpread$2(_objectSpread$2({}, map[i][0]), {}, {
                range: range
              });
            }

            if (k1.range[0] > k.range[0] && k1.range[1] < k.range[1]) {
              // contain
              var _diff = code.indexOf(k1.source);

              var _range = [_diff, _diff + k1.source.length];
              map[i][0] = _objectSpread$2(_objectSpread$2({}, map[i][0]), {}, {
                range: _range
              });
            }
          }
        } // clear map

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.map = new Map(); // keep stack

      (_this$stack = this.stack).push.apply(_this$stack, stack);

      this.content = code;
      return {
        code: code,
        stack: this.stack
      };
    }
  }, {
    key: "_traverseTemplateBody",
    value: function _traverseTemplateBody(ast) {
      if (!isContainChinese(ast.value)) {
        return;
      }

      var key = this._renderKey(ast);

      if (ast.type === 'VText') {
        var v = "{{".concat(this.identifier, "('").concat(key, "')}}"); // fixed html Escape

        var sourceLength = this.parser.content.slice(ast.range[0], ast.range[1]).length;
        this.map.set({
          type: 'VText',
          source: ast.value,
          sourceLength: sourceLength,
          range: ast.range,
          key: key,
          language: ast.value,
          length: v.length
        }, v);
      }

      if (ast.type === 'VLiteral') {
        var rawkey = ast.parent.key.rawName;
        var source = this.parser.content.slice(ast.parent.range[0], ast.parent.range[1]);

        var _v = ":".concat(rawkey, "=\"").concat(this.identifier, "('").concat(key, "')\"");

        this.map.set({
          type: 'VLiteral',
          source: source,
          range: ast.parent.range,
          key: key,
          language: ast.value,
          length: _v.length
        }, _v);
      }

      if (ast.type === 'Literal') {
        var _source = ast.raw;

        var _v2 = "".concat(this.identifier, "('").concat(key, "')");

        this.map.set({
          type: 'Literal',
          source: _source,
          range: ast.range,
          key: key,
          language: _source.slice(1, -1),
          length: _v2.length
        }, _v2);
      }
    }
  }, {
    key: "_traverseTemplateLiteral",
    value: function _traverseTemplateLiteral(ast) {
      if (ast.quasis.find(function (quasi) {
        return isContainChinese(quasi.value.raw);
      })) {
        var key = this._renderKey(ast);

        var content = this.content;
        var source = content.slice(ast.start, ast.end);
        var args = ast.expressions.map(function (expression) {
          return content.slice(expression.start, expression.end);
        });
        var language = source,
            i = 0;
        args.map(function (arg) {
          var regexp = new RegExp("\\$\\{.{0,}".concat(arg.split('').map(function (item) {
            return /[\da-zA-Z]/.test(item) ? item : '\\' + item;
          }).join('').slice(2), ".{0,}\\}"));
          language = language.replace(regexp, "{".concat(i++, "}"));
        });
        var v = "".concat(this.identifier, "('").concat(key, "'").concat(args.length ? ',' : '', " ").concat(args.join(', '), ")");
        this.map.set({
          type: 'TemplateLiteral',
          source: source,
          range: ast.range,
          key: key,
          language: language.slice(1, -1),
          length: v.length
        }, v);
      }
    }
  }, {
    key: "_traverse",
    value: function _traverse(ast, keys) {
      var self = this;
      vueEslintParserPrivate.traverseNodes(ast, {
        visitorKeys: keys,
        enterNode: function enterNode(node, parent) {
          if (keys.includes(node.type) && node.type === 'TemplateLiteral') {
            self._traverseTemplateLiteral(node);
          } else {
            self._traverseTemplateBody(node);
          }
        },
        leaveNode: function leaveNode(node, parent) {}
      });
    }
  }, {
    key: "_transform",
    value: function _transform() {
      this._traverse(this.parser.ast, ['Literal', 'VText', 'VAttribute', 'VLiteral']);

      var _this$_generate = this._generate(),
          code = _this$_generate.code;

      var ast = vueEslintParserPrivate.parse(code, this.parser.parserOptions.vue);

      this._traverse(ast, ['TemplateLiteral']);
    }
  }, {
    key: "generate",
    value: function generate() {
      this._transform();

      return this._generate();
    }
  }]);

  return VueHelpers;
}();

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var defaultRenderOptions = {
  retainLines: true,
  jsescOption: {
    quotes: 'single'
  }
};

var Transform = /*#__PURE__*/function () {
  function Transform(parser, options) {
    var _this$options;

    _classCallCheck(this, Transform);

    _defineProperty(this, "identifier", '$t');

    this.parser = parser;
    this.options = options;
    this.identifier = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.identifier) || this.identifier;
    this.stack = [];
    this.VueHelpers = new VueHelpers(parser, options);
  }

  _createClass(Transform, [{
    key: "_key",
    value: function _key(node) {
      var _this$options2;

      var loc = node.loc;
      return (_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.ruleKey ? this.options.ruleKey(node, this.options.path) : "".concat(node.type, "_").concat(loc.start.line, "_").concat(loc.start.column, "_").concat(loc.end.line, "_").concat(loc.end.column);
    }
  }, {
    key: "_StringFunction",
    value: function _StringFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value));
      return t__namespace.callExpression(t__namespace.identifier(this.identifier), [t__namespace.stringLiteral(key)]);
    }
  }, {
    key: "_TemplateFunction",
    value: function _TemplateFunction(node) {
      var key = String(this._key(node));
      var args = [];
      var index = 0;
      var value = node.quasis.map(function (quasis) {
        if (quasis.value.raw) {
          return quasis.value.raw;
        } else {
          return "{".concat(index++, "}");
        }
      });
      this.stack.push(_defineProperty({}, key, value.join('')));
      node.expressions.map(function (expression) {
        if (!t__namespace.isTSType(expression)) {
          args.push(expression);
        }
      });
      return t__namespace.callExpression(t__namespace.identifier(this.identifier), [t__namespace.stringLiteral(key)].concat(args));
    }
  }, {
    key: "_JSXTextFunction",
    value: function _JSXTextFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value));
      return t__namespace.jSXExpressionContainer(t__namespace.callExpression(t__namespace.identifier(this.identifier), [t__namespace.stringLiteral(key)]));
    }
  }, {
    key: "_JSXAttributeFunction",
    value: function _JSXAttributeFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value.value));
      var value = t__namespace.jSXExpressionContainer(t__namespace.callExpression(t__namespace.identifier(this.identifier), [t__namespace.stringLiteral(key)]));
      return t__namespace.jSXAttribute(node.name, value);
    }
  }, {
    key: "_transform",
    value: function _transform() {
      var ast = lodash.cloneDeep(this.parser.ast);
      var self = this;
      traverse__default['default'](ast, {
        StringLiteral: function StringLiteral(path) {
          if (isContainChinese(path.node.value)) {
            path.replaceWith(self._StringFunction(path.node));
          }
        },
        TemplateLiteral: function TemplateLiteral(path) {
          if (path.node.quasis.find(function (quasi) {
            return isContainChinese(quasi.value.raw);
          })) {
            path.replaceWith(self._TemplateFunction(path.node));
          }
        },
        JSXText: function JSXText(path) {
          if (isContainChinese(path.node.value)) {
            path.replaceWith(self._JSXTextFunction(path.node));
          }
        },
        JSXAttribute: function JSXAttribute(path) {
          var value = path.node.value;

          if (t__namespace.isStringLiteral(value) && isContainChinese(value.value)) {
            path.replaceWith(self._JSXAttributeFunction(path.node));
          }
        }
      });
      return ast;
    }
  }, {
    key: "transform",
    value: function transform() {
      if (t__namespace.isFile(this.parser.ast)) {
        return this._transform();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRenderOptions;
      var ast = this.transform();

      if (!t__namespace.isFile(this.parser.ast)) {
        return this.VueHelpers.generate();
      }

      var config = lodash.merge(defaultRenderOptions, options || {});
      return _objectSpread$1(_objectSpread$1({}, generate__default['default'](ast, config, this.parser.content)), {}, {
        stack: this.stack,
        ast: ast
      });
    }
  }]);

  return Transform;
}();

function transformCode(code, config) {
  var parser = new Parser({
    content: code,
    type: config.type,
    parserOptions: config.parserOptions
  });
  var transform = new Transform(parser, config);
  return transform.render(config.generatorOptions);
}

function log() {
  var _console;

  for (var _len = arguments.length, message = new Array(_len), _key = 0; _key < _len; _key++) {
    message[_key] = arguments[_key];
  }

  (_console = console).log.apply(_console, ["".concat(chalk__default['default'].blue("[".concat(Date.now(), "] [Log] Debug ")))].concat(message));
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var root = process.cwd();
var spinner = ora__default['default']();

function crop(s) {
  return s.length > 36 ? s.slice(0, 18) + ' ...... ' + s.slice(-18) : s;
}

function formatOutput(message, stack) {
  var t = message.map(function (_ref) {
    var code = _ref.code,
        stack = _ref.stack,
        name = _ref.name;
    return {
      name: name || null,
      code: crop(code),
      stack: crop(stack.map(function (s) {
        return JSON.stringify(s);
      }).join(','))
    };
  });
  console.table(t);

  if (stack) {
    var stackPath = path__default['default'].resolve(root, stack);
    var so = message.map(function (m) {
      return m.stack;
    }).flat();
    var o = so.reduce(function (prev, cur) {
      var k = lodash.keys(cur)[0];
      prev[k] = cur[k];
      return prev;
    }, {});
    fs__default['default'].writeFileSync(stackPath, prettier.format(JSON.stringify(o), {
      parser: 'json'
    }));
  }
}

function transformFile(filename, write, config) {
  var filepath = path__default['default'].resolve(root, filename);
  var filetype = path__default['default'].extname(filepath).slice(1);
  var content = fs__default['default'].readFileSync(filepath, 'utf-8');

  var _transformCode = transformCode(content, _objectSpread({
    type: filetype,
    path: filepath
  }, config)),
      code = _transformCode.code,
      stack = _transformCode.stack,
      ast = _transformCode.ast;

  if (config.prettier && typeof config.prettier === 'function') {
    code = config.prettier(code, ast);
  }

  if (typeof write === 'string') {
    fs__default['default'].writeFileSync(path__default['default'].resolve(root, write), code);
  }

  if (typeof write === 'boolean' && write) {
    fs__default['default'].writeFileSync(filepath, code);
  }

  return {
    code: code,
    stack: stack
  };
}
function transformDirectory(dir, config) {
  spinner.start('Transform ...');
  var dirpath = path__default['default'].resolve(root, dir);
  return new Promise(function (resolve, reject) {
    glob__default['default']("**/*.".concat(config.type), {
      cwd: dirpath
    }, function (err, matches) {
      if (err) {
        console.log(err);
      } else {
        var paths = matches.map(function (item) {
          return path__default['default'].join(dirpath, item);
        });
        var content = paths.map(function (p) {
          return fs__default['default'].readFileSync(p, 'utf-8');
        });
        var message = content.map(function (item, index) {
          return /[\u4e00-\u9fa5]/.test(item) ? {
            content: item,
            path: paths[index]
          } : false;
        }).filter(function (a) {
          return a;
        }).map(function (source) {
          if (!source) {
            return;
          }

          try {
            if (config.debug) {
              log('Source: ', source);
            }

            var _transformCode2 = transformCode(source.content, _objectSpread(_objectSpread({}, config), {}, {
              path: source.path
            })),
                code = _transformCode2.code,
                stack = _transformCode2.stack,
                _ast = _transformCode2.ast;

            if (config.prettier && typeof config.prettier === 'function') {
              code = config.prettier(code, _ast);
            }

            if (config.write && stack.length > 0) {
              fs__default['default'].writeFileSync(source.path, code, {
                encoding: 'utf-8'
              });
            }

            return {
              code: code,
              stack: stack,
              name: source.path
            };
          } catch (e) {
            spinner.fail('Conversion failed ' + chalk__default['default'].blue(source.path + ':\n') + JSON.stringify(e));
          }
        }).filter(function (item) {
          return item === null || item === void 0 ? void 0 : item.stack.length;
        });
        spinner.succeed('Successful conversion');
        resolve(message);
      }
    });
  });
}
function exec(_x) {
  return _exec.apply(this, arguments);
}

function _exec() {
  _exec = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(command) {
    var configFile, config, have, _transformCode3, code, stack, _ast2, filename, _transformFile, _code, _stack, message;

    return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            configFile = path__default['default'].resolve(root, '.code-i18n.js');
            config = {
              write: false
            };

            if (!command.config) {
              _context.next = 6;
              break;
            }

            config = require(path__default['default'].resolve(root, command.config));
            _context.next = 10;
            break;

          case 6:
            _context.next = 8;
            return new Promise(function (r) {
              fs__default['default'].access(configFile, function (err) {
                return r(!err);
              });
            })["catch"](function (e) {
              console.log(chalk__default['default'].red(e));
            });

          case 8:
            have = _context.sent;

            if (have) {
              config = require(configFile);
            }

          case 10:
            config = lodash.merge(config, lodash.cloneDeep(command));

            if (config.debug) {
              log('Config: ', config);
            }

            if (!(['code', 'name', 'dir'].filter(function (item) {
              return lodash.keys(config).includes(item);
            }).length >= 2)) {
              _context.next = 15;
              break;
            }

            console.log(chalk__default['default'].yellow('Only one of code, name, dir can be selected'));
            return _context.abrupt("return");

          case 15:
            if (!(config.code && !config.type)) {
              _context.next = 18;
              break;
            }

            console.log(chalk__default['default'].yellow('When using the optional code parameter, you must specify its type'));
            return _context.abrupt("return");

          case 18:
            if (!(config.dir && typeof config.write === 'string')) {
              _context.next = 21;
              break;
            }

            console.log(chalk__default['default'].yellow('Cannot use --write(path) when using --dir'));
            return _context.abrupt("return");

          case 21:
            if (!(config.dir && !config.type)) {
              _context.next = 24;
              break;
            }

            console.log(chalk__default['default'].yellow('When you specify the path, you must set its --type, let me know which files you need to convert'));
            return _context.abrupt("return");

          case 24:
            if (!(config.type && !['js', 'jsx', 'ts', 'tsx', 'vue'].includes(config.type))) {
              _context.next = 27;
              break;
            }

            console.log(chalk__default['default'].yellow("The optional type parameter is ".concat(config.type, ", one of these must be specified ['js','jsx','ts','tsx','vue']")));
            return _context.abrupt("return");

          case 27:
            if (config.code) {
              _transformCode3 = transformCode(config.code, config), code = _transformCode3.code, stack = _transformCode3.stack, _ast2 = _transformCode3.ast;

              if (config.prettier && typeof config.prettier === 'function') {
                code = config.prettier(code, _ast2);
              }

              if (typeof config.write === 'string') {
                filename = path__default['default'].resolve(root, config.write);
                fs__default['default'].writeFileSync(filename, code);
              }

              if (typeof config.write === 'boolean' && config.write) {
                console.log(chalk__default['default'].yellow('When using --code, --write needs to specify the path'));
              }

              formatOutput([{
                code: code,
                stack: stack
              }], config.stack);
            }

            if (config.name) {
              _transformFile = transformFile(config.name, config.write, config), _code = _transformFile.code, _stack = _transformFile.stack;
              formatOutput([{
                code: _code,
                stack: _stack,
                name: config.name
              }], config.stack);

              if (config.write) {
                console.log(chalk__default['default'].green("The writing is successful, the file name is '".concat(config.name, "'")));
              }
            }

            if (!config.dir) {
              _context.next = 36;
              break;
            }

            if (config.type) {
              config = lodash.merge(config, {
                type: config.type
              });
            }

            _context.next = 33;
            return transformDirectory(config.dir, config);

          case 33:
            message = _context.sent;
            formatOutput(message, config.stack);

            if (config.write) {
              console.log(chalk__default['default'].green("The writing is successful, and the following path is '".concat(config.dir, "'")));
            }

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _exec.apply(this, arguments);
}

var program = new commander.Command();
program.version(version, '-v, --version');
program.name('code-i18n').usage('[options]');
program.description('Convert your code to help you code quickly (internationalization)').allowUnknownOption().option('--debug', 'Output more information for debugging the program', false).option('--config <path>', 'Specify the configuration file').option('-c, --code <code>', 'Convert the specified code').option('-n, --name <file name>', 'Convert the specified file').option('-d, --dir <directory>', 'Convert files under the specified path').option('-s, --stack <file name>', 'Specify the output location of the collected language pack (json)').option('-w, --write [path]', 'Specify the write path (only used in --code and --name) or overwrite the current file', false).option('-t, --type <js | jsx | ts | tsx | vue>', 'Specify the current code type, must be specified when using --code').action(function (command) {
  if (isEmpty(command)) {
    program.outputHelp();
  } else {
    exec(command);
  }
}).parse(process.argv);

function isEmpty(command) {
  return lodash.keys(command).length <= 2;
}
