import Blockly from "blockly"
import initBlocks from "./blocks"
import initLogic from "./logic"
import initLoops from "./loops"
import initMath from "./math"
import initSyntax from "./syntax"

const generator = new Blockly.Generator("arduinocpp")

initSyntax(generator);
initLoops(generator);
initBlocks(generator);
initLogic(generator);
initMath(generator);

export default generator
