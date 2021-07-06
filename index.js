'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var prettier = require('prettier');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
var prettier__default = /*#__PURE__*/_interopDefaultLegacy(prettier);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var Type;

(function (Type) {
  Type["CHAR"] = "CHAR";
  Type["HTML"] = "HTML";
  Type["JSX"] = "JSX";
})(Type || (Type = {}));

var renderKey = function renderKey(filePath, rootPath) {
  var key = filePath.replace(rootPath, '').slice(1).replace(/\//g, '__').replace(/\..+$/, '');
  return key;
};

var checkInExpression = function checkInExpression(type, content, start) {
  var isVue = type === 'vue';
  var beforeContent = content.slice(0, start);
  var isAttributeExpression = isVue ? /:[a-zA-Z-]*=".*/.test(beforeContent) : /[a-zA-Z]={/.test(beforeContent);
  return isAttributeExpression;
};

var checkJSXExpression = function checkJSXExpression(type, content, start) {
  if (type === 'vue') {
    return false;
  }

  var beforeContent = content.slice(0, start);
  return /.*{$/.test(beforeContent);
};

var charParser = function charParser(content, regexp, line, attributeTag, type, cb) {
  var match = content.match(regexp);
  var variable = [];
  var chinese = /[\u4e00-\u9fa5]/;
  var attr = attributeTag > 0;
  var i = 0;

  if (!match) {
    return null;
  }

  var r = match.filter(function (item) {
    return chinese.test(item);
  }).map(function (item) {
    var start = content.indexOf(item);
    var end = start + item.length;
    var isAttributeExpression = attr ? checkInExpression(type, content, start) : false;
    var isJSXNodeExpression = !attr ? checkJSXExpression(type, content, start) : false;
    var output = item.replace(/\$\{.+?\}/g, function (match) {
      variable.push(match.slice(2, -1));
      return "{".concat(i++, "}");
    });
    return {
      source: content,
      line: line,
      output: output,
      variable: variable,
      start: start,
      end: end,
      type: Type.CHAR,
      isAttribute: attr,
      isAttributeExpression: isAttributeExpression,
      isJSXNodeExpression: isJSXNodeExpression
    };
  });
  cb();
  return r;
};

var tagParser = function tagParser(content, regexp, isVue, type, line, attributeTag, cb) {
  var variable = [];
  var i = 0;
  var match = content.match(regexp);
  if (!match) return {};
  var output = match[0];
  var start = match.index;
  var end = start + output.length;

  if (isVue) {
    output = output.replace(/\{\{.+?\}\}/g, function (match) {
      variable.push(match.slice(2, -2));
      return "{".concat(i++, "}");
    });
  }

  cb();
  return {
    source: content,
    line: line,
    output: output,
    variable: variable,
    start: start,
    end: end,
    isVueTag: isVue,
    type: type,
    isAttribute: attributeTag > 0
  };
};

var renderVueExpressionCode = function renderVueExpressionCode(source, code, start, end) {
  var tags = source.split('').map(function (item, index) {
    if (item === ' ') {
      return index;
    }

    return null;
  }).filter(function (item) {
    return typeof item === 'number';
  }).filter(function (item) {
    return item < start;
  });
  var tagIndex = tags[tags.length - 1];
  var rewriteCode = source.slice(0, tagIndex) + ' :' + source.slice(tagIndex + 1, start) + code + source.slice(end);
  return rewriteCode;
};

var renderOutputCode = function renderOutputCode(normalized, file) {
  if (normalized.length) {
    var code = file.split('\n');

    for (var index = 0; index < normalized.length; index++) {
      var item = normalized[index];

      if (normalized[index + 1] && item.line === normalized[index + 1].line) {
        var _ref = [item, normalized[index + 1]],
            current = _ref[0],
            next = _ref[1];
        var source = current.source,
            start = current.start,
            end = current.end;
        var rCode = source.slice(0, start) + current.code + source.slice(end, next.start) + next.code + next.source.slice(next.end);
        code[item.line] = rCode; // jump next line

        index++;
      } else {
        code[item.line] = item.rewriteCode;
      }
    }

    return code.join('\n');
  }

  return '';
};
var trackNormalized = function trackNormalized(filetrack, rootPath) {
  var json = filetrack.map(function (track, index) {
    var _ref3;

    var prefixKey = renderKey(track.filePath, rootPath);
    var output = track.output.replace(/^["'`]/, '').replace(/["'`]$/, '');

    if (filetrack[index + 1] && track.line === filetrack[index + 1].line) {
      var _ref2;

      var _key = "".concat(prefixKey, "___").concat(track.line, "____").concat(index);

      return _ref2 = {}, _defineProperty(_ref2, _key, output), _defineProperty(_ref2, "key", _key), _defineProperty(_ref2, "output", output), _ref2;
    }

    var key = "".concat(prefixKey, "___").concat(track.line);
    return _ref3 = {}, _defineProperty(_ref3, key, output), _defineProperty(_ref3, "key", key), _defineProperty(_ref3, "output", output), _ref3;
  });
  return json.map(function (item, index) {
    var code,
        filling = '',
        rewriteCode = '',
        itemTrack = filetrack[index];
    var variable = itemTrack.variable,
        fileType = itemTrack.fileType,
        type = itemTrack.type,
        start = itemTrack.start,
        end = itemTrack.end,
        source = itemTrack.source,
        isVueTag = itemTrack.isVueTag,
        isAttribute = itemTrack.isAttribute,
        isAttributeExpression = itemTrack.isAttributeExpression,
        isJSXNodeExpression = itemTrack.isJSXNodeExpression;

    if (Array.isArray(variable) && variable.length) {
      // filling expressions
      filling = ", ".concat(variable.join(', '));
    }

    if (fileType === 'js') {
      if (type === Type.CHAR && !isAttribute) {
        code = "j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, "))");
      } else {
        // isJSXNodeExpression {`xxx`} mode
        if (isAttribute && isAttributeExpression || isJSXNodeExpression) {
          code = "j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, "))");
        } else {
          code = "{ j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, ")) }");
        }
      }
    }

    if (fileType === 'vue') {
      if (isVueTag) {
        // vue tag
        code = "{{ j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, ")) }}");
      } else {
        if (isAttribute && !isAttributeExpression) {
          // vue attr
          code = "\"j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, "))\""); // add v-bind

          rewriteCode = renderVueExpressionCode(source, code, start, end);
        } else {
          // vue script
          code = "j18n.expand(j18n.load('".concat(item.key, "'").concat(filling, "))");
        }
      }
    }

    rewriteCode = rewriteCode || source.slice(0, start) + code + source.slice(end);
    return _objectSpread2(_objectSpread2(_objectSpread2({}, itemTrack), item), {}, {
      code: code,
      rewriteCode: rewriteCode
    });
  });
};
var parserCore = function parserCore(content, path) {
  var _double = /".*?"/g;
  var single = /'.*?'/g;
  var backtick = /`.*?`/g;
  var charRegexp = /["'`].*?["'`]/g;
  var htmlChineseRegexp = /(?<=>).{0,}[\u4e00-\u9fa5].{0,}(?=<)/;
  var allChineseRegexp = /[\u4e00-\u9fa5]{1,}.*?[\u4e00-\u9fa5]{1,}/;
  var isVue,
      type,
      attributeTag = 0,
      processed = false;

  if (path) {
    type = path.match(/\..*?$/)[0].slice(1);
    isVue = type === 'vue';
  }

  if (charRegexp.test(content) || htmlChineseRegexp.test(content) || allChineseRegexp.test(content)) {
    return content.split('\n').map(function (lineContent, line) {
      if (/<[a-zA-Z]+/.test(lineContent)) {
        attributeTag++;
      }

      var tagClose = function tagClose() {
        var close = /<.+>/.test(lineContent) || /^>/.test(lineContent.trim()) || /\/>/.test(lineContent);

        if (close) {
          attributeTag = attributeTag > 0 ? attributeTag - 1 : 0;
        }
      };

      if (isVue && attributeTag && _double.test(lineContent) && single.test(lineContent)) {
        // vue template ExpressionStatement
        return charParser(lineContent, single, line, attributeTag, type, tagClose);
      }

      if (htmlChineseRegexp.test(lineContent)) {
        return tagParser(lineContent, htmlChineseRegexp, isVue, Type.HTML, line, attributeTag, tagClose);
      }

      if (backtick.test(lineContent)) {
        return charParser(lineContent, backtick, line, attributeTag, type, tagClose);
      }

      if (charRegexp.test(lineContent)) {
        var parser = charParser(lineContent, charRegexp, line, attributeTag, type, tagClose);
        processed = true;

        if (parser && parser.length) {
          return parser;
        }
      }

      if (allChineseRegexp.test(lineContent) && !lineContent.includes('//') && !lineContent.includes('* ') && !/<!--.*-->/.test(lineContent)) {
        return tagParser(lineContent, allChineseRegexp, isVue, Type.JSX, line, attributeTag, tagClose);
      }

      !processed && tagClose();
      processed = false;
      return null;
    }).filter(function (item) {
      if (Array.isArray(item)) {
        return item.length > 0;
      }

      return !!item;
    }).flat().map(function (item) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        filePath: path,
        fileType: type
      });
    });
  }

  return [];
};

