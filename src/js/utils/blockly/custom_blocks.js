import Blockly from 'node-blockly/browser';

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start");
    this.appendStatementInput("state");
    this.setColour(65);
 this.setTooltip("Every program has to be surrounded with this block.");
 // + "It initializes all necessary objects which are needed by the robot."
 // + "A similar code example is the standard main function in all common programming languages."
 this.setHelpUrl("https://en.wikipedia.org/wiki/Entry_point");
 Blockly.BlockSvg.START_HAT = true;
  }
};

Blockly.Blocks['startGer'] = {
  init: function() {
    this.appendDummyInput()
    .appendField("Start");
    this.appendStatementInput("state");
    this.setColour(65);
    this.setTooltip("Jedes Programm muss mit diesem initialen Block eingeschlossen werden.");
    // + "It initializes all necessary objects which are needed by the robot."
    // + "A similar code example is the standard main function in all common programming languages."
    this.setHelpUrl("https://en.wikipedia.org/wiki/Entry_point");
    Blockly.BlockSvg.START_HAT = true;
 }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("delay")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 0.01), "seconds")
        .appendField("second(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("Perform current action for x seconds.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['waitGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Warte")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 0.01), "seconds")
        .appendField("Sekunden");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("Führe derzeitige Aktion(en) für x Sekunden aus.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['perform_action'] = {
   init: function() {
     this.appendDummyInput()
         .appendField("do for")
         .appendField(new Blockly.FieldNumber(0, 0, 255, 0.01), "seconds")
         .appendField("second(s)");
     this.appendStatementInput("actuator_input")
         .setCheck("wait");
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setColour(260);
  this.setTooltip("Perform current action(s) for x second(s).");
  this.setHelpUrl("");
   }
 };

Blockly.Blocks['perform_actionGer'] = {
   init: function() {
     this.appendDummyInput()
         .appendField("Führe aus für")
         .appendField(new Blockly.FieldNumber(0, 0, 255, 0.01), "seconds")
         .appendField("Sekunden");
     this.appendStatementInput("actuator_input")
         .setCheck("wait");
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setColour(260);
  this.setTooltip("Führe derzeitige Aktion(en) für x Sekunden aus.");
  this.setHelpUrl("");
   }
 };

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['stop_motors'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stop")
        .appendField(new Blockly.FieldDropdown([["all","option_all"], ["M0","motor_0"], ["M1","motor_1"]/*, ["M2","motor_2"], ["M3","motor_3"]*/]), "option")
        .appendField("motor(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Stop specific motor(s).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['stop_motorsGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stoppe")
        .appendField(new Blockly.FieldDropdown([["alle","option_all"], ["M0","motor_0"], ["M1","motor_1"]/*, ["M2","motor_2"], ["M3","motor_3"]*/]), "option")
        .appendField("Motor(en)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Stoppe bestimmte Motoren.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['motor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set motor")
        .appendField(new Blockly.FieldDropdown([["M0","0"], ["M1","1"]/*, ["M2","2"], ["M3","3"]*/]), "motorNumber")
        .appendField(" direction")
        .appendField(new Blockly.FieldDropdown([["left","0"], ["right","1"]]), "motorDirection")
        .appendField(" speed")
        .appendField(new Blockly.FieldNumber(0, 0, 50, 1), "motorSpeed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Set a specific motor direction (right/left) and a motor speed.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['motorGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setze Motor")
        .appendField(new Blockly.FieldDropdown([["M0","0"], ["M1","1"]/*, ["M2","2"], ["M3","3"]*/]), "motorNumber")
        .appendField(" Richtung")
        .appendField(new Blockly.FieldDropdown([["links","0"], ["rechts","1"]]), "motorDirection")
        .appendField(" Geschwindigkeit")
        .appendField(new Blockly.FieldNumber(0, 0, 50, 1), "motorSpeed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Setze die Parameter eines bestimmten Motors (Richtung, Geschwindigkeit).");
    this.setHelpUrl("");
  }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['servo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set servo")
        //.appendField(new Blockly.FieldDropdown([["S0","0"], ["S1","1"], ["S2","2"], ["S3","3"]]), "servoNumber")
        .appendField(new Blockly.FieldDropdown([["S0","0"]]), "servoNumber")
        .appendField("to position")
        .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "position")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Move the servo motor to a specific position (0 -> bottom, 100 -> top).");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Servomotor");
  }
};

