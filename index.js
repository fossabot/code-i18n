'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var parser$1 = require('@babel/parser');
var compilerDom = require('@vue/compiler-dom');
var lodash = require('lodash');
var traverse = require('@babel/traverse');
var generate = require('@babel/generator');
var t = require('@babel/types');
var compilerCore = require('@vue/compiler-core');

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

var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var generate__default = /*#__PURE__*/_interopDefaultLegacy(generate);
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
    var script = this.content;

    if (this.type === 'vue') {
      console.error('NOT SOPPORT TYPE');
      this.vueTemplateNode = this._parserVue();
      var scriptNode = this.vueTemplateNode.children.find(function (node) {
        return node.tag === 'script';
      });

      if (scriptNode) {
        script = scriptNode.children[0].content;
      } else {
        console.warn('TODO warn script-node null');
      }
    }

    this.ast = this._parser(script);
  }

  _createClass(Parser, [{
    key: "_parserVue",
    value: function _parserVue() {
      var ast = compilerDom.parse(this.content);
      return ast;
    }
  }, {
    key: "_parser",
    value: function _parser(script) {
      var Plugins = {
        js: [],
        vue: [],
        jsx: ['jsx'],
        ts: ['typescript'],
        tsx: ['jsx', 'typescript']
      };
      return parser$1.parse(script, {
        plugins: Plugins[this.type],
        sourceType: 'module'
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

var VueHelpers = /*#__PURE__*/function () {
  function VueHelpers() {
    _classCallCheck(this, VueHelpers);
  }

  _createClass(VueHelpers, [{
    key: "_generate",
    value: function _generate(nodes) {
      var _this = this;

      nodes.map(function (node) {
        if (node.type === 1) {
          _this._generate(node.children);
        }

        if (node.type === 2) ;

        if (node.type === 5) ;
      });
    }
  }, {
    key: "generate",
    value: function generate(vueAST) {
      var content = '';

      if (vueAST.template) {
        this._generate(vueAST.template.children);
      }

      return {
        code: content,
        stack: []
      };
    }
  }, {
    key: "traverse",
    value: function traverse(ast) {
      if (ast) {
        compilerCore.transform(ast, {
          nodeTransforms: [function (node, context) {}]
        });
      }

      return ast;
    }
  }, {
    key: "_transform",
    value: function _transform(transform) {
      var _transform$parser = transform.parser,
          ast = _transform$parser.ast,
          vueTemplateNode = _transform$parser.vueTemplateNode,
          _transform = transform._transform; // transform script

      var asted = _transform.call(transform, ast); // transform template


      var template = this.traverse(vueTemplateNode);
      return {
        ast: asted,
        template: template
      };
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
    this.vueHelpers = new VueHelpers();
  }

  _createClass(Transform, [{
    key: "_key",
    value: function _key(node) {
      var _this$options2, _node$loc, _node$loc2;

      return (_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.ruleKey ? this.options.ruleKey(node) : "".concat(node.type, "_").concat((_node$loc = node.loc) === null || _node$loc === void 0 ? void 0 : _node$loc.start.column, "_").concat((_node$loc2 = node.loc) === null || _node$loc2 === void 0 ? void 0 : _node$loc2.end.column);
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
    value: function _transform(script) {
      var ast = lodash.cloneDeep(script || this.parser.ast);
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
      var type = this.parser.type;

      if (type === 'vue') {
        return this.vueHelpers._transform(this);
      }

      return this._transform();
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultRenderOptions;
      var type = this.parser.type;
      var ast = this.transform();

      if (type === 'vue') {
        return this.vueHelpers.generate(ast);
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
