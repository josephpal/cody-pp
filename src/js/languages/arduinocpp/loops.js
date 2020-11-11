import Blockly from "blockly"

export default (generator) => {
  generator.addContinueLabel = function (branch) {
    if (branch.indexOf(generator.CONTINUE_STATEMENT) > -1) {
      return branch + generator.INDENT + '::continue::\n';
    } else {
      return branch;
    }
  };

  generator['controls_repeat_ext'] = function (block) {
    // Repeat n times (external number).
    var repeats = generator.valueToCode(block, 'TIMES',
      generator.ORDER_NONE) || '0';
    if (Blockly.isNumber(repeats)) {
      repeats = parseInt(repeats, 10);
    } else {
      repeats = 'math.floor(' + repeats + ')';
    }
    var branch = generator.statementToCode(block, 'DO') || '\n';
    branch = generator.addContinueLabel(branch);
    var code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' + branch + '}\n';
    return code;
  };

  generator['controls_repeat_extGer'] = generator['controls_repeat_ext'];

  generator['controls_whileuntil1'] = function (block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = generator.valueToCode(block, 'BOOL',
      until ? generator.ORDER_UNARY :
        generator.ORDER_NONE) || '';
    var branch = generator.statementToCode(block, 'DO') || '\n';
    branch = generator.addLoopTrap(branch, block.id);
    branch = generator.addContinueLabel(branch);
    if (until) {
      argument0 = 'not ' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
  };

  generator['controls_whileuntil1Ger'] = generator['controls_whileuntil1'];
}
