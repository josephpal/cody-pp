import Blockly from "blockly"

export default (generator) => {
  generator.addReservedWords(
    'assert,break,case,catch,class,const,continue,default,do,else,enum,' +
    'extends,false,final,finally,for,if,in,is,new,null,rethrow,return,super,' +
    'switch,this,throw,true,try,var,void,while,with,' +
    'print,identityHashCode,identical,BidirectionalIterator,Comparable,' +
    'double,Function,int,Invocation,Iterable,Iterator,List,Map,Match,num,' +
    'Pattern,RegExp,Set,StackTrace,String,StringSink,Type,bool,DateTime,' +
    'Deprecated,Duration,Expando,Null,Object,RuneIterator,Runes,Stopwatch,' +
    'StringBuffer,Symbol,Uri,Comparator,AbstractClassInstantiationError,' +
    'ArgumentError,AssertionError,CastError,ConcurrentModificationError,' +
    'CyclicInitializationError,Error,Exception,FallThroughError,' +
    'FormatException,IntegerDivisionByZeroException,NoSuchMethodError,' +
    'NullThrownError,OutOfMemoryError,RangeError,StackOverflowError,' +
    'StateError,TypeError,UnimplementedError,UnsupportedError'
  );

  generator.ORDER_ATOMIC = 0;         // 0 "" ...
  generator.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] . ?.
  generator.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
  generator.ORDER_MULTIPLICATIVE = 3; // * / % ~/
  generator.ORDER_ADDITIVE = 4;       // + -
  generator.ORDER_SHIFT = 5;          // << >>
  generator.ORDER_BITWISE_AND = 6;    // &
  generator.ORDER_BITWISE_XOR = 7;    // ^
  generator.ORDER_BITWISE_OR = 8;     // |
  generator.ORDER_RELATIONAL = 9;     // >= > <= < as is is!
  generator.ORDER_EQUALITY = 10;      // == !=
  generator.ORDER_LOGICAL_AND = 11;   // &&
  generator.ORDER_LOGICAL_OR = 12;    // ||
  generator.ORDER_IF_NULL = 13;       // ??
  generator.ORDER_CONDITIONAL = 14;   // expr ? expr : expr
  generator.ORDER_CASCADE = 15;       // ..
  generator.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
  generator.ORDER_NONE = 99;          // (...)

  generator.init = function (workspace) {
    generator.definitions_ = Object.create(null);
    generator.functionNames_ = Object.create(null);

    if (!generator.variableDB_) {
      generator.variableDB_ =
        new Blockly.Names(generator.RESERVED_WORDS_);
    } else {
      generator.variableDB_.reset();
    }

    var defvars = [];
    var variables = workspace.getAllVariables();
    if (variables.length) {
      for (var i = 0; i < variables.length; i++) {
        defvars[i] = generator.variableDB_.getName(variables[i].name,
          Blockly.Variables.NAME_TYPE);
      }
      generator.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
    }
  };

  /**
  * Initialise the database of variable names.
  * @param {!Blockly.Workspace} workspace Workspace to generate code from.
  */
  generator.init = function (workspace) {
    // Create a dictionary of definitions to be printed before the code.
    generator.definitions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions).
    generator.functionNames_ = Object.create(null);

    if (!generator.variableDB_) {
      generator.variableDB_ =
        new Blockly.Names(generator.RESERVED_WORDS_);
    } else {
      generator.variableDB_.reset();
    }

    var defvars = [];
    var variables = workspace.getAllVariables();
    if (variables.length) {
      for (var i = 0; i < variables.length; i++) {
        defvars[i] = generator.variableDB_.getName(variables[i].name,
          Blockly.Variables.NAME_TYPE);
      }
      generator.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
    }
  };

  /**
  * Prepend the generated code with the variable definitions.
  * @param {string} code Generated code.
  * @return {string} Completed code.
  */
  generator.finish = function (code) {
    // Indent every line.
    /*if (code) {
      code = generator.prefixLines(code, generator.INDENT);
    }
    code = "#include <Engine.h>\n" + "#include <Lamp.h>\n" + "#include " + "<" + "time.h" + ">" + "\n\n" + "int main() {\n" + code + "    " + "return 0; \n}";
    */
    // Convert the definitions dictionary into a list.
    var imports = [];
    var definitions = [];
    for (var name in generator.definitions_) {
      var def = generator.definitions_[name];
      if (def.match(/^import\s/)) {
        imports.push(def);
      } else {
        definitions.push(def);
      }
    }
    // Clean up temporary data.
    delete generator.definitions_;
    delete generator.functionNames_;
    generator.variableDB_.reset();
    var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
    return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
  };

  /**
  * Naked values are top-level blocks with outputs that aren't plugged into
  * anything.  A trailing semicolon is needed to make this legal.
  * @param {string} line Line of generated code.
  * @return {string} Legal line of code.
  */
  generator.scrubNakedValue = function (line) {
    return line + ';\n';
  };

  /**
  * Encode a string as a properly escaped ArduinoCpp string, complete with quotes.
  * @param {string} string Text to encode.
  * @return {string} ArduinoCpp string.
  * @private
  */
  generator.quote_ = function (string) {
    // Can't use //goog.string.quote since $ must also be escaped.
    string = string.replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\\n')
      .replace(/\$/g, '\\$')
      .replace(/'/g, '\\\'');
    return '\'' + string + '\'';
  };

  /**
  * Common tasks for generating ArduinoCpp from blocks.
  * Handles comments for the specified block and any connected value blocks.
  * Calls any statements following this block.
  * @param {!Blockly.Block} block The current block.
  * @param {string} code The ArduinoCpp code created for this block.
  * @return {string} ArduinoCpp code with comments and subsequent blocks added.
  * @private
  */
  generator.scrub_ = function (block, code) {
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      var comment = block.getCommentText();
      if (comment) {
        comment = Blockly.utils.string.wrap(comment, generator.COMMENT_WRAP - 3);
        if (block.getProcedureDef) {
          // Use documentation comment for function comments.
          commentCode += generator.prefixLines(comment + '\n', '/// ');
        } else {
          commentCode += generator.prefixLines(comment + '\n', '// ');
        }
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (var i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type == Blockly.INPUT_VALUE) {
          var childBlock = block.inputList[i].connection.targetBlock();
          if (childBlock) {
            var comment = generator.allNestedComments(childBlock);
            if (comment) {
              commentCode += generator.prefixLines(comment, '// ');
            }
          }
        }
      }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = generator.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  /**
  * Gets a property and adjusts the value while taking into account indexing.
  * @param {!Blockly.Block} block The block.
  * @param {string} atId The property ID of the element to get.
  * @param {number=} opt_delta Value to add.
  * @param {boolean=} opt_negate Whether to negate the value.
  * @param {number=} opt_order The highest order acting on this value.
  * @return {string|number}
  */
  generator.getAdjusted = function (block, atId, opt_delta, opt_negate,
    opt_order) {
    var delta = opt_delta || 0;
    var order = opt_order || generator.ORDER_NONE;
    if (block.workspace.options.oneBasedIndex) {
      delta--;
    }
    var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
    if (delta) {
      var at = generator.valueToCode(block, atId,
        generator.ORDER_ADDITIVE) || defaultAtIndex;
    } else if (opt_negate) {
      var at = generator.valueToCode(block, atId,
        generator.ORDER_UNARY_PREFIX) || defaultAtIndex;
    } else {
      var at = generator.valueToCode(block, atId, order) ||
        defaultAtIndex;
    }

    if (Blockly.isNumber(at)) {
      // If the index is a naked number, adjust it right now.
      at = parseInt(at, 10) + delta;
      if (opt_negate) {
        at = -at;
      }
    } else {
      // If the index is dynamic, adjust it in code.
      if (delta > 0) {
        at = at + ' + ' + delta;
        var innerOrder = generator.ORDER_ADDITIVE;
      } else if (delta < 0) {
        at = at + ' - ' + -delta;
        var innerOrder = generator.ORDER_ADDITIVE;
      }
      if (opt_negate) {
        if (delta) {
          at = '-(' + at + ')';
        } else {
          at = '-' + at;
        }
        var innerOrder = generator.ORDER_UNARY_PREFIX;
      }
      innerOrder = Math.floor(innerOrder);
      order = Math.floor(order);
      if (innerOrder && order >= innerOrder) {
        at = '(' + at + ')';
      }
    }
    return at;
  };
}
