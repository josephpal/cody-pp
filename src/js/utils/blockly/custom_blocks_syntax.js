import Blockly from 'node-blockly/browser';
const goog = Blockly.goog;

'use strict';

goog.provide('Blockly.interncode.logic');

goog.require('Blockly.interncode');

goog.provide('Blockly.Cpp.logic');

goog.require('Blockly.Cpp');

goog.provide('Blockly.ArduinoCpp.logic');

goog.require('Blockly.ArduinoCpp');

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  // TODO: Assemble basic into code variable.
  var numberArray = number_seconds.split(".");
  var integers = '0';
  var decimalPlace = "";

  if((numberArray.length) == 2) {
    // expected format: XX.XX
    integers = numberArray[0];
    decimalPlace = numberArray[1].substring(0,2);

    if( (decimalPlace.length) < 2 ) {
      decimalPlace = decimalPlace.concat("0");
    }
  }
  if((numberArray.length) == 1) {
    // expected format: XX
    integers = numberArray[0];
    decimalPlace = '00';
  }

  var code = '#S' + ',' + integers + '.' + decimalPlace + ';' +'\n';
  return code;
};

Blockly.interncode['waitGer'] = Blockly.interncode['wait'];

Blockly.Cpp['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'sleep(' + number + ');' +'\n';
  return code;
};

Blockly.Cpp['waitGer'] = Blockly.Cpp['wait'];

Blockly.ArduinoCpp['wait'] = function(block) {
  var number_seconds = block.getFieldValue('seconds');
  var number = number_seconds;

  if((number_seconds.length) > 4) {
    number = number_seconds.substring(0,4);
  }
  var code = 'delay(' + number*1000 + ');' +'\n';
  return code;
};

