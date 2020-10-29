export const readme = `/*
 *  date: 2020-05-06
 *  contributor: F.J. Pal
 *
 *  description: Readme file to setup your Arduino IDE and how run the project created in Cody++.
 *               For opening the project on the Cody++ webpage IDE, you only have to use the *.xml file.
*/

# Open the saved project in Cody++ again
  Unzip the whole *.zip file to a directory.
  On the Cody++ webpage, hit the load button (arrow up symbol) and selected the *.xml file.

# The following arduino plugins have to be installed:

  - ESP32 core (https://github.com/espressif/arduino-esp32)
  - Adafruit SSD1306 (latest version, tested with 1.2.9)
  - Adafruit-GFX-Library (latest version, tested with 1.3.4)
  - SparkFun SX1509 (latest version, tested with 2.0.1)

  Follow the instructions on
  -> https://github.com/hama1067/ft32/tree/master#installation

  for installing the libraries and
  -> https://github.com/josephpal/cody-pp/tree/master#quick-start

  for installing the ESP32 core for arduino.

# Open project in Arduino IDE

  Unzip all files and launch your IDE. After that, open the project file arduino_sketch.ino in the subfolder
  arduino_sketch/. Make sure, the compile settings are set as follows:
  -> https://github.com/josephpal/cody-pp/blob/master/arduino-flash.png`
