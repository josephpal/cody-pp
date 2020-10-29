export const xmlGer = `<xml id="toolbox" style="display: none">
        <category name="Start">
            <block type="startGer">
             <comment pinned="true" h="77" w="222">WER:  NAME
WANN: DATUM
WAS:  BESCHREIBUNG</comment>
            </block>
        </category>

        <category name="Aktionen">
            <label text="Motor Operationen:" web-class="toolboxLabelStyle"></label>
            <block type="motorGer"></block>
            <block type="stop_motorsGer"></block>
            <!--<block type="distanceGer"></block>-->

            <label text="Servo-Motor hoch- oder runterfahren:" web-class="toolboxLabelStyle"></label>
            <block type="servoGer"></block>

            <label text="LED Leiste ein- u. ausschalten:" web-class="toolboxLabelStyle"></label>
            <block type="ledGer"></block>
            <block type="ledResetGer"></block>

            <!--<label text="Spezialfunktionen:" web-class="toolboxLabelStyle"></label>
            <block type="returnToHomeGer"></block>-->

            <!--<block type="digital_outGer"></block>-->
        </category>

        <!--<category name="Bewegungen">
          <label text="Winkeldrehungen:" web-class="toolboxLabelStyle"></label>
          <block type="rotationGer"></block>
          <block type="rotateGer"></block>
          <block type="circleGer"></block>

        </category>-->

        <category name="Zeiten">
            <block type="waitGer"></block>
            <block type="perform_actionGer"></block>
        </category>

        <category name="Schleifen">
            <label text="Zählschleifen:" web-class="toolboxLabelStyle"></label>
            <block type="controls_repeat_extGer">
                <value name="TIMES">
                    <block type="math_number">
                        <field name="NUM">10</field>
                    </block>
                </value>
            </block>
            <label text="Bedingte Schleifen:" web-class="toolboxLabelStyle"></label>
            <block type="controls_whileuntil1Ger"></block>
        </category>

        <category name="Abfragen">
            <block type="controls_if1Ger"></block>
            <block type="controls_ifelse1Ger"></block>
        </category>

        <category name="Eingänge">
            <label text="Variable/Nummer:" web-class="toolboxLabelStyle"></label>
            <block type="math_number"></block>

            <label text="Analoge/Digitale Eingänge:" web-class="toolboxLabelStyle"></label>
            <block type="digital_logic_compareGer"></block>
            <block type="analog_logic_compareGer"></block>
        </category>

        <!--<category name="Debuging">
            <block type="text_print">
                <value name="TEXT">
                    <block type="text">
                        <field name="TEXT">message</field>
                    </block>
                </value>
            </block>
        </category>-->

        <category name="Beispiele">
           <block type="startGer">
            <comment pinned="true" h="77" w="222">WER:  F.J.Pal
WANN: 2019-05-22
WAS:  Hindernissen ausweichen</comment>
              <value name="state">
                   <block type="controls_whileuntil1Ger">
                       <value name="BOOL">
                           <block type="digital_logic_compareGer">
                               <field name="A">2</field>
                               <field name="B">0</field>
                           </block>
                       </value>
                       <statement name="DO">
                           <block type="motorGer">
                               <field name="motorNumber">0</field>
                               <field name="motorDirection">1</field>
                               <field name="motorSpeed">6</field>
                               <next>
                                   <block type="motorGer">
                                       <field name="motorNumber">1</field>
                                       <field name="motorDirection">1</field>
                                       <field name="motorSpeed">6</field>
                                       <next>
                                           <block type="controls_if1Ger">
                                              <value name="IF0">
                                                 <block type="digital_logic_compareGer">
                                                    <field name="A">0</field>
                                                    <field name="B">1</field>
                                                 </block>
                                              </value>
                                              <statement name="DO0">
                                                 <block type="motorGer">
                                                    <field name="motorNumber">0</field>
                                                    <field name="motorDirection">0</field>
                                                    <field name="motorSpeed">4</field>
                                                       <next>
                                                           <block type="motorGer">
                                                               <field name="motorNumber">1</field>
                                                               <field name="motorDirection">0</field>
                                                               <field name="motorSpeed">4</field>
                                                               <next>
                                                                   <block type="waitGer">
                                                                       <field name="seconds">0.5</field>
                                                                       <next>
                                                                           <block type="motorGer">
                                                                               <field name="motorNumber">0</field>
                                                                               <field name="motorDirection">1</field>
                                                                               <field name="motorSpeed">4</field>
                                                                               <next>
                                                                                   <block type="motorGer">
                                                                                       <field name="motorNumber">1</field>
                                                                                       <field name="motorDirection">0</field>
                                                                                       <field name="motorSpeed">4</field>
                                                                                       <next>
                                                                                           <block type="waitGer">
                                                                                               <field name="seconds">0.4</field>
                                                                                           </block>
                                                                                       </next>
                                                                                   </block>
                                                                               </next>
                                                                           </block>
                                                                       </next>
                                                                   </block>
                                                               </next>
                                                           </block>
                                                       </next>
                                                   </block>
                                              </statement>
                                                 <next>
                                                    <block type="controls_if1Ger">
                                                       <value name="IF0">
                                                          <block type="digital_logic_compareGer">
                                                             <field name="A">1</field>
                                                             <field name="B">1</field>
                                                          </block>
                                                       </value>
                                                          <statement name="DO0">
                                                             <block type="motorGer">
                                                               <field name="motorNumber">0</field>
                                                               <field name="motorDirection">0</field>
                                                               <field name="motorSpeed">4</field>
                                                               <next>
                                                                   <block type="motorGer">
                                                                       <field name="motorNumber">1</field>
                                                                       <field name="motorDirection">0</field>
                                                                       <field name="motorSpeed">4</field>
                                                                       <next>
                                                                           <block type="waitGer">
                                                                               <field name="seconds">0.5</field>
                                                                               <next>
                                                                                   <block type="motorGer">
                                                                                       <field name="motorNumber">0</field>
                                                                                       <field name="motorDirection">0</field>
                                                                                       <field name="motorSpeed">4</field>
                                                                                       <next>
                                                                                           <block type="motorGer">
                                                                                               <field name="motorNumber">1</field>
                                                                                               <field name="motorDirection">1</field>
                                                                                               <field name="motorSpeed">4</field>
                                                                                               <next>
                                                                                                   <block type="waitGer">
                                                                                                       <field name="seconds">0.4</field>
                                                                                                       <next></next>
                                                                                                   </block>
                                                                                               </next>
                                                                                           </block>
                                                                                       </next>
                                                                                   </block>
                                                                               </next>
                                                                           </block>
                                                                       </next>
                                                                   </block>
                                                               </next>
                                                             </block>
                                                          </statement>
                                                    </block>
                                                 </next>
                                           </block>
                                       </next>
                                   </block>
                               </next>
                           </block>
                       </statement>
                   </block>
              </value>
           </block>

           <block type="start">
             <comment pinned="true" h="77" w="222">WER:  F.J.Pal
WANN: 2019-05-22
WAS:  Zeichnen einer Blume</comment>
             <statement name="state">
                <block type="servoGer">
                 <next>
                  <block type="waitGer">
                    <field name="seconds">0.5</field>
                    <next>
                   <block type="controls_repeat_extGer">
                     <value name="TIMES">
                       <block type="math_number">
                         <field name="NUM">7</field>
                       </block>
                     </value>
                     <statement name="DO">
                       <block type="motorGer">
                         <field name="motorNumber">0</field>
                         <field name="motorDirection">1</field>
                         <field name="motorSpeed">6</field>
                         <next>
                           <block type="motorGer">
                             <field name="motorNumber">1</field>
                             <field name="motorDirection">1</field>
                             <field name="motorSpeed">6</field>
                             <next>
                               <block type="waitGer">
                                 <field name="seconds">0.6</field>
                                 <next>
                                   <block type="motorGer">
                                     <field name="motorNumber">0</field>
                                     <field name="motorDirection">1</field>
                                     <field name="motorSpeed">6</field>
                                     <next>
                                       <block type="motorGer">
                                         <field name="motorNumber">1</field>
                                         <field name="motorDirection">1</field>
                                         <field name="motorSpeed">0</field>
                                         <next>
                                           <block type="waitGer">
                                             <field name="seconds">1.2</field>
                                           </block>
                                         </next>
                                       </block>
                                     </next>
                                   </block>
                                 </next>
                               </block>
                             </next>
                           </block>
                         </next>
                       </block>
                     </statement>
                     <next>
                       <block type="motorGer">
                         <field name="motorNumber">0</field>
                         <field name="motorDirection">1</field>
                         <field name="motorSpeed">6</field>
                         <next>
                           <block type="motorGer">
                             <field name="motorNumber">1</field>
                             <field name="motorDirection">1</field>
                             <field name="motorSpeed">6</field>
                           </block>
                         </next>
                       </block>
                     </next>
                   </block>
                  </next>
                 </block>
                </next>
              </block>
             </statement>
           </block>
        </category>
    </xml>`;

