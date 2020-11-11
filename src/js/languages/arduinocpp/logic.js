export default (generator) => {
  generator['controls_if1'] = function (block) {
    var n = 0;
    var code = '', branchCode, conditionCode;
    do {
      conditionCode = generator.valueToCode(block, 'IF' + n,
        generator.ORDER_NONE) || '';
      branchCode = generator.statementToCode(block, 'DO' + n);
      code += (n > 0 ? 'else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

      ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
      branchCode = generator.statementToCode(block, 'ELSE');
      code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
  };

  generator['controls_if1Ger'] = generator['controls_if1'];


  generator['analog_logic_compare'] = function (block) {
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
      code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' == ' + argument1;
    }
    else {
      code = 'mDAIn[Analog_' + argument0 + '].getValueAnalog()' + ' ' + operator + ' ' + argument1;
    }
    return [code, generator.ORDER_RELATIONAL];
  };

  generator['analog_logic_compareGer'] = generator['analog_logic_compare'];

  generator['digital_logic_compare'] = function (block) {
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
    var code = 'mDAIn[Digital_' + argument0 + '].getValueDigital()' + ' == ' + argument1;
    return [code, generator.ORDER_RELATIONAL];
  };

  generator['digital_logic_compareGer'] = generator['digital_logic_compare'];


}
