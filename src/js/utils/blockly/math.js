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
 * @fileoverview Generating interncode for math blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 */
'use strict';

//goog.provide('Blockly.interncode.math');

//goog.require('Blockly.interncode');


Blockly.interncode['math_number'] = function (block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order = code < 0 ? Blockly.interncode.ORDER_UNARY :
    Blockly.interncode.ORDER_ATOMIC;
  return [code, order];
};

Blockly.interncode['math_arithmetic'] = function (block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    ADD: [' + ', Blockly.interncode.ORDER_ADDITIVE],
    MINUS: [' - ', Blockly.interncode.ORDER_ADDITIVE],
    MULTIPLY: [' * ', Blockly.interncode.ORDER_MULTIPLICATIVE],
    DIVIDE: [' / ', Blockly.interncode.ORDER_MULTIPLICATIVE],
    POWER: [' ^ ', Blockly.interncode.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.interncode.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.interncode.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.interncode['math_single'] = function (block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.interncode.valueToCode(block, 'NUM',
      Blockly.interncode.ORDER_UNARY) || '0';
    return ['-' + arg, Blockly.interncode.ORDER_UNARY];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.interncode.valueToCode(block, 'NUM',
      Blockly.interncode.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.interncode.valueToCode(block, 'NUM',
      Blockly.interncode.ORDER_NONE) || '0';
  }
  switch (operator) {
    case 'ABS':
      code = 'math.abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'math.log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'math.log10(' + arg + ')';
      break;
    case 'EXP':
      code = 'math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      // This rounds up.  Blockly does not specify rounding direction.
      code = 'math.floor(' + arg + ' + .5)';
      break;
    case 'ROUNDUP':
      code = 'math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'math.floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'math.sin(math.rad(' + arg + '))';
      break;
    case 'COS':
      code = 'math.cos(math.rad(' + arg + '))';
      break;
    case 'TAN':
      code = 'math.tan(math.rad(' + arg + '))';
      break;
    case 'ASIN':
      code = 'math.deg(math.asin(' + arg + '))';
      break;
    case 'ACOS':
      code = 'math.deg(math.acos(' + arg + '))';
      break;
    case 'ATAN':
      code = 'math.deg(math.atan(' + arg + '))';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.interncode.ORDER_HIGH];
};

Blockly.interncode['math_constant'] = function (block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    PI: ['math.pi', Blockly.interncode.ORDER_HIGH],
    E: ['math.exp(1)', Blockly.interncode.ORDER_HIGH],
    GOLDEN_RATIO: ['(1 + math.sqrt(5)) / 2', Blockly.interncode.ORDER_MULTIPLICATIVE],
    SQRT2: ['math.sqrt(2)', Blockly.interncode.ORDER_HIGH],
    SQRT1_2: ['math.sqrt(1 / 2)', Blockly.interncode.ORDER_HIGH],
    INFINITY: ['math.huge', Blockly.interncode.ORDER_HIGH]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

Blockly.interncode['math_number_property'] = function (block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.interncode.valueToCode(block, 'NUMBER_TO_CHECK',
    Blockly.interncode.ORDER_MULTIPLICATIVE) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    var functionName = Blockly.interncode.provideFunction_(
      'math_isPrime',
      ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(n)',
        '  -- https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
        '  if n == 2 or n == 3 then',
        '    return true',
        '  end',
        '  -- False if n is NaN, negative, is 1, or not whole.',
        '  -- And false if n is divisible by 2 or 3.',
        '  if not(n > 1) or n % 1 ~= 0 or n % 2 == 0 or n % 3 == 0 then',
        '    return false',
        '  end',
        '  -- Check all the numbers of form 6k +/- 1, up to sqrt(n).',
        '  for x = 6, math.sqrt(n) + 1.5, 6 do',
        '    if n % (x - 1) == 0 or n % (x + 1) == 0 then',
        '      return false',
        '    end',
        '  end',
        '  return true',
        'end']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.interncode.ORDER_HIGH];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.interncode.valueToCode(block, 'DIVISOR',
        Blockly.interncode.ORDER_MULTIPLICATIVE);
      // If 'divisor' is some code that evals to 0, interncode will produce a nan.
      // Let's produce nil if we can determine this at compile-time.
      if (!divisor || divisor == '0') {
        return ['nil', Blockly.interncode.ORDER_ATOMIC];
      }
      // The normal trick to implement ?: with and/or doesn't work here:
      //   divisor == 0 and nil or number_to_check % divisor == 0
      // because nil is false, so allow a runtime failure. :-(
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.interncode.ORDER_RELATIONAL];
};

Blockly.interncode['math_change'] = function (block) {
  // Add to a variable in place.
  var argument0 = Blockly.interncode.valueToCode(block, 'DELTA',
    Blockly.interncode.ORDER_ADDITIVE) || '0';
  var varName = Blockly.interncode.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + varName + ' + ' + argument0 + '\n';
};

// Rounding functions have a single operand.
Blockly.interncode['math_round'] = Blockly.interncode['math_single'];
// Trigonometry functions have a single operand.
Blockly.interncode['math_trig'] = Blockly.interncode['math_single'];

Blockly.interncode['math_on_list'] = function (block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.interncode.valueToCode(block, 'LIST',
    Blockly.interncode.ORDER_NONE) || '{}';
  var functionName;

  // Functions needed in more than one case.
  function provideSum() {
    return Blockly.interncode.provideFunction_(
      'math_sum',
      ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
        '  local result = 0',
        '  for _, v in ipairs(t) do',
        '    result = result + v',
        '  end',
        '  return result',
        'end']);
  }

  switch (func) {
    case 'SUM':
      functionName = provideSum();
      break;

    case 'MIN':
      // Returns 0 for the empty list.
      functionName = Blockly.interncode.provideFunction_(
        'math_min',
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  if #t == 0 then',
          '    return 0',
          '  end',
          '  local result = math.huge',
          '  for _, v in ipairs(t) do',
          '    if v < result then',
          '      result = v',
          '    end',
          '  end',
          '  return result',
          'end']);
      break;

    case 'AVERAGE':
      // Returns 0 for the empty list.
      functionName = Blockly.interncode.provideFunction_(
        'math_average',
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  if #t == 0 then',
          '    return 0',
          '  end',
        '  return ' + provideSum() + '(t) / #t',
          'end']);
      break;

    case 'MAX':
      // Returns 0 for the empty list.
      functionName = Blockly.interncode.provideFunction_(
        'math_max',
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  if #t == 0 then',
          '    return 0',
          '  end',
          '  local result = -math.huge',
          '  for _, v in ipairs(t) do',
          '    if v > result then',
          '      result = v',
          '    end',
          '  end',
          '  return result',
          'end']);
      break;

    case 'MEDIAN':
      functionName = Blockly.interncode.provideFunction_(
        'math_median',
        // This operation excludes non-numbers.
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  -- Source: http://interncode-users.org/wiki/SimpleStats',
          '  if #t == 0 then',
          '    return 0',
          '  end',
          '  local temp={}',
          '  for _, v in ipairs(t) do',
          '    if type(v) == "number" then',
          '      table.insert(temp, v)',
          '    end',
          '  end',
          '  table.sort(temp)',
          '  if #temp % 2 == 0 then',
          '    return (temp[#temp/2] + temp[(#temp/2)+1]) / 2',
          '  else',
          '    return temp[math.ceil(#temp/2)]',
          '  end',
          'end']);
      break;

    case 'MODE':
      functionName = Blockly.interncode.provideFunction_(
        'math_modes',
        // As a list of numbers can contain more than one mode,
        // the returned result is provided as an array.
        // The interncode version includes non-numbers.
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  -- Source: http://interncode-users.org/wiki/SimpleStats',
          '  local counts={}',
          '  for _, v in ipairs(t) do',
          '    if counts[v] == nil then',
          '      counts[v] = 1',
          '    else',
          '      counts[v] = counts[v] + 1',
          '    end',
          '  end',
          '  local biggestCount = 0',
          '  for _, v  in pairs(counts) do',
          '    if v > biggestCount then',
          '      biggestCount = v',
          '    end',
          '  end',
          '  local temp={}',
          '  for k, v in pairs(counts) do',
          '    if v == biggestCount then',
          '      table.insert(temp, k)',
          '    end',
          '  end',
          '  return temp',
          'end']);
      break;

    case 'STD_DEV':
      functionName = Blockly.interncode.provideFunction_(
        'math_standard_deviation',
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  local m',
          '  local vm',
          '  local total = 0',
          '  local count = 0',
          '  local result',
        '  m = #t == 0 and 0 or ' + provideSum() + '(t) / #t',
          '  for _, v in ipairs(t) do',
          "    if type(v) == 'number' then",
          '      vm = v - m',
          '      total = total + (vm * vm)',
          '      count = count + 1',
          '    end',
          '  end',
          '  result = math.sqrt(total / (count-1))',
          '  return result',
          'end']);
      break;

    case 'RANDOM':
      functionName = Blockly.interncode.provideFunction_(
        'math_random_list',
        ['function ' + Blockly.interncode.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
          '  if #t == 0 then',
          '    return nil',
          '  end',
          '  return t[math.random(#t)]',
          'end']);
      break;

    default:
      throw 'Unknown operator: ' + func;
  }
  return [functionName + '(' + list + ')', Blockly.interncode.ORDER_HIGH];
};

