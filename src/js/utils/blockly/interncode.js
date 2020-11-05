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
 * @fileoverview Helper functions for generating interncode for blocks.
 * @author rodrigoq@google.com (Rodrigo Queiro)
 * Based on Ellen Spertus's blocky-interncode project.
 */
'use strict';

//goog.provide('Blockly.interncode');

//goog.require('Blockly.Generator');


/**
 * interncode code generator.
 * @type {!Blockly.Generator}
 */
Blockly.interncode = new Blockly.Generator('interncode');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.interncode.addReservedWords(
    // Special character
    '_,' +
    // From theoriginalbit's script:
    // https://github.com/espertus/blockly-interncode/issues/6
    '__inext,assert,bit,colors,colours,coroutine,disk,dofile,error,fs,' +
    'fetfenv,getmetatable,gps,help,io,ipairs,keys,loadfile,loadstring,math,' +
    'native,next,os,paintutils,pairs,parallel,pcall,peripheral,print,' +
    'printError,rawequal,rawget,rawset,read,rednet,redstone,rs,select,' +
    'setfenv,setmetatable,sleep,string,table,term,textutils,tonumber,' +
    'tostring,turtle,type,unpack,vector,write,xpcall,_VERSION,__indext,' +
    // Not included in the script, probably because it wasn't enabled:
    'HTTP,' +
    // Keywords (http://www.interncode.org/pil/1.3.html).
    'and,break,do,else,elseif,end,false,for,function,if,in,local,nil,not,or,' +
    'repeat,return,then,true,until,while,' +
    // Metamethods (http://www.interncode.org/manual/5.2/manual.html).
    'add,sub,mul,div,mod,pow,unm,concat,len,eq,lt,le,index,newindex,call,' +
    // Basic functions (http://www.interncode.org/manual/5.2/manual.html, section 6.1).
    'assert,collectgarbage,dofile,error,_G,getmetatable,inpairs,load,' +
    'loadfile,next,pairs,pcall,print,rawequal,rawget,rawlen,rawset,select,' +
    'setmetatable,tonumber,tostring,type,_VERSION,xpcall,' +
    // Modules (http://www.interncode.org/manual/5.2/manual.html, section 6.3).
    'require,package,string,table,math,bit32,io,file,os,debug'
);

/**
 * Order of operation ENUMs.
 * http://www.interncode.org/manual/5.3/manual.html#3.4.8
 */
Blockly.interncode.ORDER_ATOMIC = 0;          // literals
// The next level was not explicit in documentation and inferred by Ellen.
Blockly.interncode.ORDER_HIGH = 1;            // Function calls, tables[]
Blockly.interncode.ORDER_EXPONENTIATION = 2;  // ^
Blockly.interncode.ORDER_UNARY = 3;           // not # - ~
Blockly.interncode.ORDER_MULTIPLICATIVE = 4;  // * / %
Blockly.interncode.ORDER_ADDITIVE = 5;        // + -
Blockly.interncode.ORDER_CONCATENATION = 6;   // ..
Blockly.interncode.ORDER_RELATIONAL = 7;      // < > <=  >= ~= ==
Blockly.interncode.ORDER_AND = 8;             // and
Blockly.interncode.ORDER_OR = 9;              // or
Blockly.interncode.ORDER_NONE = 99;

/**
 * Note: interncode is not supporting zero-indexing since the language itself is
 * one-indexed, so the generator does not repoct the oneBasedIndex configuration
 * option used for lists and text.
 */

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.interncode.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.interncode.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.interncode.functionNames_ = Object.create(null);

  if (!Blockly.interncode.variableDB_) {
    Blockly.interncode.variableDB_ =
        new Blockly.Names(Blockly.interncode.RESERVED_WORDS_);
  } else {
    Blockly.interncode.variableDB_.reset();
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.interncode.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.interncode.definitions_) {
    definitions.push(Blockly.interncode.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.interncode.definitions_;
  delete Blockly.interncode.functionNames_;
  Blockly.interncode.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. In interncode, an expression is not a legal statement, so we must assign
 * the value to the (conventionally ignored) _.
 * http://interncode-users.org/wiki/ExpressionsAsStatements
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.interncode.scrubNakedValue = function(line) {
  return 'local _ = ' + line + '\n';
};

/**
 * Encode a string as a properly escaped interncode string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} interncode string.
 * @private
 */
Blockly.interncode.quote_ = function(string) {
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating interncode from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The interncode code created for this block.
 * @return {string} interncode code with comments and subsequent blocks added.
 * @private
 */
Blockly.interncode.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.interncode.COMMENT_WRAP - 3);
    if (comment) {
      commentCode += Blockly.interncode.prefixLines(comment, '-- ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.interncode.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.interncode.prefixLines(comment, '-- ');
          }
        }
      }
    }
  }
  commentCode = '';
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.interncode.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
