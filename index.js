'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var parser$1 = require('@babel/parser');
var vueEslintParserPrivate = require('vue-eslint-parser-private');
var lodash = require('lodash');
var generate = require('@babel/generator');
var traverse = require('@babel/traverse');
var t = require('@babel/types');

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

var generate__default = /*#__PURE__*/_interopDefaultLegacy(generate);
var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var t__namespace = /*#__PURE__*/_interopNamespace(t);

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

var Parser = /*#__PURE__*/function () {
  function Parser(props) {
    _classCallCheck(this, Parser);

    this.content = props.content;
    this.type = props.type;
    this.ast = this._parser(this.content);
  }

  _createClass(Parser, [{
    key: "_parser",
    value: function _parser(script) {
      var Plugins = {
        js: [],
        vue: [],
        jsx: ['jsx'],
        ts: ['typescript'],
        tsx: ['jsx', 'typescript']
      };

      if (this.type === 'vue') {
        return vueEslintParserPrivate.parse(script, {
          sourceType: 'module'
        });
      }

      return parser$1.parse(script, {
        sourceType: 'module',
        plugins: Plugins[this.type]
      });
    }
  }]);

  return Parser;
}();

var parser = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Parser
});

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

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    this.fnName = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.identifier) || this.identifier;
  }

  _createClass(VueHelpers, [{
    key: "_renderKey",
    value: function _renderKey(ast) {
      var _this$options2;

      var loc = ast.loc;
      return (_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.ruleKey ? this.options.ruleKey(ast) : "".concat(ast.type, "_").concat(loc.start.line, "_").concat(loc.start.column, "_").concat(loc.end.line, "_").concat(loc.end.column);
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
              var diff = k.length - k.source.length;
              var range = [k1.range[0] + diff, k1.range[1] + diff];
              map[i][0] = _objectSpread$1(_objectSpread$1({}, map[i][0]), {}, {
                range: range
              });
            }

            if (k1.range[0] > k.range[0] && k1.range[1] < k.range[1]) {
              // contain
              var _diff = code.indexOf(k1.source);

              var _range = [_diff, _diff + k1.source.length];
              map[i][0] = _objectSpread$1(_objectSpread$1({}, map[i][0]), {}, {
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
        var v = "{{".concat(this.fnName, "('").concat(key, "')}}");
        this.map.set({
          type: 'VText',
          source: ast.value,
          range: ast.range,
          key: key,
          language: ast.value,
          length: v.length
        }, v);
      }

      if (ast.type === 'VLiteral') {
        var rawkey = ast.parent.key.rawName;
        var source = this.parser.content.slice(ast.parent.range[0], ast.parent.range[1]);

        var _v = ":".concat(rawkey, "=\"").concat(this.fnName, "('").concat(key, "')\"");

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

        var _v2 = "".concat(this.fnName, "('").concat(key, "')");

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
        var v = "".concat(this.fnName, "('").concat(key, "'").concat(args.length ? ',' : '', " ").concat(args.join(', '), ")");
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

      var ast = vueEslintParserPrivate.parse(code, {
        sourceType: 'module'
      });

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
    this.fnName = ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.identifier) || this.identifier;
    this.stack = [];
    this.VueHelpers = new VueHelpers(parser, options);
  }

  _createClass(Transform, [{
    key: "_key",
    value: function _key(node) {
      var _this$options2;

      var loc = node.loc;
      return (_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.ruleKey ? this.options.ruleKey(node) : "".concat(node.type, "_").concat(loc.start.line, "_").concat(loc.start.column, "_").concat(loc.end.line, "_").concat(loc.end.column);
    }
  }, {
    key: "_StringFunction",
    value: function _StringFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value));
      return t__namespace.expressionStatement(t__namespace.callExpression(t__namespace.identifier(this.fnName), [t__namespace.stringLiteral(key)]));
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
      return t__namespace.expressionStatement(t__namespace.callExpression(t__namespace.identifier(this.fnName), [t__namespace.stringLiteral(key)].concat(args)));
    }
  }, {
    key: "_JSXTextFunction",
    value: function _JSXTextFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value));
      return t__namespace.jSXExpressionContainer(t__namespace.callExpression(t__namespace.identifier(this.fnName), [t__namespace.stringLiteral(key)]));
    }
  }, {
    key: "_JSXAttributeFunction",
    value: function _JSXAttributeFunction(node) {
      var key = String(this._key(node));
      this.stack.push(_defineProperty({}, key, node.value.value));
      var value = t__namespace.jSXExpressionContainer(t__namespace.callExpression(t__namespace.identifier(this.fnName), [t__namespace.stringLiteral(key)]));
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

      return _objectSpread(_objectSpread({}, generate__default['default'](ast, options, this.parser.content)), {}, {
        stack: this.stack
      });
    }
  }]);

  return Transform;
}();

var transform = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Transform
});

function transformCode(code, config) {
  var parser = new Parser({
    content: code,
    type: config.type
  });
  var transform = new Transform(parser, config);
  return transform.render();
}

exports.Parser = parser;
exports.Transform = transform;
exports.transformCode = transformCode;
