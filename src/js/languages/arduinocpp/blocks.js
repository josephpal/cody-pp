export default (generator) => {
  generator['start'] = function (block) {
    var branch = generator.statementToCode(block, 'state') || '\n';
    branch = generator.addLoopTrap(branch, block.id);
    branch = generator.addContinueLabel(branch);
    var code = "#include \"ft_ESP32_IOobjects.h\"\n\n"
      + "enum Motor_Port {Motor_0, Motor_1};\n\n"
      + "enum Led_Port {L0, L1, L2, L3, L4, L5, L6, L7, L8, L9, L10};\n\n"
      + "enum Servo_Port {Servo_0, Servo_1, Servo_2, Servo_3};\n\n"
      + "enum Digital_Port {Digital_0, Digital_1, Digital_2, Digital_3,\n"
      + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + " "
      + "Digital_4, Digital_5, Digital_6, Digital_7};\n\n"
      + "enum Analog_Port {Analog_0, Analog_1, Analog_2, Analog_3,\n"
      + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT + generator.INDENT
      + "Analog_4, Analog_5, Analog_6, Analog_7};\n\n"
      + "/* global objects */\n"
      + "Motor mMotorArray[MOTOR_QTY];\n" + "Led mLedArray[LED_QTY];\n" + "CServoMotor mServoArray[SERVO_QTY];\n" + "DigitalAnalogIn mDAIn[DAIN_QTY];\n" + "\n"
      + "/* setup enum */\n"
      + "Motor_Port mMotor;\n" + "Led_Port mLed;\n" + "Digital_Port mDigital_Port;\n" + "Analog_Port mAnalog_Port;\n" + "\n" + "void setup() {\n"
      + generator.INDENT + "Serial.begin(115200);\n\n"
      + generator.INDENT + "/* ----- motor objects ----- */\n"
      + generator.INDENT + "for(unsigned int i = 0; i < MOTOR_QTY; i++) {\n"
      + generator.INDENT + generator.INDENT + "mMotorArray[i] = Motor(i);\n"
      + generator.INDENT + "}\n\n"
      + generator.INDENT + "/* ----- led objects ----- */\n\n"
      + generator.INDENT + "/* -> initialize led strip */\n"
      + generator.INDENT + "led_init();\n\n"
      + generator.INDENT + "for(unsigned int i = 0; i < LED_QTY; i++) {\n"
      + generator.INDENT + generator.INDENT + "mLedArray[i] = Led(i);\n"
      + generator.INDENT + "}\n\n"
      + generator.INDENT + "/* -> clear remaining led pixel information */\n"
      + generator.INDENT + "led_clear();\n\n"
      + generator.INDENT + "/* ----- servo objects ----- */\n"
      + generator.INDENT + "for(unsigned int i = 0; i < SERVO_QTY; i++) {\n"
      + generator.INDENT + generator.INDENT + "mServoArray[i] = CServoMotor(i);\n"
      + generator.INDENT + "}\n\n"
      + generator.INDENT + "/* ----- input objects ----- */\n"
      + generator.INDENT + "for(unsigned int i = 0; i < DAIN_QTY; i++) {\n"
      + generator.INDENT + generator.INDENT + "mDAIn[i] = DigitalAnalogIn(i);\n"
      + generator.INDENT + "}\n}\n\n"
      + "void loop() {\n"
      + branch + "\n"
      + generator.INDENT + "while(true) {\n"
      + generator.INDENT + generator.INDENT + "/* infinite loop used as breakpoint */\n"
      + generator.INDENT + generator.INDENT + "delay(1);" + "\n"
      + generator.INDENT + "}\n"
      + "}";
    return code;
  };

  generator['startGer'] = generator['start'];

  generator['wait'] = function (block) {
    var number_seconds = block.getFieldValue('seconds');
    var number = number_seconds;

    if ((number_seconds.length) > 4) {
      number = number_seconds.substring(0, 4);
    }
    var code = 'delay(' + number * 1000 + ');' + '\n';
    return code;
  };

  generator['waitGer'] = generator['wait'];


  generator['perform_action'] = function (block) {
    let number_seconds = block.getFieldValue('seconds');

    if ((number_seconds.length) > 4) {
      number_seconds = number_seconds.substring(0, 4);
    }

    let statements_actuator_input = generator.statementToCode(block, 'actuator_input');
    let statement_first_indent_removed = statements_actuator_input.replace(generator.INDENT, "");
    let code = statement_first_indent_removed.replace(new RegExp('\n' + generator.INDENT, "g"), "\n") + 'delay(' + number_seconds * 1000 + ');' + '\n';

    return code;
  };

  generator['perform_actionGer'] = generator['perform_action'];


  generator['stop_motors'] = function (block) {
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

  generator['stop_motorsGer'] = generator['stop_motors'];


  generator['motor'] = function (block) {
    var dropdown_motornumber = block.getFieldValue('motorNumber');
    var dropdown_motordirection = block.getFieldValue('motorDirection');
    var dropdown_motorspeed = block.getFieldValue('motorSpeed');
    // TODO: Assemble basic into code variable.
    var code = 'mMotorArray[Motor_' + dropdown_motornumber + '].setValues(' + dropdown_motordirection + ',' + dropdown_motorspeed + ');' + '\n';
    return code;
  };

  generator['motorGer'] = generator['motor'];



  generator['returnToHome'] = function (block) {

  };

  generator['returnToHomeGer'] = generator['returnToHome'];


  generator['led'] = function (block) {
    var dropdown_lednumber = block.getFieldValue('ledNumber');
    var dropdown_color = block.getFieldValue('color');
    var field_brightness = block.getFieldValue('brightness');

    var code = 'mLedArray[L' + dropdown_lednumber + '].setValues(' + field_brightness + ',' + dropdown_color + ');\n'
      + "led_update(mLedArray);\n\n";
    return code;
  };

  generator['ledGer'] = generator['led'];


  generator['ledReset'] = function (block) {
    var dropdown_option = block.getFieldValue('option');

    if (dropdown_option === "option_all") {
      dropdown_option = "for(int i=0; i < LED_QTY; i++) {" + '\n'
        + generator.INDENT + "mLedArray[i].setValues(0, 0);" + '\n'
        + "}" + '\n\n' + "led_update(mLedArray);\n";
    } else {
      dropdown_option = "mLedArray[L" + dropdown_option + "].setValues(0, 0);"
        + '\n' + "led_update(mLedArray);\n";
    }

    var code = dropdown_option + '\n';
    return code;
  };

  generator['ledResetGer'] = generator['ledReset'];

  generator['servo'] = function (block) {
    var dropdown_servoNumber = block.getFieldValue('servoNumber');
    var number_position = block.getFieldValue('position');
    var code = 'mServoArray[Servo_' + dropdown_servoNumber + '].setValues(' + number_position + ');\n';
    return code;
  };

  generator['servoGer'] = generator['servo'];

  generator['digital_out'] = function (block) {
    var dropdown_Port = block.getFieldValue('Port');
    var dropdown_name = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
  };

  generator['digital_outGer'] = generator['digital_out'];


  generator['rotation'] = function (block) {
    var code = 'TODO' + '\n';
    return code;
  };

  generator['rotationGer'] = generator['rotation'];

  generator['rotate'] = function (block) {
    var code = 'TODO' + '\n';
    return code;
  };

  generator['rotateGer'] = generator['rotate'];

  generator['circle'] = function (block) {
    var code = 'TODO' + '\n';
    return code;
  };

  generator['circleGer'] = generator['circle'];
}