var rootPath = path__default['default'].join(__dirname, '../../..');
var readAllFile = function readAllFile(root) {
  var suffix = ['js', 'vue'];
  var paths = [];
  return new Promise(function (resole, reject) {
    var _loop = function _loop(i) {
      var mime = suffix[i];
      glob__default['default']("**/*.".concat(mime), {
        cwd: root,
        ignore: ['node_nodules']
      }, function (err, matches) {
        if (err) {
          reject();
          return console.error(err);
        }

        var absolutePath = matches.map(function (filename) {
          return path__default['default'].join(root, filename);
        });
        paths = paths.concat(absolutePath);

        if (i === suffix.length - 1) {
          resole(paths);
        }
      });
    };

    for (var i = 0; i < suffix.length; i++) {
      _loop(i);
    }
  });
};

var writeHandle = function writeHandle(err) {
  if (err) {
    console.log('写入失败', err);
    return false;
  }

  return true;
};

var normalizedJsonToFile = function normalizedJsonToFile(normalized) {
  var normalizedJson = {};

  if (normalized.length) {
    normalized.forEach(function (item) {
      Object.assign(normalizedJson, _defineProperty({}, item.key, item.output));
    });
  }

  return normalizedJson;
};
var parser = function parser(config) {
  var merge = function merge(file, path) {
    var filetrack = parserCore(file, path);
    var normalized = trackNormalized(filetrack, rootPath);
    var filename = null;

    if (path) {
      var pathSplit = path.split('/');
      filename = pathSplit[pathSplit.length - 1];
    }

    var type = normalized.length ? normalized[0].fileType : null;
    return {
      normalized: normalized,
      key: path,
      filename: filename,
      type: type
    };
  };

  var path = config.path,
      dir = config.dir,
      content = config.content;

  if (dir) {
    return readAllFile(dir).then(function (filePath) {
      return filePath.map(function (absolutePath) {
        var file = fs__default['default'].readFileSync(absolutePath, {
          encoding: 'utf8'
        });
        return merge(file, absolutePath);
      }).filter(function (item) {
        return item.normalized.length > 0;
      });
    });
  }

  if (path) {
    var file = fs__default['default'].readFileSync(path, {
      encoding: 'utf8'
    });
    return Promise.resolve([merge(file, path)]);
  }

  if (content) {
    return Promise.resolve([merge(content)]);
  }

  return Promise.resolve([]);
};
var writeOutputCode = function writeOutputCode(path, code, type) {
  var formatCode;

  try {
    formatCode = prettier__default['default'].format(code, {
      parser: type === 'js' ? 'babel' : 'vue',
      singleQuote: true,
      tabWidth: 2
    });
  } catch (e) {
    formatCode = code;
    fs__default['default'].promises.writeFile(path, formatCode).then(writeHandle);
    throw e;
  }

  return fs__default['default'].promises.writeFile(path, formatCode).then(writeHandle);
};
var writeLanguageZhCn = function writeLanguageZhCn(content, filePath) {
  var fileLinkPath = filePath || path__default['default'].join(rootPath, 'script/j18n/zh-cn.json');
  var source = prettier__default['default'].format(JSON.stringify(content), {
    parser: 'json-stringify'
  });
  return fs__default['default'].promises.writeFile(fileLinkPath, source).then(writeHandle);
};

