export const ft32_h = `/*
Ausgangstreiber für ESP32-Fischertechnik-Anbindung
Autor: Johannes Marquart

Editiert von WS18/19


Hinweis: MaxiBoard kann keine Analogdaten lesen
*/
#ifndef FT_ESP32_IOOBJECTS_H
#define FT_ESP32_IOOBJECTS_H

#include <Arduino.h>
#include <SparkFunSX1509.h>
#include <Wire.h>
#include <analogWrite.h>
#include <Adafruit_NeoPixel.h>

/*  */
#include <array>
using namespace std;

//#include <SX1509_IO_Expander/src/SparkFunSX1509.h>

//Festlegen Anzahl Ports
constexpr size_t MOTOR_QTY = 2;	//max. Anzahl der Motoren
constexpr size_t LED_QTY = 11;  //max. Anzahl der Leds
constexpr size_t DAIN_QTY = 8;  //max. Anzahl der Eingänge (digital/analog) (Normal: 8, Wettbewerb: 2)
constexpr size_t SERVO_QTY = 1;	//max. Anzahl der Servomotoren
constexpr size_t DIO_PWMO_QTY = 8;

extern bool ISMAXI;

extern int PORT_M_PWM[MOTOR_QTY];	//Output-Pins Motor-Drehzahl
extern int LED_PIN;	//Output-Pin Led
extern int PORT_IN[DAIN_QTY]; //Input-Pins Ditital/Analog

const int PORT_M_DIR[MOTOR_QTY] = { 16, 20 };//, 16, 2};	//Output-Pins Motor-Richtung     !! NUR 17 und 4 sind Verbunden, Rest ist Dummy
const int PORT_M_ENCODER[MOTOR_QTY] = { 32, 33 }; //, 25, 26};	//InputPins Motor Encoder      MOMENTAN NICHT VERWENDET

const int PORT_M_0[2] = {17,16};         //Motor 0, AIN1=17, AIN2=16
const int PORT_M_1[2] = {2,4};         //Motor 1, AIN1=4, AIN2=2

const int MINI_PORT_M_PWM[MOTOR_QTY] = { 17, 4};//, 17, 4 };  //Output-Pins Motor-Drehzahl     !! NUR 16 und 2 sind Verbunden, Rest ist Dummy
const int MINI_PORT_IN[DAIN_QTY] = { 32, 25, 33, 32, 25, 33, 32, 25 };

const int MAXI_PORT_M_PWM[MOTOR_QTY] = { 4, 2}; //, 13, 15 }; //Output-Pins Motor-Drehzahl { 16, 2, 13, 15 }
const int MAXI_PORT_IN[DAIN_QTY] = { 34, 35, 34, 35, 34, 35, 34, 35 };  //Input-Pins Digital/Analog   NUR 34 und 35 in Hardware     MOMENTAN NICHT VERWENDET

const int PIN_M_INH = 27; //Output-Pin Einschalten Motortreiber
const int PIN_L_INH = 27; //Output-Pin Einschalten Ledntreiber

const byte SX1509_PORT_DIO_PWMO[DIO_PWMO_QTY] = { 8, 9, 10, 11, 12, 13, 14, 15 };
const byte SX1509_PORT_M_DIR[MOTOR_QTY] = { 0, 1};//, 2, 3 }; //Motor Richtung - Output am SX1509

const byte SX1509_I2C_ADDRESS = 0x3E;    //wenn keine ADD-Jumper auf SX1509 aktiviert sind
const byte SX1509_I2C_PIN_SDA = 21;
const byte SX1509_I2C_PIN_SCL = 22;
//const byte SX1509_PIN_RESET = 16;
//const byte SX1509_PIN_EXTI = 17;

extern SX1509 sx1509Object;        //i2c SDA = PIN 21, SCL = PIN 22

//bool initExtension();

class CheckMaxiExtension {

public:
	/** default constructor, stores public SX1509_I2C_ADDRESS in mAddress
	 *
	 *  @param ---
	 *  @return ---
	*/
	CheckMaxiExtension();

	/** constructor, stores given address in mAddress
	 *
	 *  @param address-byte, I2C-Address of SX1509-extension board
	 *  @return ---
	*/
	CheckMaxiExtension(byte);

	/** Checks if extension board is connected, does init, manages ports depending on board-type
	 *
	 *  @param ---
	 *  @return Flag (bool) showing if extension board is connected (true) or not (false)
	*/
	bool CheckMaxi();
private:
	String mBoard;
	byte mAddress;
};

class Motor {

public:
	/** default constructor, resets all values to 0
	 *
	 *  @param ---
	 *  @return ---
	*/
	Motor();	//Standardkonstruktor, setzt alles auf 0;

	/** constructor, sets pins (PWM, direction) according to board-type.
	 *
	 *  @param motorNr 0..3
	 *  @return ---
	*/
	Motor(unsigned int motorNr);	//Konstruktor, Motor-Nr (0..3), weist zu: Pin-Nr für PWM, Pin-Nr für Richtung
	//Destructor is missing -> detach PWM-Generator from pin!

	/** sets new motor-values (mode, speed)
	 *
	 *  @param direction mode (char) eg. 2-brake right-1 left-0
	 *  @param speed (unsigned int) qualitative value -8..0..8 manipulates internal pwm-signal
	 *  @return ---
	*/
	void setValues(unsigned char, unsigned int);	//neue Motorwerte setzen (Richtung, Drehzahl)

	/** sets pins and pwm value with attributes
	 *
	 *  @param ---
	 *  @return ---
	*/
	void reRun();	//bei Aufruf werden erneut die Pins und PWM mit den Attributen gesetzt
	//evtl. eine Methode Stop einbauen

	/** attaches pins to pwm-generators according to maxi- or mini-board
	 *
	 *  @param pMaxi (bool) manipulates attachment of direction pins
	 *  @return ---
	*/
	void setMaxi(bool pMaxi);
private:
	unsigned int mMotorNr;	//Motornummer 0..3, wird bei Erstellung des Objekts angelegt
	unsigned int mPortNrPWM;	//Portnummer für PWM, wird bei Erstellung des Objekts zugewiesen
	unsigned int mPortNrDir;	//PortNr für Richtung, wird bei Erstellung des Objekts zugewiesen
	unsigned char mDirectionMode;	//Drehrichtung: rechts = 1, links = 0, bremsen=2
	unsigned int mDrehzahl;	//aktuelle Geschwindigkeit (von 0 bis 8)
	//unsigned int mLedcChannel;	//PWM-Kanal (0..15(max))

};

class CServoMotor {

public:
	CServoMotor();	//default constructor, puts servomotor into neutral position
	CServoMotor(unsigned int motorNr, unsigned int dutyCycle = 50);	//contsructor, motor-Nr(0..3) - gives pin-nr for PWM, allows init of position - default is neutral, no pin override here
	//Destructor is missing -> detach PWM-Generator from pin!

	void setValues(unsigned int dutyCycle);	//new values to be set (servo-position between 0%..100%)
	void reRun();	//pins will be set with stored values

	void setMaxi(bool pMaxi);
private:
	unsigned int mMotorNr;	//motor-nr 0..3, will be set in constructor
	unsigned int mPortNrPWM;	//pin-nr for PWM, will be set in constructor
	unsigned int mMinDuty, mMaxDuty;	//minimum and maximum duty-cycle of servo (normally 4%..11%)
	unsigned int mRelDuty;	//current relative duty-cycle of servo (0%..100% between duty-boarders)
	unsigned int mLedcChannel;	//Servos get channels 4,5,6 (only for Mini-board)
};

class Led {

public:
	Led();
	Led(unsigned int ledNr);	//Konstruktor, Led-Nr (0..LAMP_QTY-1)
	void setValues(int brightness, int ledColor);	// set LED values: brightness(0-255), color as value (0:off, 1: red, 2:green; 3:blue ...)
	void reRun();	//bei Aufruf werden erneut die Pins gesetzt
	void setMaxi(bool pMaxi);
  void setLedRGBColorByIdentifier(int colorNumber, int brigthness);
  String getRGBColorName();

private:
	unsigned int mLedNr;	//LednNr 0..7, wird bei Erstellung des Objekts angelegt
  int mBrightness; // brightness between 0 ... 255
  int mColor; // siehe (0: red, 1:green; 2:blue ...)
  int mColorRGB[3];
  String mColorName;
};

void led_init();

void led_clear();

void led_reset(String &option, array<Led, LED_QTY> &ledArray);

void led_update(array<Led, LED_QTY> &ledArray);

void led_update(Led ledArray[]);

class Encoder {

public:

private:

};

class DigitalAnalogIn {

public:
	DigitalAnalogIn();
	DigitalAnalogIn(unsigned int);
	unsigned int getValueAnalog();
	unsigned int getValueDigital();
	void setValueDigital(bool);	//Digitalen Ausgang setzen (HIGH/LOW)
	void setMaxi(bool pMaxi);
private:
	unsigned int mInputNummer;
	unsigned int mInputPortNr;
	unsigned char currentPinMode;
};

/* // Wird Momentan nicht genutzt:
// Klasse um zusaetzliche IOs vom SX1509 zu nutzen
// Stattdessen erfolgt eine Abänderung der Klasse "DigitalAnalogIn", die sie mit dem SX1509 kompatibel macht.

class DigitalIO_PWMout
{
public:
  DigitalIO_PWMout(); //Parameteterloser Ctor, kann nicht genutzt werden um funktionerende Instanz zu erstellen
  DigitalIO_PWMout(byte io, byte inOut); //io von 0-7, inOut-Constants von ARDUINO nutzen - als INPUT sollte INPUT_PULLUP verwendet werden (außer eine ander 3V3-Quelle wird verwendet)
  unsigned int getValue(); //liest Digitalen Input, gibt bei INPUT_PULLUP invertierten Wert zurück --> Pin durch Schalter an Masse --> Rückgabe: HIGH (setzt Pin zu erst auf direction = INPUT_PULLUP, falls dieser nicht schon INPUT_PULLUP ist)
  void setValueDig(bool val);         //setzt digitalen Output (setzt Pin zu erst auf direction = OUTPUT, falls dieser nicht schon OUTPUT ist)
  void setPWM(unsigned char pwmVal);      //setzt Pin auf PWM (Frequenz fest für A4990 eingestellt - in init zu sehen)
private:
  byte mIOPin;      //Pin am SX1509
  byte mIONumber;     //Nummer des IOs (0-7)
  byte mDirection;    //input oder output
};*/

#endif`
