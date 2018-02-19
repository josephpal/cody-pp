import Blockly from 'node-blockly/browser';
const goog = Blockly.goog;

/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2014 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating ArduinoCpp for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.ArduinoCpp');

goog.require('Blockly.Generator');


/**
 * ArduinoCpp code generator.
 * @type {!Blockly.Generator}
 */
Blockly.ArduinoCpp = new Blockly.Generator('ArduinoCpp');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.ArduinoCpp.addReservedWords(
    // https://www.ArduinoCpplang.org/docs/spec/latest/ArduinoCpp-language-specification.pdf
    // Section 16.1.1
    'assert,break,case,catch,class,const,continue,default,do,else,enum,' +
    'extends,false,final,finally,for,if,in,is,new,null,rethrow,return,super,' +
    'switch,this,throw,true,try,var,void,while,with,' +
    // https://api.ArduinoCpplang.org/ArduinoCpp_core.html
    'print,identityHashCode,identical,BidirectionalIterator,Comparable,' +
    'double,Function,int,Invocation,Iterable,Iterator,List,Map,Match,num,' +
    'Pattern,RegExp,Set,StackTrace,String,StringSink,Type,bool,DateTime,' +
    'Deprecated,Duration,Expando,Null,Object,RuneIterator,Runes,Stopwatch,' +
    'StringBuffer,Symbol,Uri,Comparator,AbstractClassInstantiationError,' +
    'ArgumentError,AssertionError,CastError,ConcurrentModificationError,' +
    'CyclicInitializationError,Error,Exception,FallThroughError,' +
    'FormatException,IntegerDivisionByZeroException,NoSuchMethodError,' +
    'NullThrownError,OutOfMemoryError,RangeError,StackOverflowError,' +
    'StateError,TypeError,UnimplementedError,UnsupportedError'
);

/**
 * Order of operation ENUMs.
 * https://www.ArduinoCpplang.org/docs/ArduinoCpp-up-and-running/ch02.html#operator_table
 */
Blockly.ArduinoCpp.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] . ?.
Blockly.ArduinoCpp.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.ArduinoCpp.ORDER_ADDITIVE = 4;       // + -
Blockly.ArduinoCpp.ORDER_SHIFT = 5;          // << >>
Blockly.ArduinoCpp.ORDER_BITWISE_AND = 6;    // &
Blockly.ArduinoCpp.ORDER_BITWISE_XOR = 7;    // ^
Blockly.ArduinoCpp.ORDER_BITWISE_OR = 8;     // |
Blockly.ArduinoCpp.ORDER_RELATIONAL = 9;     // >= > <= < as is is!
Blockly.ArduinoCpp.ORDER_EQUALITY = 10;      // == !=
Blockly.ArduinoCpp.ORDER_LOGICAL_AND = 11;   // &&
Blockly.ArduinoCpp.ORDER_LOGICAL_OR = 12;    // ||
Blockly.ArduinoCpp.ORDER_IF_NULL = 13;       // ??
Blockly.ArduinoCpp.ORDER_CONDITIONAL = 14;   // expr ? expr : expr
Blockly.ArduinoCpp.ORDER_CASCADE = 15;       // ..
Blockly.ArduinoCpp.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.ArduinoCpp.ORDER_NONE = 99;          // (...)

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.ArduinoCpp.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.ArduinoCpp.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.ArduinoCpp.functionNames_ = Object.create(null);

  if (!Blockly.ArduinoCpp.variableDB_) {
    Blockly.ArduinoCpp.variableDB_ =
        new Blockly.Names(Blockly.ArduinoCpp.RESERVED_WORDS_);
  } else {
    Blockly.ArduinoCpp.variableDB_.reset();
  }

  var defvars = [];
  var variables = workspace.getAllVariables();
  if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.ArduinoCpp.variableDB_.getName(variables[i].name,
          Blockly.Variables.NAME_TYPE);
    }
    Blockly.ArduinoCpp.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.ArduinoCpp.finish = function(code) {
  // Indent every line.
  /*if (code) {
    code = Blockly.ArduinoCpp.prefixLines(code, Blockly.ArduinoCpp.INDENT);
  }
  code = "#include <Engine.h>\n" + "#include <Lamp.h>\n" + "#include " + "<" + "time.h" + ">" + "\n\n" + "int main() {\n" + code + "    " + "return 0; \n}";
*/
  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.ArduinoCpp.definitions_) {
    var def = Blockly.ArduinoCpp.definitions_[name];
    if (def.match(/^import\s/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  // Clean up temporary data.
  delete Blockly.ArduinoCpp.definitions_;
  delete Blockly.ArduinoCpp.functionNames_;
  Blockly.ArduinoCpp.variableDB_.reset();
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.ArduinoCpp.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped ArduinoCpp string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} ArduinoCpp string.
 * @private
 */
Blockly.ArduinoCpp.quote_ = function(string) {
  // Can't use goog.string.quote since $ must also be escaped.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating ArduinoCpp from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The ArduinoCpp code created for this block.
 * @return {string} ArduinoCpp code with comments and subsequent blocks added.
 * @private
 */
Blockly.ArduinoCpp.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.ArduinoCpp.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use documentation comment for function comments.
        commentCode += Blockly.ArduinoCpp.prefixLines(comment + '\n', '/// ');
      } else {
        commentCode += Blockly.ArduinoCpp.prefixLines(comment + '\n', '// ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.ArduinoCpp.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.ArduinoCpp.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.ArduinoCpp.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.ArduinoCpp.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.ArduinoCpp.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta) {
    var at = Blockly.ArduinoCpp.valueToCode(block, atId,
        Blockly.ArduinoCpp.ORDER_ADDITIVE) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.ArduinoCpp.valueToCode(block, atId,
        Blockly.ArduinoCpp.ORDER_UNARY_PREFIX) || defaultAtIndex;
  } else {
    var at = Blockly.ArduinoCpp.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseInt(at, 10) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.ArduinoCpp.ORDER_ADDITIVE;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.ArduinoCpp.ORDER_ADDITIVE;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.ArduinoCpp.ORDER_UNARY_PREFIX;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