function index (_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config) {
    var dir, _config$overwrite, overwrite, parserData, task, overwriteCode, mergeJson, errorFile;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dir = config.dir, _config$overwrite = config.overwrite, overwrite = _config$overwrite === void 0 ? false : _config$overwrite;
            parserData = [];

            if (!dir) {
              _context2.next = 9;
              break;
            }

            task = typeof dir === 'string' ? [parser(_objectSpread2(_objectSpread2({}, config), {}, {
              dir: dir
            }))] : dir.map(function (d) {
              return parser(_objectSpread2(_objectSpread2({}, config), {}, {
                dir: d
              }));
            });
            _context2.next = 6;
            return Promise.all(task);

          case 6:
            parserData = _context2.sent.flat();
            _context2.next = 12;
            break;

          case 9:
            _context2.next = 11;
            return parser(config);

          case 11:
            parserData = _context2.sent;

          case 12:
            overwriteCode = [];
            mergeJson = [];
            errorFile = [];
            parserData.map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(json) {
                var normalized, file, code;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        normalized = json.normalized;

                        if (json.key) {
                          file = fs__default['default'].readFileSync(json.key, {
                            encoding: 'utf8'
                          });
                        } else {
                          file = config.content;
                        }

                        code = renderOutputCode(normalized, file);
                        mergeJson.push.apply(mergeJson, _toConsumableArray(normalized));

                        if (!(json.type && json.key)) {
                          _context.next = 17;
                          break;
                        }

                        _context.prev = 5;

                        if (!overwrite) {
                          _context.next = 11;
                          break;
                        }

                        _context.next = 9;
                        return writeOutputCode(path__default['default'].normalize(json.key), code, json.type);

                      case 9:
                        _context.next = 12;
                        break;

                      case 11:
                        overwriteCode.push({
                          key: json.key,
                          code: code,
                          type: json.type
                        });

                      case 12:
                        _context.next = 17;
                        break;

                      case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](5);
                        errorFile.push({
                          name: json.key,
                          error: _context.t0.stack
                        });

                      case 17:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[5, 14]]);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            if (!overwrite) {
              _context2.next = 18;
              break;
            }

            return _context2.abrupt("return", {
              'zh-cn': normalizedJsonToFile(mergeJson),
              errorFile: errorFile
            });

          case 18:
            return _context2.abrupt("return", overwriteCode);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ref.apply(this, arguments);
}

exports.default = index;
exports.normalizedJsonToFile = normalizedJsonToFile;
exports.parser = parser;
exports.parserCore = parserCore;
exports.readAllFile = readAllFile;
exports.renderOutputCode = renderOutputCode;
exports.trackNormalized = trackNormalized;
exports.writeLanguageZhCn = writeLanguageZhCn;
exports.writeOutputCode = writeOutputCode;
