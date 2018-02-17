import Blockly from 'node-blockly/browser';
const goog = Blockly.goog;

'use strict';

goog.provide('Blockly.Lua.logic');

goog.require('Blockly.Lua');

goog.provide('Blockly.Dart.logic');

goog.require('Blockly.Dart');

goog.provide('Blockly.JavaScript.logic');

goog.require('Blockly.JavaScript');

Blockly.Lua['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  // TODO: Assemble JavaScript into code variable.
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  if((number_seconds.length) == 1) {
    number = number_seconds + '.00';
  }
  if((number_seconds.length) == 3) {
    number = number_seconds + '0';
  }
  if((number_seconds.length) == 4) {
    number = number_seconds;
  }

  var code = '#S' + ',' + number + ';' +'\n';
  return code;
};


Blockly.Dart['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'delay(' + number*1000 + ');' +'\n';
  return code;
};

Blockly.JavaScript['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'sleep for ' + number + 's\n';
  return code;
};

Blockly.Lua['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble JavaScript into code variable.
  var code = '#M,' + dropdown_motornumber + ',' + dropdown_motordirection + ',' + dropdown_motorspeed + ';' + '\n';
  return code;
};

Blockly.Dart['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble JavaScript into code variable.
  var code = 'mMotorArray[' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
  return code;
};

Blockly.JavaScript['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  if (dropdown_motordirection == 0)
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'left-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
  else
	  var code = 'set Engine on Port ' + dropdown_motornumber + ' to ' + 'right-hand rotation' + ' and speed ' + dropdown_motorspeed + '\n';
  // TODO: Assemble JavaScript into code variable.
  return code;
};

Blockly.Lua['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = '#L,' + dropdown_lampnumber + ',' + dropdown_state + ';\n';
  return code;
};

Blockly.Dart['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'setLamp(' + dropdown_lampnumber + ',' + dropdown_state + ');\n';
  return code;
};

Blockly.JavaScript['lamp'] = function(block) {
  var dropdown_lampnumber = block.getFieldValue('lampNumber');
  var dropdown_state = block.getFieldValue('state');
  var code = 'set Lamp on Port ' + dropdown_lampnumber + ' to brithness ' + dropdown_state + '\n';
  return code;
};

Blockly.Dart['text_print'] = function(block) {
  return "test";
};