Blockly.ArduinoCpp['waitGer'] = Blockly.ArduinoCpp['wait'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['perform_action'] = function(block) {
  let number_seconds = block.getFieldValue('seconds');
  let numberArray = number_seconds.split(".");
  let integers = '0';
  let decimalPlace = "";

  if((numberArray.length) == 2) {
    // expected format: XX.XX
    integers = numberArray[0];
    decimalPlace = numberArray[1].substring(0,2);

    if( (decimalPlace.length) < 2 ) {
      decimalPlace = decimalPlace.concat("0");
    }
  }
  if((numberArray.length) == 1) {
    // expected format: XX
    integers = numberArray[0];
    decimalPlace = '00';
  }

  let statements_actuator_input = Blockly.interncode.statementToCode(block, 'actuator_input');
  let statement_first_indent_removed = statements_actuator_input.replace(Blockly.interncode.INDENT, "");
  let code = statement_first_indent_removed.replace(new RegExp('\n' + Blockly.interncode.INDENT, "g"), "\n") + '#S' + ',' + integers + '.' + decimalPlace + ';' +'\n';

  return code;
};

Blockly.interncode['perform_actionGer'] = Blockly.interncode['perform_action'];

Blockly.Cpp['perform_action'] = function(block) {
  let number_seconds = block.getFieldValue('seconds');

  if((number_seconds.length) > 4) {
    number_seconds = number_seconds.substring(0,4);
  }

  let statements_actuator_input = Blockly.Cpp.statementToCode(block, 'actuator_input');
  let statement_first_indent_removed = statements_actuator_input.replace(Blockly.Cpp.INDENT, "");
  let code = statement_first_indent_removed.replace(new RegExp('\n' + Blockly.Cpp.INDENT, "g"), "\n") + 'sleep(' + number_seconds*1000 + ');' +'\n';

  return code;
};

Blockly.Cpp['perform_actionGer'] = Blockly.Cpp['perform_action'];

Blockly.ArduinoCpp['perform_action'] = function(block) {
  let number_seconds = block.getFieldValue('seconds');

  if((number_seconds.length) > 4) {
    number_seconds = number_seconds.substring(0,4);
  }

  let statements_actuator_input = Blockly.ArduinoCpp.statementToCode(block, 'actuator_input');
  let statement_first_indent_removed = statements_actuator_input.replace(Blockly.ArduinoCpp.INDENT, "");
  let code = statement_first_indent_removed.replace(new RegExp('\n' + Blockly.ArduinoCpp.INDENT, "g"), "\n") + 'delay(' + number_seconds*1000 + ');' +'\n';

  return code;
};

Blockly.ArduinoCpp['perform_actionGer'] = Blockly.ArduinoCpp['perform_action'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['stop_motors'] = function(block) {
  let dropdown_option = block.getFieldValue('option');
  let code;

  switch (String(dropdown_option)) {
      case 'option_all': code = '#M,0,2,0;' + '\n' + '#M,1,2,0;' + '\n'; // + '#M,2,0,0;' + '\n' + '#M,3,0,0;' + '\n';
      break;

      case 'option_M0': code = '#M,0,2,0;' + '\n';
      break;

      case 'option_M1': code = '#M,1,2,0;' + '\n';
      break;

      case 'option_M2': code = '#M,2,2,0;' + '\n';
      break;

      case 'option_M3': code = '#M,3,2,0;' + '\n';;
      break;

      default: code = '#M,0,0,0;' + '\n'; ;
  }

  return code; //'#S,0.1;' + '\n'
};

Blockly.interncode['stop_motorsGer'] = Blockly.interncode['stop_motors'];

Blockly.Cpp['stop_motors'] = function(block) {
  let dropdown_option = block.getFieldValue('option');
  let code;

  switch (String(dropdown_option)) {
      case 'option_all': code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n'
                              + 'mMotorArray[Motor_1].setValues(2,0);' + '\n'
                              /*+ 'mMotorArray[Motor_2].setValues(2,0);' + '\n'
                              + 'mMotorArray[Motor_3].setValues(2,0);' + '\n'*/;
      break;

      case 'option_M0': code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n';
      break;

      case 'option_M1': code = 'mMotorArray[Motor_1].setValues(2,0);' + '\n';
      break;

      case 'option_M2': code = 'mMotorArray[Motor_2].setValues(2,0);' + '\n';
      break;

      case 'option_M3': code = 'mMotorArray[Motor_3].setValues(2,0);' + '\n';
      break;

      default: code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n';
  }

  return code; //'sleep(0.1);' + '\n'
};

Blockly.Cpp['stop_motorsGer'] = Blockly.Cpp['stop_motors'];

Blockly.ArduinoCpp['stop_motors'] = function(block) {
  let dropdown_option = block.getFieldValue('option');
  let code;

  switch (String(dropdown_option)) {
      case 'option_all': code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n'
                              + 'mMotorArray[Motor_1].setValues(2,0);' + '\n'
                              /*+ 'mMotorArray[Motor_2].setValues(2,0);' + '\n'
                              + 'mMotorArray[Motor_3].setValues(2,0);' + '\n'*/;
      break;

      case 'option_M0': code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n';
      break;

      case 'option_M1': code = 'mMotorArray[Motor_1].setValues(2,0);' + '\n';
      break;

      case 'option_M2': code = 'mMotorArray[Motor_2].setValues(2,0);' + '\n';
      break;

      case 'option_M3': code = 'mMotorArray[Motor_3].setValues(2,0);' + '\n';
      break;

      default: code = 'mMotorArray[Motor_0].setValues(2,0);' + '\n';
  }

  return code; //'delay(1000);' + '\n'
};

Blockly.ArduinoCpp['stop_motorsGer'] = Blockly.ArduinoCpp['stop_motors'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = '#M,' + dropdown_motornumber + ',' + dropdown_motordirection + ',' + dropdown_motorspeed + ';' + '\n';
  return code;
};

Blockly.interncode['motorGer'] = Blockly.interncode['motor'];

Blockly.Cpp['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = 'mMotorArray[Motor_' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
  return code;
};

Blockly.Cpp['motorGer'] = Blockly.Cpp['motor'];

Blockly.ArduinoCpp['motor'] = function(block) {
  var dropdown_motornumber = block.getFieldValue('motorNumber');
  var dropdown_motordirection = block.getFieldValue('motorDirection');
  var dropdown_motorspeed = block.getFieldValue('motorSpeed');
  // TODO: Assemble basic into code variable.
  var code = 'mMotorArray[Motor_' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
  return code;
};

Blockly.ArduinoCpp['motorGer'] = Blockly.ArduinoCpp['motor'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['returnToHome'] = function(block) {
  var modus = block.getFieldValue('modus');
  var code = '';

  if( modus == 0 ) {
    /* simple mode */
    code = '#RETURN_0;' + '\n';

  } else {
    /* fast mode */
    /* TODO */

    code = '#RETURN_1;' + '\n';
  }

  return code;
};

Blockly.interncode['returnToHomeGer'] = Blockly.interncode['returnToHome'];

Blockly.Cpp['returnToHome'] = function(block) {

};

Blockly.Cpp['returnToHomeGer'] = Blockly.Cpp['returnToHome'];

Blockly.ArduinoCpp['returnToHome'] = function(block) {

};

Blockly.ArduinoCpp['returnToHomeGer'] = Blockly.ArduinoCpp['returnToHome'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['led'] = function(block) {
  var dropdown_lednumber = block.getFieldValue('ledNumber');
  var dropdown_color = block.getFieldValue('color');
  var field_brightness = block.getFieldValue('brightness');

  var code = '#L,' + dropdown_lednumber + ',' + field_brightness + ',' + dropdown_color + ';' + '\n';
  return code;
};

Blockly.interncode['ledGer'] = Blockly.interncode['led'];

Blockly.Cpp['led'] = function(block) {
  var dropdown_lednumber = block.getFieldValue('ledNumber');
  var dropdown_color = block.getFieldValue('color');
  var field_brightness = block.getFieldValue('brightness');

  var code = 'mLedArray[L' + dropdown_lednumber + '].setValues(' + field_brightness + ',' + dropdown_color + ');\n'
              + "led_update(mLedArray);\n\n";
  return code;
};

Blockly.Cpp['ledGer'] = Blockly.Cpp['led'];

Blockly.ArduinoCpp['led'] = function(block) {
  var dropdown_lednumber = block.getFieldValue('ledNumber');
  var dropdown_color = block.getFieldValue('color');
  var field_brightness = block.getFieldValue('brightness');

  var code = 'mLedArray[L' + dropdown_lednumber + '].setValues(' + field_brightness + ',' + dropdown_color + ');\n'
              + "led_update(mLedArray);\n\n";
  return code;
};

Blockly.ArduinoCpp['ledGer'] = Blockly.ArduinoCpp['led'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['ledReset'] = function(block) {
  var dropdown_option = block.getFieldValue('option');

  if( dropdown_option === "option_all" ) {
    dropdown_option = "A";
  }

  var code = '#LR,' + dropdown_option + ';' + '\n';
  return code;
};

Blockly.interncode['ledResetGer'] = Blockly.interncode['ledReset'];

Blockly.Cpp['ledReset'] = function(block) {
  var dropdown_option = block.getFieldValue('option');

  if( dropdown_option === "option_all" ) {
    dropdown_option = "for(int i=0; i < LED_QTY; i++) {" + '\n'
                      + Blockly.Cpp.INDENT + "mLedArray[i].setValues(0, 0);" + '\n'
                      + "}" + '\n\n' + "led_update(mLedArray);\n";
  } else {
    dropdown_option = "mLedArray[L" + dropdown_option + "].setValues(0, 0);"
                      + '\n' + "led_update(mLedArray);\n";;
  }

  var code = dropdown_option + '\n';
  return code;
};

Blockly.Cpp['ledResetGer'] = Blockly.Cpp['ledReset'];

Blockly.ArduinoCpp['ledReset'] = function(block) {
  var dropdown_option = block.getFieldValue('option');

  if( dropdown_option === "option_all" ) {
    dropdown_option = "for(int i=0; i < LED_QTY; i++) {" + '\n'
                      + Blockly.Cpp.INDENT + "mLedArray[i].setValues(0, 0);" + '\n'
                      + "}" + '\n\n' + "led_update(mLedArray);\n";
  } else {
    dropdown_option = "mLedArray[L" + dropdown_option + "].setValues(0, 0);"
                      + '\n' + "led_update(mLedArray);\n";
  }

  var code = dropdown_option + '\n';
  return code;
};

Blockly.ArduinoCpp['ledResetGer'] = Blockly.ArduinoCpp['ledReset'];

/* ------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = '#N,' + dropdown_servoNumber + ',' + number_position + ';\n';
  return code;
};

Blockly.interncode['servoGer'] = Blockly.interncode['servo'];

Blockly.Cpp['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'mServoArray[Servo_' + dropdown_servoNumber + '].setValues(' + number_position + ');\n';
  return code;
};

Blockly.Cpp['servoGer'] = Blockly.Cpp['servo'];

Blockly.ArduinoCpp['servo'] = function(block) {
  var dropdown_servoNumber = block.getFieldValue('servoNumber');
  var number_position = block.getFieldValue('position');
  var code = 'mServoArray[Servo_' + dropdown_servoNumber + '].setValues(' + number_position + ');\n';
  return code;
};

Blockly.ArduinoCpp['servoGer'] = Blockly.ArduinoCpp['servo'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '#D,O,' + dropdown_Port + ',' + dropdown_name + ';\n';
  return code;
};

Blockly.interncode['digital_outGer'] = Blockly.interncode['digital_out'];

Blockly.Cpp['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.Cpp['digital_outGer'] = Blockly.Cpp['digital_out'];

Blockly.ArduinoCpp['digital_out'] = function(block) {
  var dropdown_Port = block.getFieldValue('Port');
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.ArduinoCpp['digital_outGer'] = Blockly.ArduinoCpp['digital_out'];

/* ------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['rotation'] = function(block) {
  var dropdown_direction = block.getFieldValue('rotation_direction');
  var times = block.getFieldValue('times');
  var code = '';


  var rotate_amount = times.toString().split('.');

  for(var i = 0; i < rotate_amount[0]; i++ ){
    code += '#R,' + dropdown_direction + ',' + "360" + ';' + '\n';
  }

  if( rotate_amount[1] >= 0) {
    code += '#R,' + dropdown_direction + ',' + (rotate_amount[1] / 100) * 360 + ';' + '\n';
  }

  if( times == 0 ) {
    code += '#R,' + dropdown_direction + ',' + 0 + ';' + '\n';
  }

  return code;
};

Blockly.interncode['rotationGer'] = Blockly.interncode['rotation'];

Blockly.Cpp['rotation'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.Cpp['rotationGer'] = Blockly.Cpp['rotation'];

Blockly.ArduinoCpp['rotation'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.ArduinoCpp['rotationGer'] = Blockly.ArduinoCpp['rotation'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['rotate'] = function(block) {
  var dropdown_rotation_direction = block.getFieldValue('rotate_direction');
  var number_angle = block.getFieldValue('angle');

  var code = '#R,' + dropdown_rotation_direction + ',' + number_angle + ';' + '\n';
  return code;
};

Blockly.interncode['rotateGer'] = Blockly.interncode['rotate'];

Blockly.Cpp['rotate'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.Cpp['rotateGer'] = Blockly.Cpp['rotate'];

Blockly.ArduinoCpp['rotate'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.ArduinoCpp['rotateGer'] = Blockly.ArduinoCpp['rotate'];

/* ------------------------------------------------------------------------------------------ */

Blockly.interncode['circle'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var amount = block.getFieldValue('circle');

  var code = '#C,' + dropdown_direction + ',' + amount + ';' + '\n';
  return code;
};

Blockly.interncode['circleGer'] = Blockly.interncode['circle'];

Blockly.Cpp['circle'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.Cpp['circleGer'] = Blockly.Cpp['circle'];

Blockly.ArduinoCpp['circle'] = function(block) {
  var code = 'TODO' + '\n';
  return code;
};

Blockly.ArduinoCpp['circleGer'] = Blockly.ArduinoCpp['circle'];

/* ------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------ */