Blockly.interncode['math_modulo'] = function (block) {
  // Remainder computation.
  var argument0 = Blockly.interncode.valueToCode(block, 'DIVIDEND',
    Blockly.interncode.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.interncode.valueToCode(block, 'DIVISOR',
    Blockly.interncode.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.interncode.ORDER_MULTIPLICATIVE];
};

Blockly.interncode['math_constrain'] = function (block) {
  // Constrain a number between two limits.
  var argument0 = Blockly.interncode.valueToCode(block, 'VALUE',
    Blockly.interncode.ORDER_NONE) || '0';
  var argument1 = Blockly.interncode.valueToCode(block, 'LOW',
    Blockly.interncode.ORDER_NONE) || '-math.huge';
  var argument2 = Blockly.interncode.valueToCode(block, 'HIGH',
    Blockly.interncode.ORDER_NONE) || 'math.huge';
  var code = 'math.min(math.max(' + argument0 + ', ' + argument1 + '), ' +
    argument2 + ')';
  return [code, Blockly.interncode.ORDER_HIGH];
};

Blockly.interncode['math_random_int'] = function (block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.interncode.valueToCode(block, 'FROM',
    Blockly.interncode.ORDER_NONE) || '0';
  var argument1 = Blockly.interncode.valueToCode(block, 'TO',
    Blockly.interncode.ORDER_NONE) || '0';
  var code = 'math.random(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.interncode.ORDER_HIGH];
};

Blockly.interncode['math_random_float'] = function (block) {
  // Random fraction between 0 and 1.
  return ['math.random()', Blockly.interncode.ORDER_HIGH];
};

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
 * @fileoverview Generating ArduinoCpp for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

//goog.provide('Blockly.ArduinoCpp.math');

//goog.require('Blockly.ArduinoCpp');


Blockly.ArduinoCpp.addReservedWords('Math');

Blockly.ArduinoCpp['math_number'] = function (block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order;
  if (code == Infinity) {
    code = 'double.INFINITY';
    order = Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX;
  } else if (code == -Infinity) {
    code = '-double.INFINITY';
    order = Blockly.ArduinoCpp.ORDER_UNARY_PREFIX;
  } else {
    // -4.abs() returns -4 in ArduinoCpp due to strange order of operation choices.
    // -4 is actually an operator and a number.  Reflect this in the order.
    order = code < 0 ?
      Blockly.ArduinoCpp.ORDER_UNARY_PREFIX : Blockly.ArduinoCpp.ORDER_ATOMIC;
  }
  return [code, order];
};

Blockly.ArduinoCpp['math_arithmetic'] = function (block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.ArduinoCpp.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.ArduinoCpp.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE],
    'POWER': [null, Blockly.ArduinoCpp.ORDER_NONE]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.ArduinoCpp.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in ArduinoCpp requires a special case since it has no operator.
  if (!operator) {
    Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
      'import \'ArduinoCpp:math\' as Math;';
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.ArduinoCpp['math_single'] = function (block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.ArduinoCpp.valueToCode(block, 'NUM',
      Blockly.ArduinoCpp.ORDER_UNARY_PREFIX) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in ArduinoCpp.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.ArduinoCpp.ORDER_UNARY_PREFIX];
  }
  Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
    'import \'ArduinoCpp:math\' as Math;';
  if (operator == 'ABS' || operator.substring(0, 5) == 'ROUND') {
    arg = Blockly.ArduinoCpp.valueToCode(block, 'NUM',
      Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX) || '0';
  } else if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.ArduinoCpp.valueToCode(block, 'NUM',
      Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.ArduinoCpp.valueToCode(block, 'NUM',
      Blockly.ArduinoCpp.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = arg + '.abs()';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = arg + '.round()';
      break;
    case 'ROUNDUP':
      code = arg + '.ceil()';
      break;
    case 'ROUNDDOWN':
      code = arg + '.floor()';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = 'Math.log(' + arg + ') / Math.log(10)';
      break;
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE];
};

Blockly.ArduinoCpp['math_constant'] = function (block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    'PI': ['Math.PI', Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX],
    'E': ['Math.E', Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX],
    'GOLDEN_RATIO':
      ['(1 + Math.sqrt(5)) / 2', Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE],
    'SQRT2': ['Math.SQRT2', Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX],
    'SQRT1_2': ['Math.SQRT1_2', Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX],
    'INFINITY': ['double.INFINITY', Blockly.ArduinoCpp.ORDER_ATOMIC]
  };
  var constant = block.getFieldValue('CONSTANT');
  if (constant != 'INFINITY') {
    Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
      'import \'ArduinoCpp:math\' as Math;';
  }
  return CONSTANTS[constant];
};

