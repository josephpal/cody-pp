import Blockly from 'node-blockly/browser';
const goog = Blockly.goog;

/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2016 Google Inc.
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
 * @fileoverview Generating Lua for logic blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

goog.provide('Blockly.Lua.logic');

goog.require('Blockly.Lua');

goog.provide('Blockly.Dart.logic');

goog.require('Blockly.Dart');

goog.provide('Blockly.JavaScript.logic');

goog.require('Blockly.JavaScript');

var c = 0;

export const resetLogicCounterVar = () => {
    c = 0;
};

//////////////////////////////////////////////////////////////
//
Blockly.Lua['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var temp = c;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Lua.valueToCode(block, 'IF' + n,
      Blockly.Lua.ORDER_NONE) || 'A,0,=,0';
    branchCode = Blockly.Lua.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else' : '') +
        '#I,' + conditionCode + ',' + c + ';' + '\n' + branchCode ;
	++c;
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.Lua.statementToCode(block, 'ELSE');
    code += 'else\n' + branchCode;
  }
  temp = c-1;
  return code + '#J,' + temp + ';' + '\n';
};

Blockly.Dart['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Dart.valueToCode(block, 'IF' + n,
      Blockly.Dart.ORDER_NONE) || '';
    branchCode = Blockly.Dart.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.Dart.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.JavaScript['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n,
      Blockly.JavaScript.ORDER_NONE) || '';
    branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'if ' + conditionCode + ' {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

//
//////////////////////////////////////////////////////////////
//
Blockly.Lua['controls_ifelse'] = Blockly.Lua['controls_if'];

Blockly.Dart['controls_ifelse'] = Blockly.Dart['controls_if'];

Blockly.JavaScript['controls_ifelse'] = Blockly.JavaScript['controls_if'];
//
////////////////////////////////////////////////////////////
//
Blockly.Lua['analog_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  var code = 'A,' + argument0 + ',' + operator + ',' + argument1;
  return [code, Blockly.Lua.ORDER_RELATIONAL];
};

Blockly.Dart['analog_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  var code;

  if (operator == '=') {
	   code = 'mDAIn[' + argument0 + '].getValueAnalog()' + ' == '  + argument1;
  }
  else {
	   code = 'mDAIn[' + argument0 + '].getValueAnalog()' + ' ' + operator + ' '  + argument1;
  }
  return [code, Blockly.Dart.ORDER_RELATIONAL];
};

Blockly.JavaScript['analog_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  if (operator == '=') {
	var code = 'Analog Port ' + argument0 + ' ' + operator + operator + ' ' + argument1 + ' then do ';
  }
  else {
	var code = 'Analog Port ' + argument0 + ' ' + operator + ' ' + argument1 + ' then do ';
  }
  return [code, Blockly.JavaScript.ORDER_RELATIONAL];
};

Blockly.Lua['digital_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  var code = 'D,' + argument0 + ',' + "=" + ',' + argument1;
  return [code, Blockly.Lua.ORDER_RELATIONAL];
};

Blockly.Dart['digital_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  var code = 'mDAIn[' + argument0 + '].getValueDigital()' + ' == '  + argument1;
  return [code, Blockly.Dart.ORDER_RELATIONAL];
};

Blockly.JavaScript['digital_logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '~=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = block.getFieldValue('A');
  var argument1 = block.getFieldValue('B');
  var code = 'Digital Port ' + argument0 + ' ' + '==' + ' '  + argument1 + ' then do ';
  return [code, Blockly.JavaScript.ORDER_RELATIONAL];
};

//
//////////////////////////////////////////////////////////
