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
 * @fileoverview Generating Lua for loop blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

goog.provide('Blockly.Lua.loops');

goog.require('Blockly.Lua');

goog.provide('Blockly.Dart.loops');

goog.require('Blockly.Dart');

goog.provide('Blockly.JavaScript.loops');

goog.require('Blockly.JavaScript');

var b = -1;

export const resetLoopsCounterVar = () => {
    b = -1;
};

/**
 * This is the text used to implement a <pre>continue</pre>.
 * It is also used to recognise <pre>continue</pre>s in generated code so that
 * the appropriate label can be put at the end of the loop body.
 * @const {string}
 */
Blockly.Lua.CONTINUE_STATEMENT = 'goto continue\n';

/**
 * If the loop body contains a "goto continue" statement, add a continue label
 * to the loop body. Slightly inefficient, as continue labels will be generated
 * in all outer loops, but this is safer than duplicating the logic of
 * blockToCode.
 *
 * @param {string} branch Generated code of the loop body
 * @return {string} Generated label or '' if unnecessary
 */
Blockly.Lua.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.Lua.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.Lua.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.Dart.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.Dart.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.Dart.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.JavaScript.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.Dart.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.Dart.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

////////////////////////////////////////////////////////////////
//
Blockly.Lua['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.Lua.valueToCode(block, 'TIMES',
      Blockly.Lua.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Lua.addContinueLabel(branch);
  var loopVar = Blockly.Lua.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = '#W,' + 'Z,' + repeats + ',' + b + ';' + '\n' +
      branch + '#X,' + b + ';' + '\n';
  return code;
};

Blockly.Dart['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.Dart.valueToCode(block, 'TIMES',
      Blockly.Dart.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.Dart.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Dart.addContinueLabel(branch);
  ++b;
  var code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' + branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
      Blockly.JavaScript.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO') || '\n';
  branch = Blockly.JavaScript.addContinueLabel(branch);
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = 'repeat ' + repeats + ' times {\n' + branch + '}\n';
  return code;
};
//
/////////////////////////////////////////////////////////////
//
Blockly.Lua['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Lua.valueToCode(block, 'BOOL',
      until ? Blockly.Lua.ORDER_UNARY :
      Blockly.Lua.ORDER_NONE) || 'A,0,=,0';
  var branch = Blockly.Lua.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Lua.addLoopTrap(branch, block.id);
  branch = Blockly.Lua.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return '#W,' + argument0 + ',' + b + ';\n' + branch + '#X,' + b + ';\n';
};

Blockly.Dart['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Dart.valueToCode(block, 'BOOL',
      until ? Blockly.Dart.ORDER_UNARY :
      Blockly.Dart.ORDER_NONE) || '';
  var branch = Blockly.Dart.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Dart.addLoopTrap(branch, block.id);
  branch = Blockly.Dart.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.JavaScript['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_UNARY :
      Blockly.JavaScript.ORDER_NONE) || '';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO') || '\n';
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  branch = Blockly.JavaScript.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return 'while ' + argument0 + '{\n' + branch + '}\n';
};
//
/////////////////////////////////////////////////////////

Blockly.Lua['start'] = function(block) {
  var branch = Blockly.Lua.statementToCode(block, 'state') || '\n';
  branch = Blockly.Lua.addLoopTrap(branch, block.id);
  branch = Blockly.Lua.addContinueLabel(branch);
  var code = '#Start;\n' + branch + '#Stop;\n';
  return code;
};

Blockly.Dart['start'] = function(block) {
  var branch = Blockly.Dart.statementToCode(block, 'state') || '\n';
  branch = Blockly.Dart.addLoopTrap(branch, block.id);
  branch = Blockly.Dart.addContinueLabel(branch);
  var code = "#include \"ft_ESP32_IOobjects.h\"\n\n"
    + "// global objects\n"
    + "Motor mMotorArray[MOTOR_QTY];\n" + "Lampe mLampeArray[LAMP_QTY];\n" + "DigitalAnalogIn mDAIn[DAIN_QTY];\n"
    + "\n" + "void setup() {\n"
    + Blockly.Dart.INDENT + "Serial.begin(9600);\n\n"
    + Blockly.Dart.INDENT + "// motor objects\n"
    + Blockly.Dart.INDENT + "for(unsigned int i = 0; i < MOTOR_QTY; i++) {\n"
    + Blockly.Dart.INDENT + Blockly.Dart.INDENT + "mMotorArray[i] = Motor(i);\n"
    + Blockly.Dart.INDENT + "}\n\n"
    + Blockly.Dart.INDENT + "// lamp objects\n"
    + Blockly.Dart.INDENT + "for(unsigned int i = 0; i < LAMP_QTY; i++) {\n"
    + Blockly.Dart.INDENT + Blockly.Dart.INDENT + "mLampeArray[i] = Lampe(i);\n"
    + Blockly.Dart.INDENT + "}\n\n"
    + Blockly.Dart.INDENT + "// input objects\n"
    + Blockly.Dart.INDENT + "for(unsigned int i = 0; i < DAIN_QTY; i++) {\n"
    + Blockly.Dart.INDENT + Blockly.Dart.INDENT + "mDAIn[i] = DigitalAnalogIn(i);\n"
    + Blockly.Dart.INDENT + "}\n}\n\n"
    + "void loop() {\n"
    + branch + "\n"
    + Blockly.Dart.INDENT + "while(true) {\n"
    + Blockly.Dart.INDENT + Blockly.Dart.INDENT + "// infinite loop\n"
    + Blockly.Dart.INDENT + "}\n"
    + "}";
  return code;
};

/*Blockly.Dart['start'] = function(block) {
  var branch = Blockly.Dart.statementToCode(block, 'state') || '\n';
  branch = Blockly.Dart.addLoopTrap(branch, block.id);
  branch = Blockly.Dart.addContinueLabel(branch);
  var code = "#include \"ft_ESP32_IOobjects.h\"\n" + "\n" + "int main() {\n"
    + Blockly.Dart.INDENT + "// motor objects\n"
    + Blockly.Dart.INDENT + "Motor mMotor0(0);\n"
    + Blockly.Dart.INDENT + "Motor mMotor1(1);\n\n"
    + Blockly.Dart.INDENT + "// lamp objects\n"
    + Blockly.Dart.INDENT + "Lampe mLampe0(0);\n"
    + Blockly.Dart.INDENT + "Lampe mLampe1(1);\n\n"
    + Blockly.Dart.INDENT + "// input objects\n"
    + Blockly.Dart.INDENT + "DigitalAnalogIn mDAIn[DAIN_QTY];\n\n"
    + Blockly.Dart.INDENT + "for(unsigned int i = 0; i < DAIN_QTY; i++) {\n"
    + Blockly.Dart.INDENT + Blockly.Dart.INDENT + "mDAIn[i] = DigitalAnalogIn(i);\n"
    + Blockly.Dart.INDENT + "}\n\n"
    + branch + "\n" + Blockly.Dart.INDENT + "return 0; \n}";
  return code;
};*/

Blockly.JavaScript['start'] = function(block) {
  var branch = Blockly.JavaScript.statementToCode(block, 'state') || '\n';
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  branch = Blockly.JavaScript.addContinueLabel(branch);
  var code = "Start application\n" + branch + "Stop application";
  return code;
};
