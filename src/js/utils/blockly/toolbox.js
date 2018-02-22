export const xml = `<xml id="toolbox" style="display: none">
        <category name="Start">
            <block type="start"></block>
        </category>

        <category name="Input">
            <block type="math_number"></block>
            <block type="digital_logic_compare"></block>
            <block type="analog_logic_compare"></block>
        </category>

        <category name="Actuator">
            <block type="motor"></block>
            <block type="lamp"></block>
            <block type="digital_out"></block>
        </category>

        <category name="Loops">
            <block type="controls_repeat_ext">
                <value name="TIMES">
                    <block type="math_number">
                        <field name="NUM">10</field>
                    </block>
                </value>
            </block>
            <block type="controls_whileuntil1"></block>
        </category>

        <category name="Branching">
            <block type="controls_if1"></block>
        </category>

        <category name="Delay">
            <block type="wait"></block>
        </category>

        <category name="Debuging">
            <block type="text_print">
                <value name="TEXT">
                    <block type="text">
                        <field name="TEXT">message</field>
                    </block>
                </value>
            </block>
        </category>

        <category name="Examples">
            <block type="start">
               <value name="state">
                    <block type="controls_whileuntil1">
                        <value name="BOOL">
                            <block type="digital_logic_compare">
                                <field name="A">5</field>
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
										                    <field name="A">3</field>
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
										                            <field name="A">4</field>
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
                <value name="state">
					<block type="motor">
						<field name="motorNumber">1</field>
						<field name="motorSpeed">0</field>
						<field name="motorDirection">0</field>
						<next>
							<block type="motor">
								<field name="motorNumber">2</field>
								<field name="motorSpeed">0</field>
								<field name="motorDirection">0</field>
								<next>
									<block type="controls_repeat_ext">
										<value name="TIMES">
											<block type="math_number">
												<field name="NUM">10</field>
											</block>
										</value>
										<statement name="DO">
											<block type="motor">
												<field name="motorNumber">1</field>
												<field name="motorSpeed">4</field>
												<field name="motorDirection">1</field>
												<next>
													<block type="motor">
														<field name="motorNumber">2</field>
														<field name="motorSpeed">4</field>
														<field name="motorDirection">1</field>
														<next>
															<block type="wait">
																<field name="seconds">1.2</field>
																<next>
																	<block type="motor">
																		<field name="motorNumber">1</field>
																		<field name="motorSpeed">2</field>
																		<field name="motorDirection">1</field>
																		<next>
																			<block type="motor">
																				<field name="motorNumber">2</field>
																				<field name="motorSpeed">2</field>
																				<field name="motorDirection">0</field>
																				<next>
																					<block type="wait">
																						<field name="seconds">0.5</field>
																						<next>
																							<block type="controls_if1">
																								<value name="IF0">
																									<block type="digital_logic_compare">
																									        <field name="A">5</field>

																									        <field name="B">1</field>
																									    <value>
																									</value></block>
																								</value>

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
												</next>
											</block>
										</statement>
									</block>
								</next>
							</block>
						</next>
					</block>
                </value>
            </block>
        </category>
    </xml>`;
