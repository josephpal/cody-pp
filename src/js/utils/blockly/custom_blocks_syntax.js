import Blockly from 'node-blockly/browser';
const goog = Blockly.goog;

'use strict';

goog.provide('Blockly.interncode.logic');

goog.require('Blockly.interncode');

goog.provide('Blockly.Cpp.logic');

goog.require('Blockly.Cpp');

goog.provide('Blockly.ArduinoCpp.logic');

goog.require('Blockly.ArduinoCpp');

goog.provide('Blockly.basic.logic');

goog.require('Blockly.basic');

goog.provide('Blockly.basicger.logic');

goog.require('Blockly.basicger');

goog.provide('Blockly.JavaScript.logic');

goog.require('Blockly.JavaScript');

Blockly.interncode['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  // TODO: Assemble basic into code variable.
  var numberArray = number_seconds.split(".");
  var integers = '0';
  var decimalPlace = '00';

  console.log(numberArray);

  if((numberArray.length) == 2) {
    // expected format: XX.XX
    integers = numberArray[0];
    decimalPlace = numberArray[1].substring(0,2);
  }
  if((numberArray.length) == 1) {
    // expected format: XX
    integers = numberArray[0];
    decimalPlace = '00';
  }

  var code = '#S' + ',' + integers + '.' + decimalPlace + ';' +'\n';
  return code;
};

///////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.Cpp['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'sleep(' + number + ');' +'\n';
  return code;
};

Blockly.ArduinoCpp['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'delay(' + number*1000 + ');' +'\n';
  return code;
};

Blockly.basic['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'sleep for ' + number + 's\n';
  return code;
};

Blockly.basicger['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'schlafe für ' + number + 's\n';
  return code;
};

Blockly.JavaScript['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'await sleep (' + number + ')\n';
  return code;
};

///////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = '#M,' + dropdown_motornumber + ',' + dropdown_motordirection + ',' + dropdown_motorspeed + ';' + '\n';
  return code;
};

Blockly.Cpp['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = 'mMotorArray[Motor_' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
  return code;
};

Blockly.ArduinoCpp['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = 'mMotorArray[Motor_' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
  return code;
};

Blockly.basic['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  if (dropdown_motordirection == 0)
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'left-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
  else
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'right-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
  // TODO: Assemble basic into code variable.
  return code;
};

Blockly.basicger['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  if (dropdown_motordirection == 0)
	  var code = 'setze Motor an Port ' + dropdown_motornumber + ' auf ' + 'linkslauf' + ' und Geschwindigkeit ' + dropdown_motorspeed + '\n';
  else
	  var code = 'setze Motor an Port ' + dropdown_motornumber + ' auf ' + 'rechstlauf' + ' und Geschwindigkeit ' + dropdown_motorspeed + '\n';
  // TODO: Assemble basic into code variable.
  return code;
};
/*
 * Motor und Lampe müssen noch für JavaScript geschrieben werden
 * zusätzlich noch alle weiteren Funktionen in logic.js loops.js math.js und text.js
 */
Blockly.JavaScript['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  if (dropdown_motordirection == 0)
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'left-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
  else
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'right-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
    //TODO: Assemble basic into code variable.
  return code;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = '#L,' + dropdown_lampnumber + ',' + dropdown_state + ';\n';
  return code;
};

Blockly.Cpp['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'mLampArray[Lamp_' + dropdown_lampnumber + '].setValues(' + dropdown_state + ');\n';
  return code;
};


Blockly.ArduinoCpp['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'mLampArray[Lamp_' + dropdown_lampnumber + '].setValues(' + dropdown_state + ');\n';
  return code;
};

Blockly.basic['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'set Lamp on Port ' + dropdown_lampnumber + ' to brithness ' + dropdown_state + '\n';
  return code;
};

Blockly.basicger['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'setze Lampe an Port ' + dropdown_lampnumber + ' auf Helligkeit ' + dropdown_state + '\n';
  return code;
};

Blockly.JavaScript['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'set Lamp on Port ' + dropdown_lampnumber + ' to brithness ' + dropdown_state + '\n';
  return code;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = '#N,' + dropdown_servoNumber + ',' + number_position + ';\n';
  return code;
};

Blockly.Cpp['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'mServoArray[Servo_' + dropdown_servoNumber + '].setValues(' + number_position + ');\n';
  return code;
};


Blockly.ArduinoCpp['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'mServoArray[Servo_' + dropdown_servoNumber + '].setValues(' + number_position + ');\n';
  return code;
};

Blockly.basic['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'set Servo on Port ' + dropdown_servoNumber + ' to position ' + number_position + '\n';
  return code;
};

Blockly.basicger['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'setze Servo an Port ' + dropdown_servoNumber + ' auf Position ' + number_position + '\n';
  return code;
};

Blockly.JavaScript['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'set Servo on Port ' + dropdown_servoNumber + ' to position ' + number_position + '\n';
  return code;
};

////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '#D,O,' + dropdown_Port + ',' + dropdown_name + ';\n';
  return code;
};

Blockly.Cpp['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.ArduinoCpp['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.basic['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'set digital Port ' + dropdown_Port + ' to ' + dropdown_name + '\n';
  return code;
};

Blockly.basicger['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = 'Setze digitalen Port ' + dropdown_Port + ' auf ' + dropdown_name + '\n';
  return code;
};

Blockly.JavaScript['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.interncode['text_print'] = function(block) {
  var code = "";
  return code;
};

Blockly.Cpp['text_print'] = function(block) {
  var code = "";
  return code;
};

Blockly.ArduinoCpp['text_print'] = function(block) {
  var code = "";
  return code;
};

Blockly.basic['text_print'] = function(block) {
  var code = "";
  return code;
};

Blockly.basicger['text_print'] = function(block) {
  var code = "";
  return code;
};

Blockly.JavaScript['text_print'] = function(block) {
  var code = "";
  return code;
};
