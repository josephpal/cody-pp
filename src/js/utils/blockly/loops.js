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
 * @fileoverview Generating interncode for loop blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

goog.provide('Blockly.interncode.loops');

goog.require('Blockly.interncode');

goog.provide('Blockly.Cpp.loops');

goog.require('Blockly.Cpp');

goog.provide('Blockly.ArduinoCpp.loops');

goog.require('Blockly.ArduinoCpp');

goog.provide('Blockly.basic.loops');

goog.require('Blockly.basic');

goog.provide('Blockly.basicger.loops');

goog.require('Blockly.basicger');

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
Blockly.interncode.CONTINUE_STATEMENT = 'goto continue\n';

/**
 * If the loop body contains a "goto continue" statement, add a continue label
 * to the loop body. Slightly inefficient, as continue labels will be generated
 * in all outer loops, but this is safer than duplicating the logic of
 * blockToCode.
 *
 * @param {string} branch Generated code of the loop body
 * @return {string} Generated label or '' if unnecessary
 */
Blockly.interncode.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.interncode.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.interncode.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.Cpp.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.Cpp.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.Cpp.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.ArduinoCpp.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.ArduinoCpp.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.ArduinoCpp.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.basic.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.basic.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.basic.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.basicger.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.basicger.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.basicger.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

////////////////////////////////////////////////////////////////
//
Blockly.interncode['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.interncode.valueToCode(block, 'TIMES',
      Blockly.interncode.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.interncode.statementToCode(block, 'DO') || '\n';
  branch = Blockly.interncode.addContinueLabel(branch);
  var loopVar = Blockly.interncode.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = '#W,' + 'Z,' + repeats + ',' + b + ';' + '\n' +
      branch + '#X,' + b + ';' + '\n';
  return code;
};

Blockly.Cpp['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.Cpp.valueToCode(block, 'TIMES',
      Blockly.Cpp.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.Cpp.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Cpp.addContinueLabel(branch);
  var loopVar = Blockly.Cpp.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = 'for (int i = 0; i<' + repeats + ';i++) {\n' + branch + '}\n';
  return code;
};

Blockly.basic['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.basic.valueToCode(block, 'TIMES',
      Blockly.basic.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.basic.statementToCode(block, 'DO') || '\n';
  branch = Blockly.basic.addContinueLabel(branch);
  var loopVar = Blockly.basic.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = 'repeat ' + repeats + ' times \n' + branch;
  return code;
};

Blockly.basicger['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.basicger.valueToCode(block, 'TIMES',
      Blockly.basicger.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.basicger.statementToCode(block, 'DO') || '\n';
  branch = Blockly.basicger.addContinueLabel(branch);
  var loopVar = Blockly.basicger.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = 'wiederhole ' + repeats + ' mal \n' + branch;
  return code;
};

Blockly.ArduinoCpp['controls_repeat_ext'] = function(block) {

  // Repeat n times (external number).
  var repeats = Blockly.ArduinoCpp.valueToCode(block, 'TIMES',
      Blockly.ArduinoCpp.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.ArduinoCpp.statementToCode(block, 'DO') || '\n';
  branch = Blockly.ArduinoCpp.addContinueLabel(branch);
  var loopVar = Blockly.ArduinoCpp.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  ++b;
  var code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' + branch + '}\n';
  return code;
};

//
/////////////////////////////////////////////////////////////
//
Blockly.interncode['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.interncode.valueToCode(block, 'BOOL',
      until ? Blockly.interncode.ORDER_UNARY :
      Blockly.interncode.ORDER_NONE) || 'A,0,=,0';
  var branch = Blockly.interncode.statementToCode(block, 'DO') || '\n';
  branch = Blockly.interncode.addLoopTrap(branch, block.id);
  branch = Blockly.interncode.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return '#W,' + argument0 + ',' + b + ';\n' + branch + '#X,' + b + ';\n';
};

Blockly.Cpp['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Cpp.valueToCode(block, 'BOOL',
      until ? Blockly.Cpp.ORDER_UNARY :
      Blockly.Cpp.ORDER_NONE) || '';
  var branch = Blockly.Cpp.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Cpp.addLoopTrap(branch, block.id);
  branch = Blockly.Cpp.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.basic['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.basic.valueToCode(block, 'BOOL',
      until ? Blockly.basic.ORDER_UNARY :
      Blockly.basic.ORDER_NONE) || '';
  var branch = Blockly.basic.statementToCode(block, 'DO') || '\n';
  branch = Blockly.basic.addLoopTrap(branch, block.id);
  branch = Blockly.basic.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return 'while ' + argument0 + '\n' + branch;
};