Blockly.ArduinoCpp['math_number_property'] = function (block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.ArduinoCpp.valueToCode(block, 'NUMBER_TO_CHECK',
    Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE);
  if (!number_to_check) {
    return ['false', Blockly.Python.ORDER_ATOMIC];
  }
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
      'import \'ArduinoCpp:math\' as Math;';
    var functionName = Blockly.ArduinoCpp.provideFunction_(
      'math_isPrime',
      ['bool ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
        '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
        '  if (n == 2 || n == 3) {',
        '    return true;',
        '  }',
        '  // False if n is null, negative, is 1, or not whole.',
        '  // And false if n is divisible by 2 or 3.',
      '  if (n == null || n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
      ' n % 3 == 0) {',
        '    return false;',
        '  }',
        '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
        '  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {',
        '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
        '      return false;',
        '    }',
        '  }',
        '  return true;',
        '}']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.ArduinoCpp.valueToCode(block, 'DIVISOR',
        Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE);
      if (!divisor) {
        return ['false', Blockly.Python.ORDER_ATOMIC];
      }
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.ArduinoCpp.ORDER_EQUALITY];
};

Blockly.ArduinoCpp['math_change'] = function (block) {
  // Add to a variable in place.
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'DELTA',
    Blockly.ArduinoCpp.ORDER_ADDITIVE) || '0';
  var varName = Blockly.ArduinoCpp.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  return varName + ' = (' + varName + ' is num ? ' + varName + ' : 0) + ' +
    argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.ArduinoCpp['math_round'] = Blockly.ArduinoCpp['math_single'];