Blockly.Blocks['servoGer'] = {
 init: function() {
   this.appendDummyInput()
       .appendField("Setze Servo-Motor")
       //.appendField(new Blockly.FieldDropdown([["S0","0"], ["S1","1"], ["S2","2"], ["S3","3"]]), "servoNumber")
       .appendField(new Blockly.FieldDropdown([["S0","0"]]), "servoNumber")
       .appendField("auf Position")
       .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "position")
   this.setPreviousStatement(true, null);
   this.setNextStatement(true, null);
   this.setColour(290);
   this.setTooltip("Bewege einen bestimmten Servo-Motor auf eine festgelegte Position (0 -> Unten, 100 -> Oben).");
   this.setHelpUrl("https://en.wikipedia.org/wiki/Servomotor");
 }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['digital_out'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Digital Port")
        .appendField(new Blockly.FieldDropdown([["D0","0"], ["D1","1"], ["D2","2"], ["D3","3"], ["D4","4"], ["D5","5"], ["D6","6"], ["D7","7"]]), "Port")
        .appendField(new Blockly.FieldDropdown([["High","1"], ["Low","0"]]), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setColour(230);
 this.setTooltip("Set a specific port to high (digital 1) or low (digital 0).");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Input/output");
  }
};

Blockly.Blocks['digital_outGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setze einen digital Port")
        .appendField(new Blockly.FieldDropdown([["D0","0"], ["D1","1"], ["D2","2"], ["D3","3"], ["D4","4"], ["D5","5"], ["D6","6"], ["D7","7"]]), "Port")
        .appendField(new Blockly.FieldDropdown([["High","1"], ["Low","0"]]), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
	this.setColour(230);
 this.setTooltip("Setze einen digitalen Port auf 1 oder 0.");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Input/output");
  }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['led'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set")
        .appendField(new Blockly.FieldDropdown([["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"], ["L4","4"], ["L5","5"], ["L6","6"], ["L7","7"], ["L8","8"], ["L9","9"], ["L10","10"]]), "ledNumber")
        .appendField("to brightness")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "brightness")
        .appendField("with color")
        .appendField(new Blockly.FieldDropdown([["Red","1"], ["Green","2"], ["Blue","3"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Turn on a connected LED with a defined brightness and color.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ledGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setze")
        .appendField(new Blockly.FieldDropdown([["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"], ["L4","4"], ["L5","5"], ["L6","6"], ["L7","7"], ["L8","8"], ["L9","9"], ["L10","10"]]), "ledNumber")
        .appendField("auf Helligkeit")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "brightness")
        .appendField("mit der Farbe")
        .appendField(new Blockly.FieldDropdown([["Red","1"], ["Green","2"], ["Blue","3"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Einschalten einer Leuchtdiode mit einer bestimmten Helligkeit und Farbe.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ledReset'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("reset")
        .appendField(new Blockly.FieldDropdown([["all","option_all"], ["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"], ["L4","4"], ["L5","5"], ["L6","6"], ["L7","7"], ["L8","8"], ["L9","9"], ["L10","10"]]), "option")
        .appendField("LED(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Reset specific LED(s) to default values (brightness zero, color red).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ledResetGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setze")
        .appendField(new Blockly.FieldDropdown([["alle","option_all"], ["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"], ["L4","4"], ["L5","5"], ["L6","6"], ["L7","7"], ["L8","8"], ["L9","9"], ["L10","10"]]), "option")
        .appendField("LED(s) zurück");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Zurücksetzen einer oder mehrerer LED(s) auf Standardwerte (Helligkeit null, Farbe Rot).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ledFill'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("fill until ")
        .appendField(new Blockly.FieldDropdown([["L0","0"], ["L1","1"], ["L2","2"], ["L3","3"], ["L4","4"], ["L5","5"], ["L6","6"], ["L7","7"], ["L8","8"], ["L9","9"], ["L10","10"]]), "ledNumber")
        .appendField("to brightness")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "brightness")
        .appendField("with color")
        .appendField(new Blockly.FieldDropdown([["Red","0"], ["Green","1"], ["Blue","2"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(80);
 this.setTooltip("Fill a LED range from L0 to the specified number with a defined brightness and color.");
 this.setHelpUrl("");
  }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['returnToHome'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Return ")
        .appendField(new Blockly.FieldDropdown([["simple","0"]/*, ["fast","1"]*/]), "modus")
        .appendField("to home position"),
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("The robot automatically tries to return to its starting position.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['returnToHomeGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Fahre im")
        .appendField(new Blockly.FieldDropdown([["einfachen","0"]/*, ["schnellen","1"]*/]), "modus")
        .appendField("Modus an die Startposition zurück"),
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("Mithilfe dieser Funktion versucht der Roboter automatisch an seine Startposition zurückzukehren.");
 this.setHelpUrl("");
  }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['analog_logic_compare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port A0","0"], ["Port A1","1"], ["Port A2","2"], ["Port A3","3"], ["Port A4","4"], ["Port A5","5"], ["Port A6","6"], ["Port A7","7"]]), "A")
        .appendField(new Blockly.FieldDropdown([["=","EQ"], ["<","LT"], [">","GT"]]), "OP")
        .appendField(new Blockly.FieldNumber(0, 0, 127, 1), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Check wether an analog input value from a specific port is lower, grather or equal to 0-128.");
 this.setHelpUrl("https://wiki.analytica.com/index.php?title=Comparison_Operators");
  }
};

Blockly.Blocks['analog_logic_compareGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port A0","0"], ["Port A1","1"], ["Port A2","2"], ["Port A3","3"], ["Port A4","4"], ["Port A5","5"], ["Port A6","6"], ["Port A7","7"]]), "A")
        .appendField(new Blockly.FieldDropdown([["=","EQ"], ["<","LT"], [">","GT"]]), "OP")
        .appendField(new Blockly.FieldNumber(0, 0, 127, 1), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Überprüfung, ob ein analoger Wert eines Ports kleiner, größer oder gleich mit dem Wert zwischen 0-128 ist.");
 this.setHelpUrl("https://wiki.analytica.com/index.php?title=Comparison_Operators");
  }
};

Blockly.Blocks['digital_logic_compare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port D0","0"], ["Port D1","1"], ["Port D2","2"], ["Port D3","3"], ["Port D4","4"], ["Port D5","5"], ["Port D6","6"], ["Port D7","7"]]), "A")
        .appendField(new Blockly.FieldTextInput("="), "OP")
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"]]), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Check wether an digital input value from a specific port is equal to 0/1.");
 this.setHelpUrl("https://wiki.analytica.com/index.php?title=Comparison_Operators");
  }
};

Blockly.Blocks['digital_logic_compareGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Port D0","0"], ["Port D1","1"], ["Port D2","2"], ["Port D3","3"], ["Port D4","4"], ["Port D5","5"], ["Port D6","6"], ["Port D7","7"]]), "A")
        .appendField(new Blockly.FieldTextInput("="), "OP")
        .appendField(new Blockly.FieldDropdown([["0","0"], ["1","1"]]), "B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(0);
 this.setTooltip("Überprüfung, ob ein digitaler Wert eines Ports gleich mit 0/1 ist.");
 this.setHelpUrl("https://wiki.analytica.com/index.php?title=Comparison_Operators");
  }
};

/* ------------------------------------------------------------------------------------------ */

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
  this.setTooltip("Do an action if the passed statement (analog/digital compare) is true.");
  this.setHelpUrl("https://en.wikipedia.org/wiki/Conditional_(computer_programming)#If%E2%80%93then(%E2%80%93else)");
   }
 };

Blockly.Blocks['controls_if1Ger'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("Falls");
    this.appendStatementInput("DO0")
        .setCheck(null)
        .appendField("führe aus");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Falls die angegebene Bedingung (Abfrage) eintrifft, führe die nachfolgenden Anweisungen aus.");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Conditional_(computer_programming)#If%E2%80%93then(%E2%80%93else)");
  }
};

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

Blockly.Blocks['controls_whileuntil1Ger'] = {
 init: function() {
   this.appendValueInput("BOOL")
       .setCheck("Boolean")
       .appendField("Wiederhole solange wie");
   this.appendStatementInput("DO")
       .setCheck(null)
       .appendField("");
   this.setPreviousStatement(true, null);
   this.setNextStatement(true, null);
   this.setColour(120);
  this.setTooltip("Bedingte Schliefe, die eine (mehrere) Operation(en) solange ausführt, wie die Bedingung erfüllt ist.");
  this.setHelpUrl("");
 }
};

Blockly.Blocks['controls_repeat_extGer'] = {
  init: function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("Wiederhole");
    this.appendDummyInput()
        .appendField("mal");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
   this.setTooltip("Wiederhole nachfolgende Aktionen eine bestimmte Anzahl an Durchgängen.");
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
    this.setTooltip("Do an action if the passed statement (analog/digital compare) is true. Otherwise the else case will be reached.");
    this.setHelpUrl("https://en.wikipedia.org/wiki/Conditional_(computer_programming)#If%E2%80%93then(%E2%80%93else)");
  }
};

Blockly.Blocks['controls_ifelse1Ger'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("Falls");
    this.appendStatementInput("DO0")
        .setCheck(null)
        .appendField("führe aus");
    this.appendStatementInput("ELSE")
        .setCheck(null)
        .appendField("andernfalls");
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Falls die angegebene Bedingung (Abfrage) eintrifft, führe die nachfolgenden Anweisungen aus. Andernfalls wird der andere Fall ausgeführt.");
 this.setHelpUrl("https://en.wikipedia.org/wiki/Conditional_(computer_programming)#If%E2%80%93then(%E2%80%93else)");
  }
};

/* ------------------------------------------------------------------------------------------ */

Blockly.Blocks['rotation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotate around itself ")
        .appendField(new Blockly.FieldDropdown([["left","0"], ["right","1"]]), "rotation_direction")
        .appendField("by")
        .appendField(new Blockly.FieldNumber(0, -1, Infinity, 0.25), "times")
        .appendField("times");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Rotate around itself left or right by n-times (0.25, 0.5, ... 2, 3, ...).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotationGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Drehung um sich selbst nach")
        .appendField(new Blockly.FieldDropdown([["links","0"], ["rechts","1"]]), "rotation_direction")
        .appendField(new Blockly.FieldNumber(0, -1, Infinity, 0.25), "times")
        .appendField("mal");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Drehung um sich selbst nach rechts oder links n-mal (0.25, 0.5, ... 2, 3, ...)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotate ")
        .appendField(new Blockly.FieldDropdown([["left","0"], ["right","1"]]), "rotate_direction")
        .appendField(new Blockly.FieldNumber(0, 0, 360, 1), "angle")
        .appendField("°");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Rotate around itself left or right by an angle.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotateGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Drehung")
        .appendField(new Blockly.FieldDropdown([["links","0"], ["rechts","1"]]), "rotate_direction")
        .appendField("um ")
        .appendField(new Blockly.FieldNumber(0, 0, 360, 1), "angle")
        .appendField("°");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Drehung um die Achse des Stifthalters nach links oder rechts um einen angegebenen Winkel.");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['circle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Drehung um ")
        .appendField(new Blockly.FieldDropdown([["linkes","0"], ["rechtes","1"]]), "direction")
        .appendField("Rad")
        .appendField(new Blockly.FieldNumber(0, -1, Infinity, 0.25), "circle")
        .appendField("mal");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Rotate around the left or right wheel multiple times (0.25, 0.5, ... 2, 3, ...).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['circleGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Drehung um ")
        .appendField(new Blockly.FieldDropdown([["linkes","0"], ["rechtes","1"]]), "direction")
        .appendField("Rad")
        .appendField(new Blockly.FieldNumber(0, -1, Infinity, 0.25), "circle")
        .appendField("mal");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Drehung um das rechte oder linke, feststehende Rad n-mal (0.25, 0.5, ... 2, 3, ...).");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['distance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("motor")
        .appendField(new Blockly.FieldDropdown([["M0 & M1","0"]]), "motorNumber")
        .appendField("direction")
        .appendField(new Blockly.FieldDropdown([["left","0"], ["right","1"]]), "motorDirection")
        .appendField("drive for ")
        .appendField(new Blockly.FieldNumber(0, 0, 100, 0.5), "length")
        .appendField("cm");
    /*this.appendDummyInput()
        .appendField("motor")
        .appendField(new Blockly.FieldDropdown([["M1","1"]]), "motorNumberM1")
        .appendField("direction")
        .appendField(new Blockly.FieldDropdown([["        ","0"], ["        ","1"]]), "motorDirectionM1")
        .appendField("drive for ")
        .appendField(new Blockly.FieldNumber(0, 0, 100, 0.5), "lengthM1")
        .appendField("cm");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['distanceGer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Motor")
        .appendField(new Blockly.FieldDropdown([["M0 & M1","0"]]), "motorNumber")
        .appendField("fahre")
        .appendField(new Blockly.FieldDropdown([["links","0"], ["rechts","1"]]), "motorDirection")
        .appendField("für ")
        .appendField(new Blockly.FieldNumber(0, 0, 100, 0.5), "length")
        .appendField("cm");
    /*this.appendDummyInput()
        .appendField("Motor")
        .appendField(new Blockly.FieldDropdown([["M1","1"]]), "motorNumberM1")
        .appendField("fahre")
        .appendField(new Blockly.FieldDropdown([["           ","0"], ["        ","1"]]), "motorDirectionM1")
        .appendField("für ")
        .appendField(new Blockly.FieldNumber(0, 0, 100, 0.5), "lengthM1")
        .appendField("cm");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