Blockly.basicger['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.basicger.valueToCode(block, 'BOOL',
      until ? Blockly.basicger.ORDER_UNARY :
      Blockly.basicger.ORDER_NONE) || '';
  var branch = Blockly.basicger.statementToCode(block, 'DO') || '\n';
  branch = Blockly.basicger.addLoopTrap(branch, block.id);
  branch = Blockly.basicger.addContinueLabel(branch);
  if (until) {
    argument0 = 'nicht ' + argument0;
  }
  ++b;
  return 'solange ' + argument0 + '\n' + branch;
};


Blockly.ArduinoCpp['controls_whileuntil1'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'BOOL',
      until ? Blockly.ArduinoCpp.ORDER_UNARY :
      Blockly.ArduinoCpp.ORDER_NONE) || '';
  var branch = Blockly.ArduinoCpp.statementToCode(block, 'DO') || '\n';
  branch = Blockly.ArduinoCpp.addLoopTrap(branch, block.id);
  branch = Blockly.ArduinoCpp.addContinueLabel(branch);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  ++b;
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

//
/////////////////////////////////////////////////////////

Blockly.interncode['start'] = function(block) {
  var branch = Blockly.interncode.statementToCode(block, 'state') || '\n';
  branch = Blockly.interncode.addLoopTrap(branch, block.id);
  branch = Blockly.interncode.addContinueLabel(branch);
  var code = '#Start;\n' + branch + '#Stop;\n';
  return code;
};

Blockly.Cpp['start'] = function(block) {
  var branch = Blockly.Cpp.statementToCode(block, 'state') || '\n';
  branch = Blockly.Cpp.addLoopTrap(branch, block.id);
  branch = Blockly.Cpp.addContinueLabel(branch);
  var code = "#include \"ft_ESP32_IOobjects.h\"\n\n"
	+ "enum Motor_Port {Motor_0, Motor_1, Motor_2, Motor_3};\n\n"
	+ "enum Lamp_Port {Lamp_0, Lamp_1, Lamp_2, Lamp_3};\n\n"
  + "enum Servo_Port {Servo_0, Servo_1, Servo_2, Servo_3};\n\n"
	+ "enum Digital_Port {Digital_0, Digital_1, Digital_2, Digital_3,\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + " "
  + "Digital_4, Digital_5, Digital_6, Digital_7};\n\n"
  + "enum Analog_Port {Analog_0, Analog_1, Analog_2, Analog_3,\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT
	+ "Analog_4, Analog_5, Analog_6, Analog_7};\n\n"
	+ "// global objects\n"
  + "Motor mMotorArray[MOTOR_QTY];\n" + "Lampe mLampArray[LAMP_QTY];\n" + "CServoMotor mServoArray[SERVO_QTY];\n" + "DigitalAnalogIn mDAIn[DAIN_QTY];\n"+ "\n"
  + "// setup enum\n"
	+ "Motor_Port mMotor;\n" + "Lamp_Port mLamp;\n" + "Digital_Port mDigital_Port;\n" + "Analog_Port mAnalog_Port;\n" +  "\n"
	+ "int main() {\n"
  + Blockly.Cpp.INDENT + "// motor objects\n"
  + Blockly.Cpp.INDENT + "for(unsigned int i = 0; i < MOTOR_QTY; i++) {\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + "mMotorArray[i] = Motor(i);\n"
  + Blockly.Cpp.INDENT + "}\n\n"
  + Blockly.Cpp.INDENT + "// lamp objects\n"
  + Blockly.Cpp.INDENT + "for(unsigned int i = 0; i < LAMP_QTY; i++) {\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + "mLampArray[i] = Lampe(i);\n"
  + Blockly.Cpp.INDENT + "}\n\n"
  + Blockly.Cpp.INDENT + "// servo objects\n"
  + Blockly.Cpp.INDENT + "for(unsigned int i = 0; i < SERVO_QTY; i++) {\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + "mServoArray[i] = CServoMotor(i);\n"
  + Blockly.Cpp.INDENT + "}\n\n"
  + Blockly.Cpp.INDENT + "// input objects\n"
  + Blockly.Cpp.INDENT + "for(unsigned int i = 0; i < DAIN_QTY; i++) {\n"
  + Blockly.Cpp.INDENT + Blockly.Cpp.INDENT + "mDAIn[i] = DigitalAnalogIn(i);\n"
  + Blockly.Cpp.INDENT + "}\n\n"
  + branch + "\n" + Blockly.Cpp.INDENT + "return 0; \n}";
  return code;
};

