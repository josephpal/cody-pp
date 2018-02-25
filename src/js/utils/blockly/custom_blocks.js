import Blockly from 'node-blockly/browser';

/*
 *
 */
 Blockly.Blocks['start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start");
    this.appendStatementInput("state");
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
 Blockly.BlockSvg.START_HAT = true;
  }
};

/*
 *
 */
Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wait")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 0.01), "seconds")
        .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

/*
 *
 */
Blockly.Blocks['motor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Motor")
        .appendField(new Blockly.FieldDropdown([["M0","0"], ["M1","1"], ["M2","2"], ["M3","3"]]), "motorNumber")
        .appendField(" direction")
        .appendField(new Blockly.FieldDropdown([["left","0"], ["right","1"]]), "motorDirection")
        .appendField("speed")
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"], ["8","8"]]), "motorSpeed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
/*
 *
 */

Blockly.Blocks['digital_out'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Digital Port")
        .appendField(new Blockly.FieldDropdown([["D0","0"], ["D1","1"], ["D2","2"], ["D3","3"], ["D4","4"], ["D5","5"], ["D6","6"], ["D7","7"]]), "Port")
        .appendField(new Blockly.FieldDropdown([["High","1"], ["Low","0"]]), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

/*
 *
 */
Blockly.Blocks['lamp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set")
        .appendField(new Blockly.FieldDropdown([["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"]]), "lampNumber")
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"]]), "state");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

/*
 * Freifeld
 */
 /*Blockly.Blocks['digital_logic_compare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0, 7, 1), "A")
        .appendField(new Blockly.FieldTextInput("="), "OP")
        .appendField(new Blockly.FieldNumber(0, 0, 1, 1), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Digital Compare");
 this.setHelpUrl("");
  }
};*/

/*
 *
 */
Blockly.Blocks['analog_logic_compare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port A0","0"], ["Port A1","1"], ["Port A2","2"], ["Port A3","3"], ["Port A4","4"], ["Port A5","5"], ["Port A6","6"], ["Port A7","7"]]), "A")
        .appendField(new Blockly.FieldDropdown([["=","EQ"], ["<","LT"], [">","GT"]]), "OP")
        .appendField(new Blockly.FieldNumber(0, 0, 127, 1), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Analog Compare");
 this.setHelpUrl("");
  }
};

/*
 * Dropdown
 */
Blockly.Blocks['digital_logic_compare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port D0","0"], ["Port D1","1"], ["Port D2","2"], ["Port D3","3"], ["Port D4","4"], ["Port D5","5"], ["Port D6","6"], ["Port D7","7"]]), "A")
        .appendField(new Blockly.FieldTextInput("="), "OP")
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"]]), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Digital Compare");
 this.setHelpUrl("");
  }
};

/*
 *
 */

Blockly.Blocks['controls_if1'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("if");
    this.appendStatementInput("DO0")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

/*
 *
 */

 Blockly.Blocks['controls_whileuntil1'] = {
  init: function() {
    this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("repeat while");
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['controls_ifelse1'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("if");
    this.appendStatementInput("DO0")
        .setCheck(null)
        .appendField("do");
    this.appendStatementInput("ELSE")
        .setCheck(null)
        .appendField("else do");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