// Trigonometry functions have a single operand.
Blockly.ArduinoCpp['math_trig'] = Blockly.ArduinoCpp['math_single'];

Blockly.ArduinoCpp['math_on_list'] = function (block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.ArduinoCpp.valueToCode(block, 'LIST',
    Blockly.ArduinoCpp.ORDER_NONE) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_sum',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  num sumVal = 0;',
          '  myList.forEach((num entry) {sumVal += entry;});',
          '  return sumVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MIN':
      Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
        'import \'ArduinoCpp:math\' as Math;';
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_min',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  if (myList.isEmpty) return null;',
          '  num minVal = myList[0];',
        '  myList.forEach((num entry) ' +
        '{minVal = Math.min(minVal, entry);});',
          '  return minVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MAX':
      Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
        'import \'ArduinoCpp:math\' as Math;';
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_max',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  if (myList.isEmpty) return null;',
          '  num maxVal = myList[0];',
        '  myList.forEach((num entry) ' +
        '{maxVal = Math.max(maxVal, entry);});',
          '  return maxVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'AVERAGE':
      // This operation exclude null and values that are not int or float:
      //   math_mean([null,null,"aString",1,9]) == 5.0.
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_mean',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  // First filter list for numbers only.',
          '  List localList = new List.from(myList);',
          '  localList.removeWhere((a) => a is! num);',
          '  if (localList.isEmpty) return null;',
          '  num sumVal = 0;',
          '  localList.forEach((num entry) {sumVal += entry;});',
          '  return sumVal / localList.length;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MEDIAN':
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_median',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
        '  // First filter list for numbers only, then sort, ' +
        'then return middle value',
        '  // or the average of two middle values if list has an ' +
        'even number of elements.',
          '  List localList = new List.from(myList);',
          '  localList.removeWhere((a) => a is! num);',
          '  if (localList.isEmpty) return null;',
          '  localList.sort((a, b) => (a - b));',
          '  int index = localList.length ~/ 2;',
          '  if (localList.length % 2 == 1) {',
          '    return localList[index];',
          '  } else {',
          '    return (localList[index - 1] + localList[index]) / 2;',
          '  }',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MODE':
      Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
        'import \'ArduinoCpp:math\' as Math;';
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_modes',
        ['List ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List values) {',
          '  List modes = [];',
          '  List counts = [];',
          '  int maxCount = 0;',
          '  for (int i = 0; i < values.length; i++) {',
          '    var value = values[i];',
          '    bool found = false;',
          '    int thisCount;',
          '    for (int j = 0; j < counts.length; j++) {',
          '      if (counts[j][0] == value) {',
          '        thisCount = ++counts[j][1];',
          '        found = true;',
          '        break;',
          '      }',
          '    }',
          '    if (!found) {',
          '      counts.add([value, 1]);',
          '      thisCount = 1;',
          '    }',
          '    maxCount = Math.max(thisCount, maxCount);',
          '  }',
          '  for (int j = 0; j < counts.length; j++) {',
          '    if (counts[j][1] == maxCount) {',
          '        modes.add(counts[j][0]);',
          '    }',
          '  }',
          '  return modes;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
        'import \'ArduinoCpp:math\' as Math;';
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_standard_deviation',
        ['num ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  // First filter list for numbers only.',
          '  List numbers = new List.from(myList);',
          '  numbers.removeWhere((a) => a is! num);',
          '  if (numbers.isEmpty) return null;',
          '  num n = numbers.length;',
          '  num sum = 0;',
          '  numbers.forEach((x) => sum += x);',
          '  num mean = sum / n;',
          '  num sumSquare = 0;',
        '  numbers.forEach((x) => sumSquare += ' +
        'Math.pow(x - mean, 2));',
          '  return Math.sqrt(sumSquare / n);',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'RANDOM':
      Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
        'import \'ArduinoCpp:math\' as Math;';
      var functionName = Blockly.ArduinoCpp.provideFunction_(
        'math_random_item',
        ['dynamic ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  int x = new Math.Random().nextInt(myList.length);',
          '  return myList[x];',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
};

Blockly.ArduinoCpp['math_modulo'] = function (block) {
  // Remainder computation.
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'DIVIDEND',
    Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.ArduinoCpp.valueToCode(block, 'DIVISOR',
    Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.ArduinoCpp.ORDER_MULTIPLICATIVE];
};

Blockly.ArduinoCpp['math_constrain'] = function (block) {
  // Constrain a number between two limits.
  Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
    'import \'ArduinoCpp:math\' as Math;';
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'VALUE',
    Blockly.ArduinoCpp.ORDER_NONE) || '0';
  var argument1 = Blockly.ArduinoCpp.valueToCode(block, 'LOW',
    Blockly.ArduinoCpp.ORDER_NONE) || '0';
  var argument2 = Blockly.ArduinoCpp.valueToCode(block, 'HIGH',
    Blockly.ArduinoCpp.ORDER_NONE) || 'double.INFINITY';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
    argument2 + ')';
  return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
};

Blockly.ArduinoCpp['math_random_int'] = function (block) {
  // Random integer between [X] and [Y].
  Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
    'import \'ArduinoCpp:math\' as Math;';
  var argument0 = Blockly.ArduinoCpp.valueToCode(block, 'FROM',
    Blockly.ArduinoCpp.ORDER_NONE) || '0';
  var argument1 = Blockly.ArduinoCpp.valueToCode(block, 'TO',
    Blockly.ArduinoCpp.ORDER_NONE) || '0';
  var functionName = Blockly.ArduinoCpp.provideFunction_(
    'math_random_int',
    ['int ' + Blockly.ArduinoCpp.FUNCTION_NAME_PLACEHOLDER_ + '(num a, num b) {',
      '  if (a > b) {',
      '    // Swap a and b to ensure a is smaller.',
      '    num c = a;',
      '    a = b;',
      '    b = c;',
      '  }',
      '  return new Math.Random().nextInt(b - a + 1) + a;',
      '}']);
  var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
};

Blockly.ArduinoCpp['math_random_float'] = function (block) {
  // Random fraction between 0 and 1.
  Blockly.ArduinoCpp.definitions_['import_ArduinoCpp_math'] =
    'import \'ArduinoCpp:math\' as Math;';
  return ['new Math.Random().nextDouble()', Blockly.ArduinoCpp.ORDER_UNARY_POSTFIX];
};

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
 * @fileoverview Generating Cpp for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

//goog.provide('Blockly.Cpp.math');

//goog.require('Blockly.Cpp');


Blockly.Cpp.addReservedWords('Math');

Blockly.Cpp['math_number'] = function (block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order;
  if (code == Infinity) {
    code = 'double.INFINITY';
    order = Blockly.Cpp.ORDER_UNARY_POSTFIX;
  } else if (code == -Infinity) {
    code = '-double.INFINITY';
    order = Blockly.Cpp.ORDER_UNARY_PREFIX;
  } else {
    // -4.abs() returns -4 in Cpp due to strange order of operation choices.
    // -4 is actually an operator and a number.  Reflect this in the order.
    order = code < 0 ?
      Blockly.Cpp.ORDER_UNARY_PREFIX : Blockly.Cpp.ORDER_ATOMIC;
  }
  return [code, order];
};

Blockly.Cpp['math_arithmetic'] = function (block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.Cpp.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.Cpp.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.Cpp.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.Cpp.ORDER_MULTIPLICATIVE],
    'POWER': [null, Blockly.Cpp.ORDER_NONE]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Cpp.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Cpp.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in Cpp requires a special case since it has no operator.
  if (!operator) {
    Blockly.Cpp.definitions_['import_Cpp_math'] =
      'import \'Cpp:math\' as Math;';
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Cpp['math_single'] = function (block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.Cpp.valueToCode(block, 'NUM',
      Blockly.Cpp.ORDER_UNARY_PREFIX) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in Cpp.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.Cpp.ORDER_UNARY_PREFIX];
  }
  Blockly.Cpp.definitions_['import_Cpp_math'] =
    'import \'Cpp:math\' as Math;';
  if (operator == 'ABS' || operator.substring(0, 5) == 'ROUND') {
    arg = Blockly.Cpp.valueToCode(block, 'NUM',
      Blockly.Cpp.ORDER_UNARY_POSTFIX) || '0';
  } else if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.Cpp.valueToCode(block, 'NUM',
      Blockly.Cpp.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.Cpp.valueToCode(block, 'NUM',
      Blockly.Cpp.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = arg + '.abs()';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = arg + '.round()';
      break;
    case 'ROUNDUP':
      code = arg + '.ceil()';
      break;
    case 'ROUNDDOWN':
      code = arg + '.floor()';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = 'Math.log(' + arg + ') / Math.log(10)';
      break;
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Cpp.ORDER_MULTIPLICATIVE];
};

Blockly.Cpp['math_constant'] = function (block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    'PI': ['Math.PI', Blockly.Cpp.ORDER_UNARY_POSTFIX],
    'E': ['Math.E', Blockly.Cpp.ORDER_UNARY_POSTFIX],
    'GOLDEN_RATIO':
      ['(1 + Math.sqrt(5)) / 2', Blockly.Cpp.ORDER_MULTIPLICATIVE],
    'SQRT2': ['Math.SQRT2', Blockly.Cpp.ORDER_UNARY_POSTFIX],
    'SQRT1_2': ['Math.SQRT1_2', Blockly.Cpp.ORDER_UNARY_POSTFIX],
    'INFINITY': ['double.INFINITY', Blockly.Cpp.ORDER_ATOMIC]
  };
  var constant = block.getFieldValue('CONSTANT');
  if (constant != 'INFINITY') {
    Blockly.Cpp.definitions_['import_Cpp_math'] =
      'import \'Cpp:math\' as Math;';
  }
  return CONSTANTS[constant];
};

Blockly.Cpp['math_number_property'] = function (block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.Cpp.valueToCode(block, 'NUMBER_TO_CHECK',
    Blockly.Cpp.ORDER_MULTIPLICATIVE);
  if (!number_to_check) {
    return ['false', Blockly.Python.ORDER_ATOMIC];
  }
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    Blockly.Cpp.definitions_['import_Cpp_math'] =
      'import \'Cpp:math\' as Math;';
    var functionName = Blockly.Cpp.provideFunction_(
      'math_isPrime',
      ['bool ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
        '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
        '  if (n == 2 || n == 3) {',
        '    return true;',
        '  }',
        '  // False if n is null, negative, is 1, or not whole.',
        '  // And false if n is divisible by 2 or 3.',
      '  if (n == null || n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
      ' n % 3 == 0) {',
        '    return false;',
        '  }',
        '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
        '  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {',
        '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
        '      return false;',
        '    }',
        '  }',
        '  return true;',
        '}']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Cpp.valueToCode(block, 'DIVISOR',
        Blockly.Cpp.ORDER_MULTIPLICATIVE);
      if (!divisor) {
        return ['false', Blockly.Python.ORDER_ATOMIC];
      }
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Cpp.ORDER_EQUALITY];
};

Blockly.Cpp['math_change'] = function (block) {
  // Add to a variable in place.
  var argument0 = Blockly.Cpp.valueToCode(block, 'DELTA',
    Blockly.Cpp.ORDER_ADDITIVE) || '0';
  var varName = Blockly.Cpp.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  return varName + ' = (' + varName + ' is num ? ' + varName + ' : 0) + ' +
    argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.Cpp['math_round'] = Blockly.Cpp['math_single'];
// Trigonometry functions have a single operand.
Blockly.Cpp['math_trig'] = Blockly.Cpp['math_single'];

Blockly.Cpp['math_on_list'] = function (block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.Cpp.valueToCode(block, 'LIST',
    Blockly.Cpp.ORDER_NONE) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      var functionName = Blockly.Cpp.provideFunction_(
        'math_sum',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  num sumVal = 0;',
          '  myList.forEach((num entry) {sumVal += entry;});',
          '  return sumVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MIN':
      Blockly.Cpp.definitions_['import_Cpp_math'] =
        'import \'Cpp:math\' as Math;';
      var functionName = Blockly.Cpp.provideFunction_(
        'math_min',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  if (myList.isEmpty) return null;',
          '  num minVal = myList[0];',
        '  myList.forEach((num entry) ' +
        '{minVal = Math.min(minVal, entry);});',
          '  return minVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MAX':
      Blockly.Cpp.definitions_['import_Cpp_math'] =
        'import \'Cpp:math\' as Math;';
      var functionName = Blockly.Cpp.provideFunction_(
        'math_max',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  if (myList.isEmpty) return null;',
          '  num maxVal = myList[0];',
        '  myList.forEach((num entry) ' +
        '{maxVal = Math.max(maxVal, entry);});',
          '  return maxVal;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'AVERAGE':
      // This operation exclude null and values that are not int or float:
      //   math_mean([null,null,"aString",1,9]) == 5.0.
      var functionName = Blockly.Cpp.provideFunction_(
        'math_mean',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  // First filter list for numbers only.',
          '  List localList = new List.from(myList);',
          '  localList.removeWhere((a) => a is! num);',
          '  if (localList.isEmpty) return null;',
          '  num sumVal = 0;',
          '  localList.forEach((num entry) {sumVal += entry;});',
          '  return sumVal / localList.length;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MEDIAN':
      var functionName = Blockly.Cpp.provideFunction_(
        'math_median',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
        '  // First filter list for numbers only, then sort, ' +
        'then return middle value',
        '  // or the average of two middle values if list has an ' +
        'even number of elements.',
          '  List localList = new List.from(myList);',
          '  localList.removeWhere((a) => a is! num);',
          '  if (localList.isEmpty) return null;',
          '  localList.sort((a, b) => (a - b));',
          '  int index = localList.length ~/ 2;',
          '  if (localList.length % 2 == 1) {',
          '    return localList[index];',
          '  } else {',
          '    return (localList[index - 1] + localList[index]) / 2;',
          '  }',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'MODE':
      Blockly.Cpp.definitions_['import_Cpp_math'] =
        'import \'Cpp:math\' as Math;';
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = Blockly.Cpp.provideFunction_(
        'math_modes',
        ['List ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List values) {',
          '  List modes = [];',
          '  List counts = [];',
          '  int maxCount = 0;',
          '  for (int i = 0; i < values.length; i++) {',
          '    var value = values[i];',
          '    bool found = false;',
          '    int thisCount;',
          '    for (int j = 0; j < counts.length; j++) {',
          '      if (counts[j][0] == value) {',
          '        thisCount = ++counts[j][1];',
          '        found = true;',
          '        break;',
          '      }',
          '    }',
          '    if (!found) {',
          '      counts.add([value, 1]);',
          '      thisCount = 1;',
          '    }',
          '    maxCount = Math.max(thisCount, maxCount);',
          '  }',
          '  for (int j = 0; j < counts.length; j++) {',
          '    if (counts[j][1] == maxCount) {',
          '        modes.add(counts[j][0]);',
          '    }',
          '  }',
          '  return modes;',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      Blockly.Cpp.definitions_['import_Cpp_math'] =
        'import \'Cpp:math\' as Math;';
      var functionName = Blockly.Cpp.provideFunction_(
        'math_standard_deviation',
        ['num ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  // First filter list for numbers only.',
          '  List numbers = new List.from(myList);',
          '  numbers.removeWhere((a) => a is! num);',
          '  if (numbers.isEmpty) return null;',
          '  num n = numbers.length;',
          '  num sum = 0;',
          '  numbers.forEach((x) => sum += x);',
          '  num mean = sum / n;',
          '  num sumSquare = 0;',
        '  numbers.forEach((x) => sumSquare += ' +
        'Math.pow(x - mean, 2));',
          '  return Math.sqrt(sumSquare / n);',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    case 'RANDOM':
      Blockly.Cpp.definitions_['import_Cpp_math'] =
        'import \'Cpp:math\' as Math;';
      var functionName = Blockly.Cpp.provideFunction_(
        'math_random_item',
        ['dynamic ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ +
          '(List myList) {',
          '  int x = new Math.Random().nextInt(myList.length);',
          '  return myList[x];',
          '}']);
      code = functionName + '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
};

Blockly.Cpp['math_modulo'] = function (block) {
  // Remainder computation.
  var argument0 = Blockly.Cpp.valueToCode(block, 'DIVIDEND',
    Blockly.Cpp.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.Cpp.valueToCode(block, 'DIVISOR',
    Blockly.Cpp.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Cpp.ORDER_MULTIPLICATIVE];
};

Blockly.Cpp['math_constrain'] = function (block) {
  // Constrain a number between two limits.
  Blockly.Cpp.definitions_['import_Cpp_math'] =
    'import \'Cpp:math\' as Math;';
  var argument0 = Blockly.Cpp.valueToCode(block, 'VALUE',
    Blockly.Cpp.ORDER_NONE) || '0';
  var argument1 = Blockly.Cpp.valueToCode(block, 'LOW',
    Blockly.Cpp.ORDER_NONE) || '0';
  var argument2 = Blockly.Cpp.valueToCode(block, 'HIGH',
    Blockly.Cpp.ORDER_NONE) || 'double.INFINITY';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
    argument2 + ')';
  return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
};

Blockly.Cpp['math_random_int'] = function (block) {
  // Random integer between [X] and [Y].
  Blockly.Cpp.definitions_['import_Cpp_math'] =
    'import \'Cpp:math\' as Math;';
  var argument0 = Blockly.Cpp.valueToCode(block, 'FROM',
    Blockly.Cpp.ORDER_NONE) || '0';
  var argument1 = Blockly.Cpp.valueToCode(block, 'TO',
    Blockly.Cpp.ORDER_NONE) || '0';
  var functionName = Blockly.Cpp.provideFunction_(
    'math_random_int',
    ['int ' + Blockly.Cpp.FUNCTION_NAME_PLACEHOLDER_ + '(num a, num b) {',
      '  if (a > b) {',
      '    // Swap a and b to ensure a is smaller.',
      '    num c = a;',
      '    a = b;',
      '    b = c;',
      '  }',
      '  return new Math.Random().nextInt(b - a + 1) + a;',
      '}']);
  var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Cpp.ORDER_UNARY_POSTFIX];
};

Blockly.Cpp['math_random_float'] = function (block) {
  // Random fraction between 0 and 1.
  Blockly.Cpp.definitions_['import_Cpp_math'] =
    'import \'Cpp:math\' as Math;';
  return ['new Math.Random().nextDouble()', Blockly.Cpp.ORDER_UNARY_POSTFIX];
};