export const xmlEng = `<xml id="toolbox" style="display: none">
        <category name="Start">
            <block type="start">
             <comment pinned="true" h="77" w="222">Who:  NAME
When: DATE
What: DESCRIPTION</comment>
            </block>
        </category>

        <category name="Actions">
            <label text="motor operations:" web-class="toolboxLabelStyle"></label>
            <block type="motor"></block>
            <block type="stop_motors"></block>
            <!--<block type="distance"></block>-->

            <label text="move a servo up/down:" web-class="toolboxLabelStyle"></label>
            <block type="servo"></block>

            <label text="turn led stripe on/off:" web-class="toolboxLabelStyle"></label>
            <block type="led"></block>
            <block type="ledReset"></block>

            <!--<label text="special functions:" web-class="toolboxLabelStyle"></label>
            <block type="returnToHome"></block>-->

            <!--<block type="digital_out"></block>-->
        </category>

        <!--<category name="Movements">
          <label text="angle operations:" web-class="toolboxLabelStyle"></label>
          <block type="rotation"></block>
          <block type="rotate"></block>
          <block type="circle"></block>
        </category>-->

        <category name="Timing">
            <block type="wait"></block>
            <block type="perform_action"></block>
        </category>

        <category name="Loops">
            <label text="counter loops:" web-class="toolboxLabelStyle"></label>
            <block type="controls_repeat_ext">
                <value name="TIMES">
                    <block type="math_number">
                        <field name="NUM">10</field>
                    </block>
                </value>
            </block>
            <label text="continuous loops:" web-class="toolboxLabelStyle"></label>
            <block type="controls_whileuntil1"></block>
        </category>

        <category name="Decisions">
            <block type="controls_if1"></block>
            <block type="controls_ifelse1"></block>
        </category>

        <category name="Input">
            <label text="variables/numbers:" web-class="toolboxLabelStyle"></label>
            <block type="math_number"></block>

            <label text="analog/digital input:" web-class="toolboxLabelStyle"></label>
            <block type="digital_logic_compare"></block>
            <block type="analog_logic_compare"></block>
        </category>

        <!--<category name="Debuging">
            <block type="text_print">
                <value name="TEXT">
                    <block type="text">
                        <field name="TEXT">message</field>
                    </block>
                </value>
            </block>
        </category>-->

        <category name="Examples">
           <block type="start">
            <comment pinned="true" h="77" w="222">Who:  F.J.Pal
When: 2019-05-22
What: Dodges obstacles</comment>
              <value name="state">
                   <block type="controls_whileuntil1">
                       <value name="BOOL">
                           <block type="digital_logic_compare">
                               <field name="A">2</field>
                               <field name="B">0</field>
                           </block>
                       </value>
                       <statement name="DO">
                           <block type="motor">
                               <field name="motorNumber">0</field>
                               <field name="motorDirection">1</field>
                               <field name="motorSpeed">6</field>
                               <next>
                                   <block type="motor">
                                       <field name="motorNumber">1</field>
                                       <field name="motorDirection">1</field>
                                       <field name="motorSpeed">6</field>
                                       <next>
                                           <block type="controls_if1">
                                              <value name="IF0">
                                                 <block type="digital_logic_compare">
                                                    <field name="A">0</field>
                                                    <field name="B">1</field>
                                                 </block>
                                              </value>
                                              <statement name="DO0">
                                                 <block type="motor">
                                                    <field name="motorNumber">0</field>
                                                    <field name="motorDirection">0</field>
                                                    <field name="motorSpeed">4</field>
                                                       <next>
                                                           <block type="motor">
                                                               <field name="motorNumber">1</field>
                                                               <field name="motorDirection">0</field>
                                                               <field name="motorSpeed">4</field>
                                                               <next>
                                                                   <block type="wait">
                                                                       <field name="seconds">0.5</field>
                                                                       <next>
                                                                           <block type="motor">
                                                                               <field name="motorNumber">0</field>
                                                                               <field name="motorDirection">1</field>
                                                                               <field name="motorSpeed">4</field>
                                                                               <next>
                                                                                   <block type="motor">
                                                                                       <field name="motorNumber">1</field>
                                                                                       <field name="motorDirection">0</field>
                                                                                       <field name="motorSpeed">4</field>
                                                                                       <next>
                                                                                           <block type="wait">
                                                                                               <field name="seconds">0.4</field>
                                                                                           </block>
                                                                                       </next>
                                                                                   </block>
                                                                               </next>
                                                                           </block>
                                                                       </next>
                                                                   </block>
                                                               </next>
                                                           </block>
                                                       </next>
                                                   </block>
                                              </statement>
                                                 <next>
                                                    <block type="controls_if1">
                                                       <value name="IF0">
                                                          <block type="digital_logic_compare">
                                                             <field name="A">1</field>
                                                             <field name="B">1</field>
                                                          </block>
                                                       </value>
                                                          <statement name="DO0">
                                                             <block type="motor">
                                                               <field name="motorNumber">0</field>
                                                               <field name="motorDirection">0</field>
                                                               <field name="motorSpeed">4</field>
                                                               <next>
                                                                   <block type="motor">
                                                                       <field name="motorNumber">1</field>
                                                                       <field name="motorDirection">0</field>
                                                                       <field name="motorSpeed">4</field>
                                                                       <next>
                                                                           <block type="wait">
                                                                               <field name="seconds">0.5</field>
                                                                               <next>
                                                                                   <block type="motor">
                                                                                       <field name="motorNumber">0</field>
                                                                                       <field name="motorDirection">0</field>
                                                                                       <field name="motorSpeed">4</field>
                                                                                       <next>
                                                                                           <block type="motor">
                                                                                               <field name="motorNumber">1</field>
                                                                                               <field name="motorDirection">1</field>
                                                                                               <field name="motorSpeed">4</field>
                                                                                               <next>
                                                                                                   <block type="wait">
                                                                                                       <field name="seconds">0.4</field>
                                                                                                       <next></next>
                                                                                                   </block>
                                                                                               </next>
                                                                                           </block>
                                                                                       </next>
                                                                                   </block>
                                                                               </next>
                                                                           </block>
                                                                       </next>
                                                                   </block>
                                                               </next>
                                                             </block>
                                                          </statement>
                                                    </block>
                                                 </next>
                                           </block>
                                       </next>
                                   </block>
                               </next>
                           </block>
                       </statement>
                   </block>
              </value>
           </block>

           <block type="start">
             <comment pinned="true" h="77" w="222">Who:  F.J.Pal
When: 2019-05-22
What: Draws a flower</comment>
             <statement name="state">
               <block type="servo">
                <next>
                 <block type="wait">
                   <field name="seconds">0.5</field>
                   <next>
                   <block type="controls_repeat_ext">
                     <value name="TIMES">
                       <block type="math_number">
                         <field name="NUM">7</field>
                       </block>
                     </value>
                     <statement name="DO">
                       <block type="motor">
                         <field name="motorNumber">0</field>
                         <field name="motorDirection">1</field>
                         <field name="motorSpeed">6</field>
                         <next>
                           <block type="motor">
                             <field name="motorNumber">1</field>
                             <field name="motorDirection">1</field>
                             <field name="motorSpeed">6</field>
                             <next>
                               <block type="wait">
                                 <field name="seconds">0.6</field>
                                 <next>
                                   <block type="motor">
                                     <field name="motorNumber">0</field>
                                     <field name="motorDirection">1</field>
                                     <field name="motorSpeed">6</field>
                                     <next>
                                       <block type="motor">
                                         <field name="motorNumber">1</field>
                                         <field name="motorDirection">1</field>
                                         <field name="motorSpeed">0</field>
                                         <next>
                                           <block type="wait">
                                             <field name="seconds">1.2</field>
                                           </block>
                                         </next>
                                       </block>
                                     </next>
                                   </block>
                                 </next>
                               </block>
                             </next>
                           </block>
                         </next>
                       </block>
                     </statement>
                     <next>
                       <block type="motor">
                         <field name="motorNumber">0</field>
                         <field name="motorDirection">1</field>
                         <field name="motorSpeed">6</field>
                         <next>
                           <block type="motor">
                             <field name="motorNumber">1</field>
                             <field name="motorDirection">1</field>
                             <field name="motorSpeed">6</field>
                           </block>
                         </next>
                       </block>
                     </next>
                   </block>
                  </next>
                 </block>
                </next>
              </block>
             </statement>
           </block>
        </category>
    </xml>`;
