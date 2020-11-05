import * as Blockly from 'blockly';
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
 * @fileoverview Generating interncode for logic blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

//goog.provide('Blockly.interncode.logic');

//goog.require('Blockly.interncode');

//goog.provide('Blockly.Cpp.logic');

//goog.require('Blockly.Cpp');

//goog.provide('Blockly.ArduinoCpp.logic');

//goog.require('Blockly.ArduinoCpp');

//goog.provide('Blockly.basic.logic');

//goog.require('Blockly.basic');

//goog.provide('Blockly.basicger.logic');

//goog.require('Blockly.basicger');

var c = 0;

export const resetLogicCounterVar = () => {
    c = 0;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var temp = c;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.interncode.valueToCode(block, 'IF' + n,
      Blockly.interncode.ORDER_NONE) || 'A,0,=,0';
    branchCode = Blockly.interncode.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else' : '') +
        '#I,' + conditionCode + ',' + c + ';' + '\n' + branchCode ;
	++c;
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.interncode.statementToCode(block, 'ELSE');
    code += '#E,' + temp + ';' + '\n' + branchCode;
  }
  temp = c-1;
  return code + '#J,' + temp + ';' + '\n';
};

Blockly.interncode['controls_if1Ger'] = Blockly.interncode['controls_if1'];

Blockly.Cpp['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Cpp.valueToCode(block, 'IF' + n,
      Blockly.Cpp.ORDER_NONE) || '';
    branchCode = Blockly.Cpp.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.Cpp.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Cpp['controls_if1Ger'] = Blockly.Cpp['controls_if1'];

Blockly.basic['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.basic.valueToCode(block, 'IF' + n,
      Blockly.basic.ORDER_NONE) || '';
    branchCode = Blockly.basic.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'if ' + conditionCode + ' \n' + branchCode + '';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.basic.statementToCode(block, 'ELSE');
    code += 'else \n' + branchCode + '';
  }
  return code;
};

Blockly.basic['controls_if1Ger'] = Blockly.basic['controls_if1'];

Blockly.basicger['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.basicger.valueToCode(block, 'IF' + n,
      Blockly.basicger.ORDER_NONE) || '';
    branchCode = Blockly.basicger.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'wenn ' + conditionCode + ' \n' + branchCode + '';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.basicger.statementToCode(block, 'ELSE');
    code += 'sonst \n' + branchCode + '';
  }
  return code;
};

Blockly.basicger['controls_if1Ger'] = Blockly.basicger['controls_if1'];

Blockly.ArduinoCpp['controls_if1'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.ArduinoCpp.valueToCode(block, 'IF' + n,
      Blockly.ArduinoCpp.ORDER_NONE) || '';
    branchCode = Blockly.ArduinoCpp.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.ArduinoCpp.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.ArduinoCpp['controls_if1Ger'] = Blockly.ArduinoCpp['controls_if1'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['controls_ifelse1'] = Blockly.interncode['controls_if1'];

Blockly.interncode['controls_ifelse1Ger'] = Blockly.interncode['controls_if1'];

Blockly.Cpp['controls_ifelse1'] = Blockly.Cpp['controls_if1'];

Blockly.Cpp['controls_ifelse1Ger'] = Blockly.Cpp['controls_if1'];

Blockly.basic['controls_ifelse1'] = Blockly.basic['controls_if1'];

Blockly.basic['controls_ifelse1Ger'] = Blockly.basic['controls_if1'];

Blockly.basicger['controls_ifelse1'] = Blockly.basicger['controls_if1'];

Blockly.basicger['controls_ifelse1Ger'] = Blockly.basicger['controls_if1'];

Blockly.ArduinoCpp['controls_ifelse1'] = Blockly.ArduinoCpp['controls_if1'];

Blockly.ArduinoCpp['controls_ifelse1Ger'] = Blockly.ArduinoCpp['controls_if1'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['analog_logic_compare'] = function(block) {
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
  return [code, Blockly.interncode.ORDER_RELATIONAL];
};

Blockly.interncode['analog_logic_compareGer'] = Blockly.interncode['analog_logic_compare'];

Blockly.Cpp['analog_logic_compare'] = function(block) {
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
	   code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' == '  + argument1;
  }
  else {
	   code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' ' + operator + ' '  + argument1;
  }
  return [code, Blockly.Cpp.ORDER_RELATIONAL];
};

Blockly.Cpp['analog_logic_compareGer'] = Blockly.Cpp['analog_logic_compare'];

Blockly.ArduinoCpp['analog_logic_compare'] = function(block) {
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
	   code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' == '  + argument1;
  }
  else {
	   code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' ' + operator + ' '  + argument1;
  }
  return [code, Blockly.ArduinoCpp.ORDER_RELATIONAL];
};

Blockly.ArduinoCpp['analog_logic_compareGer'] = Blockly.ArduinoCpp['analog_logic_compare'];

Blockly.basic['analog_logic_compare'] = function(block) {
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
  return [code, Blockly.basic.ORDER_RELATIONAL];
};

Blockly.basic['analog_logic_compareGer'] = Blockly.basic['analog_logic_compare'];

Blockly.basicger['analog_logic_compare'] = function(block) {
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
	var code = 'Analoger Eingang ' + argument0 + ' ' + operator + operator + ' ' + argument1 + ' dann ';
  }
  else {
	var code = 'Analoger Eingang ' + argument0 + ' ' + operator + ' ' + argument1 + ' dann ';
  }
  return [code, Blockly.basicger.ORDER_RELATIONAL];
};

Blockly.basicger['analog_logic_compareGer'] = Blockly.basic['analog_logic_compare'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['digital_logic_compare'] = function(block) {
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
  return [code, Blockly.interncode.ORDER_RELATIONAL];
};

Blockly.interncode['digital_logic_compareGer'] = Blockly.interncode['digital_logic_compare'];

Blockly.Cpp['digital_logic_compare'] = function(block) {
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
  var code = 'mDAIn[Digital_' + argument0 + '].getValueDigital()' + ' == '  + argument1;
  return [code, Blockly.Cpp.ORDER_RELATIONAL];
};

Blockly.Cpp['digital_logic_compareGer'] = Blockly.Cpp['digital_logic_compare'];

Blockly.ArduinoCpp['digital_logic_compare'] = function(block) {
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
  var code = 'mDAIn[Digital_' + argument0 + '].getValueDigital()' + ' == '  + argument1;
  return [code, Blockly.ArduinoCpp.ORDER_RELATIONAL];
};

Blockly.ArduinoCpp['digital_logic_compareGer'] = Blockly.ArduinoCpp['digital_logic_compare'];

Blockly.basic['digital_logic_compare'] = function(block) {
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
  return [code, Blockly.basic.ORDER_RELATIONAL];
};

Blockly.basic['digital_logic_compareGer'] = Blockly.basic['digital_logic_compare'];

Blockly.basicger['digital_logic_compare'] = function(block) {
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
  var code = 'Digitaler Eingang ' + argument0 + ' ' + '==' + ' '  + argument1 + ' dann ';
  return [code, Blockly.basicger.ORDER_RELATIONAL];
};

Blockly.basicger['digital_logic_compareGer'] = Blockly.basicger['digital_logic_compare'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