Blockly.basic['start'] = function(block) {
  var branch = Blockly.basic.statementToCode(block, 'state') || '\n';
  branch = Blockly.basic.addLoopTrap(branch, block.id);
  branch = Blockly.basic.addContinueLabel(branch);
  var code = "Start application\n" + branch + "Stop application";
  return code;
};

Blockly.basicger['start'] = function(block) {
  var branch = Blockly.basicger.statementToCode(block, 'state') || '\n';
  branch = Blockly.basicger.addLoopTrap(branch, block.id);
  branch = Blockly.basicger.addContinueLabel(branch);
  var code = "Starte Programm\n" + branch + "Stoppe Programm";
  return code;
};

Blockly.ArduinoCpp['start'] = function(block) {
  var branch = Blockly.ArduinoCpp.statementToCode(block, 'state') || '\n';
  branch = Blockly.ArduinoCpp.addLoopTrap(branch, block.id);
  branch = Blockly.ArduinoCpp.addContinueLabel(branch);
  var code = "#include \"ft_ESP32_IOobjects.h\"\n\n"
	+ "enum Motor_Port {Motor_0, Motor_1, Motor_2, Motor_3};\n\n"
	+ "enum Lamp_Port {Lamp_0, Lamp_1, Lamp_2, Lamp_3};\n\n"
  + "enum Servo_Port {Servo_0, Servo_1, Servo_2, Servo_3};\n\n"
	+ "enum Digital_Port {Digital_0, Digital_1, Digital_2, Digital_3,\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + " "
  + "Digital_4, Digital_5, Digital_6, Digital_7};\n\n"
  + "enum Analog_Port {Analog_0, Analog_1, Analog_2, Analog_3,\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT
	+ "Analog_4, Analog_5, Analog_6, Analog_7};\n\n"
  + "// global objects\n"
  + "Motor mMotorArray[MOTOR_QTY];\n" + "Lampe mLampArray[LAMP_QTY];\n" + "CServoMotor mServoArray[SERVO_QTY];\n" + "DigitalAnalogIn mDAIn[DAIN_QTY];\n\n"
	+ "// setup enum\n"
	+ "Motor_Port mMotor;\n" + "Lamp_Port mLamp;\n" + "Digital_Port mDigital_Port;\n" + "Analog_Port mAnalog_Port;\n" + "\n" + "void setup() {\n"
  + Blockly.ArduinoCpp.INDENT + "Serial.begin(115200);\n\n"
  + Blockly.ArduinoCpp.INDENT + "// motor objects\n"
  + Blockly.ArduinoCpp.INDENT + "for(unsigned int i = 0; i < MOTOR_QTY; i++) {\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + "mMotorArray[i] = Motor(i);\n"
  + Blockly.ArduinoCpp.INDENT + "}\n\n"
  + Blockly.ArduinoCpp.INDENT + "// lamp objects\n"
  + Blockly.ArduinoCpp.INDENT + "for(unsigned int i = 0; i < LAMP_QTY; i++) {\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + "mLampArray[i] = Lampe(i);\n"
  + Blockly.ArduinoCpp.INDENT + "}\n\n"
  + Blockly.ArduinoCpp.INDENT + "// servo objects\n"
  + Blockly.ArduinoCpp.INDENT + "for(unsigned int i = 0; i < SERVO_QTY; i++) {\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + "mServoArray[i] = CServoMotor(i);\n"
  + Blockly.ArduinoCpp.INDENT + "}\n\n"
  + Blockly.ArduinoCpp.INDENT + "// input objects\n"
  + Blockly.ArduinoCpp.INDENT + "for(unsigned int i = 0; i < DAIN_QTY; i++) {\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + "mDAIn[i] = DigitalAnalogIn(i);\n"
  + Blockly.ArduinoCpp.INDENT + "}\n}\n\n"
  + "void loop() {\n"
  + branch + "\n"
  + Blockly.ArduinoCpp.INDENT + "while(true) {\n"
  + Blockly.ArduinoCpp.INDENT + Blockly.ArduinoCpp.INDENT + "// infinite loop\n"
  + Blockly.ArduinoCpp.INDENT + "}\n"
  + "}";
  return code;
};
