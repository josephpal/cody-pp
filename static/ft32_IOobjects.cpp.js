export const ft32_cpp = `/*
 * Ausgangstreiber für ESP32-Fischertechnik-Anbindung
 * Autor: Johannes Marquart
 *
 * modified by: F.J.P
 * date: 2020-04-17
 */

#include "ft_ESP32_IOobjects.h"

int PORT_M_PWM[MOTOR_QTY];    // = {};//Output-Pins Motor-Drehzahl
int LED_PIN = 14;             //Output-Pins Led, werden hier über den selben Treiber angesteuert
int PORT_IN[DAIN_QTY];        //Input-Pins Ditital/Analog
bool ISMAXI = false;

/* ====================================================================================================================== */

/* i2c SDA = PIN 21, SCL = PIN 22 */
SX1509 sx1509Object;

/* led strip, connected to pin LED_PIN */
Adafruit_NeoPixel * led_strip = new Adafruit_NeoPixel(LED_QTY, LED_PIN, NEO_GRB + NEO_KHZ800);

/* ====================================================================================================================== */

CheckMaxiExtension::CheckMaxiExtension() {
  mAddress = SX1509_I2C_ADDRESS;
  mBoard = "";
}

CheckMaxiExtension::CheckMaxiExtension(byte address) {
  mAddress = address;
  mBoard = "";
}

bool CheckMaxiExtension::CheckMaxi() {
	delay(1500);    //etwas warten, damit I2C möglich ist (ansonsten Kommunikationsprobleme)
	if (!sx1509Object.begin(SX1509_I2C_ADDRESS))	//starten des SX1509 mit SX1509-I²C-Adresse, wenn false (Fehler erkannt -> kein SX1509 angeschlossen)
	{
		Serial.println("[io] SX1509-Object could not be initialized.");

		mBoard = "MINI";
		ISMAXI = false;
		Serial.println("[io] mini board activated");
		//Zuweisung Ports
		for (int i = 0; i < MOTOR_QTY; i++)
		{
			PORT_M_PWM[i] = MINI_PORT_M_PWM[i];
		}
		for (int i = 0; i < DAIN_QTY; i++)
		{
			PORT_IN[i] = MINI_PORT_IN[i];
		}
		return false;
	}
	else	//wenn true (SX1509 angeschlossen)
	{
		Serial.println("[io] SX1509-Object initialized.");
		sx1509Object.clock(INTERNAL_CLOCK_2MHZ, 4);	//Einrichten der Frequenz

		Serial.println("[io] maxi board activated");
		mBoard = "MAXI";
		ISMAXI = true;
		//Zuweisung Ports
		for (int i = 0; i < MOTOR_QTY; i++)
		{
			PORT_M_PWM[i] = MAXI_PORT_M_PWM[i];
		}
		for (int i = 0; i < DAIN_QTY; i++)
		{
			PORT_IN[i] = MAXI_PORT_IN[i];
		}
		return true;
	}
}

/* ====================================================================================================================== */

Motor::Motor() {
	//Abschalten des Motortreibers, welcher von diesem Objekt versorgt wird.
	//Evtl. noch undefinierte Pins können so kein falsches Signal an den Motortreiber geben
	pinMode(PIN_M_INH, OUTPUT);
	digitalWrite(PIN_M_INH, LOW);

	mMotorNr = 0;
	mPortNrPWM = 0;
	mPortNrDir = 0;
	mDirectionMode = 1;
	mDrehzahl = 0;
}

Motor::Motor(unsigned int motorNr) {
	//Abschalten des Motortreibers, evtl. noch undefinierte Pins können so kein falsches Signal an den Motortreiber geben
	pinMode(PIN_M_INH, OUTPUT);
	digitalWrite(PIN_M_INH, LOW);

	//Initialisieren des Motorobjektes
  mMotorNr = motorNr;
  mPortNrPWM = 0;
  mPortNrDir = 0;
  mDirectionMode = 2;
  mDrehzahl = 0;

/*
  if (ISMAXI)
  {
    mPortNrDir = SX1509_PORT_M_DIR[mMotorNr];
  }
  else
  {
    mPortNrDir = PORT_M_DIR[mMotorNr];
  }
*/
//  mPortNrPWM = PORT_M_PWM[mMotorNr];
//    //Zuweisen PWM-Generator zu Pin. Generator 0,2,4,6 für Drehzahl
//  ledcAttachPin(mPortNrPWM, mMotorNr*2);  //Pin-Nr für Drehzahl, PWM-Generator Nr
//  ledcSetup(mMotorNr*2, 21700, 8);  //PWM-Generator Nr, 21.7 kHz PWM, 8-bit resolution (0..255)
//  ledcWrite(mMotorNr*2, 0); //frühzeitiges Definieren des PWM-Generators (PWM-Generator Nr., PWM-Wert (0..255))

//    // Zuweisen der Direction
//  if (ISMAXI)
//  {
//    sx1509Object.digitalWrite(mPortNrDir, 1);
//  }
//  else
//  {
//    //Zuweisen PWM-Generator zu Pin. Generator 1,3,5,7 für Richtung
//    ledcAttachPin(mPortNrDir, (mMotorNr*2)+1);  //Pin-Nr für Richtungsangabe, PWM-Generator Nr
//    ledcSetup(mMotorNr*2+1, 21700, 8);
//    ledcWrite(mMotorNr*2+1,255);  //frühzeitiges Definieren des Dir-Pins
//  }
}

void Motor::setMaxi(bool pMaxi) {
	mPortNrPWM = PORT_M_PWM[mMotorNr];
	if (pMaxi)
	{
		//Zuweisen PWM-Generator zu Pin. Generator 0, 1, 2, 3 für Drehzahl
		ledcAttachPin(mPortNrPWM, mMotorNr);  //Pin-Nr für Drehzahl, PWM-Generator Nr
		ledcSetup(mMotorNr, 21700, 8);  //PWM-Generator Nr, 21.7 kHz PWM, 8-bit resolution (0..255)
		ledcWrite(mMotorNr, 0); //frühzeitiges Definieren des PWM-Generators (PWM-Generator Nr., PWM-Wert (0..255))
		mPortNrDir = SX1509_PORT_M_DIR[mMotorNr];
		sx1509Object.digitalWrite(mPortNrDir, 1);
	}
	else
	{
		//Zuweisen PWM-Generator zu Pin. Generator 0,2,4,6 für Drehzahl
		ledcAttachPin(mPortNrPWM, mMotorNr*2);  //Pin-Nr für Drehzahl, PWM-Generator Nr
		ledcSetup(mMotorNr*2, 21700, 8);  //PWM-Generator Nr, 21.7 kHz PWM, 8-bit resolution (0..255)
		ledcWrite(mMotorNr*2, 0); //frühzeitiges Definieren des PWM-Generators (PWM-Generator Nr., PWM-Wert (0..255))
		mPortNrDir = PORT_M_DIR[mMotorNr];
		//Zuweisen PWM-Generator zu Pin. Generator 1,3,5,7 für Richtung
		ledcAttachPin(mPortNrDir, (mMotorNr*2)+1);  //Pin-Nr für Richtungsangabe, PWM-Generator Nr
		ledcSetup((mMotorNr*2)+1, 21700, 8);
		ledcWrite((mMotorNr*2)+1, 255);  //frühzeitiges Definieren des Dir-Pins
	}
}

void Motor::setValues(unsigned char directionMode, unsigned int drehzahl) {
  mDirectionMode = directionMode;
  mDrehzahl = drehzahl;

  digitalWrite(PIN_M_INH, LOW);

  Serial.print("[io] Motor " + (String)mMotorNr);
  Serial.print(" dreht in Richtung " + (String)mDirectionMode);
  Serial.println(" mit Drehzahl " + (String)mDrehzahl);

  //Berechnen der PWM-Werte
  int drehzahl_pwm;
  if (mDrehzahl < 1) {
    drehzahl_pwm = 0;                         //170
  } else if (mDrehzahl >7) {
    drehzahl_pwm = 255;
  } else {
    drehzahl_pwm = 170 + mDrehzahl * 85 / 8;         //170+mDrehzahl*85/8
  }

  //Zuweisen der Richtung an den richtigen Pin entsprechend der Motornr.
  // mDirectionMode == 1 -> right
  if (mDirectionMode == 1) {
    //digitalWrite(mPortNrDir, HIGH);
    if (ISMAXI) {
      sx1509Object.digitalWrite(mPortNrDir, 1);  //Richtungspin wird auf HIGH - Rechtslauf gesetzt
    }

    if(mMotorNr==0 || mMotorNr==2) {
      analogWrite(PORT_M_0[1],0);
      analogWrite(PORT_M_0[0],drehzahl_pwm);
    } else if (mMotorNr==1 || mMotorNr==3) {
      analogWrite(PORT_M_1[1],0);
      analogWrite(PORT_M_1[0],drehzahl_pwm);
    }
  } else if (mDirectionMode == 0) {
    //digitalWrite(mPortNrDir, LOW);
    if (ISMAXI) {
      sx1509Object.digitalWrite(mPortNrDir, 0);  //Richtungspin wird auf LOW - Linkslauf gesetzt
    }

    if (mMotorNr==0 ||mMotorNr==2) {
      analogWrite(PORT_M_0[0],0);
      analogWrite(PORT_M_0[1],drehzahl_pwm);
    } else if (mMotorNr==1 || mMotorNr==3) {
      analogWrite(PORT_M_1[0],0);
      analogWrite(PORT_M_1[1],drehzahl_pwm);
    }
  } else {
    digitalWrite(PIN_M_INH, HIGH);  //Einschalten Motortreiber

    if(mMotorNr==0 || mMotorNr==2) {
      analogWrite(PORT_M_0[1], -1);
      analogWrite(PORT_M_0[0], -1);
    } else if (mMotorNr==1 || mMotorNr==3) {
      analogWrite(PORT_M_1[1], -1);
      analogWrite(PORT_M_1[0], -1);
    }
  }

  digitalWrite(PIN_M_INH, HIGH);  //Einschalten Motortreiber
  //Serial.print("  raw: DirPin: " + (String)mPortNrDir);
  //Serial.print(mPortNrDir);
  //Serial.print(" PWMPin: " + (String)mPortNrPWM);
  //Serial.print(mPortNrPWM);
  //Serial.println(" Val: " + (String)drehzahl_pwm);
  //Serial.println(drehzahl_pwm);
}

void Motor::reRun() {
  if(mDrehzahl > 0)
  {
    setValues(mDirectionMode, mDrehzahl);
  }
}

/* ====================================================================================================================== */

CServoMotor::CServoMotor() {
	mMotorNr = 0;
	mPortNrPWM = 0;
	mMinDuty = 4;
	mMaxDuty = 11;
	mRelDuty = 0;
}

CServoMotor::CServoMotor(unsigned int motorNr, unsigned int dutyCycle) {
  mPortNrPWM = 13;
	//init of servomotor-object
	mMotorNr = motorNr;
	//mPinNrPWM = PIN_M_PWM[motorNr];
	mMinDuty = 11;	//minimal real DutyCycle in %
	mMaxDuty = 4;	//maximal real DutyCycle in %
	mRelDuty = dutyCycle < 100 ? dutyCycle : 100;	//limiting maximum value to 100(%)
	//mLedcChannel = 4;	//channel 4 - servo only used at mini-board -> only channels 0..3 are used by motors
  mLedcChannel=10;
  ledcAttachPin(mPortNrPWM, mLedcChannel);  //Pin-Nr für Drehzahl, PWM-Generator Nr
  ledcSetup(mLedcChannel, 50, 12);  //PWM-Generator Nr, 50 Hz PWM, 12-bit resolution (0..255)

}

void CServoMotor::setMaxi(bool pMaxi) {
	mPortNrPWM = 13;// PORT_M_PWM[mMotorNr];
	if (pMaxi)
	{
		//Servomotoren funktionieren noch nicht am Maxi-Board
	}
	else
	{
		//Zuweisen PWM-Generator zu Pin. Generator 0,2,4,6 für Drehzahl
		ledcAttachPin(mPortNrPWM, mLedcChannel);  //Pin-Nr für Drehzahl, PWM-Generator Nr

		ledcSetup(mLedcChannel, 50, 12);  //PWM-Generator Nr, 50 Hz PWM, 12-bit resolution (0..255)
		ledcWrite(mLedcChannel, (4095 * (100 * mMinDuty + (mMaxDuty - mMinDuty) * mRelDuty)) / 10000);	//early set of pin -> servo moves to given duty-cycle
	}
}

void CServoMotor::setValues(unsigned int dutyCycle) {
	if (!ISMAXI)
	{
		mRelDuty = dutyCycle < 100 ? dutyCycle : 100;	//limiting maximum value to 100(%)
		Serial.print("[io] Servo ");
		Serial.print(mMotorNr);
		Serial.print(" auf Pos ");
		Serial.println(mRelDuty);

    //analogWrite(mPortNrPWM, (4095 * (100 * mMinDuty + (mMaxDuty - mMinDuty) * mRelDuty)) / 10000);
		ledcWrite(mLedcChannel, (4095 * (100 * mMinDuty + (mMaxDuty - mMinDuty) * mRelDuty)) / 10000);	//calculate real duty-cycle for servos: 0%rel = 4%, 100%rel = 11%
	}
}

void CServoMotor::reRun() {
	if (!ISMAXI)
	{
    //analogWrite(mPortNrPWM, (4095 * (100 * mMinDuty + (mMaxDuty - mMinDuty) * mRelDuty)) / 10000);
		ledcWrite(mLedcChannel, (4095 * (100 * mMinDuty + (mMaxDuty - mMinDuty) * mRelDuty)) / 10000);
	}
}

/* ====================================================================================================================== */

void led_init() {
  /* initialize led strip */
  pinMode(LED_PIN,OUTPUT);
  led_strip->begin();
  led_strip->show();
}

void led_clear() {
  /* clear buffer (pixel information) and update through show() */
  led_strip->clear();
  led_strip->show();
}

void led_reset(String &option, array<Led, LED_QTY> &ledArray) {
  if(option == "A") {
    for(int i=0; i < LED_QTY; i++) {
      ledArray.at(i).setValues(0, 0);  //Ausgang zur 0 setzen
    }
    Serial.println("[io] Setze alle LEDs zurueck ...");
  } else {
     ledArray.at(option.toInt()).setValues(0, 0);
     Serial.println("[io] Setze LED" + option + " zurueck ...");
  }
}

void led_update(array<Led, LED_QTY> &ledArray) {
    for(int i=0; i < LED_QTY; i++) {
      ledArray[i].reRun();
    }

    /* update led strip */
    led_strip->show();
}

void led_update(Led ledArray[]) {
    /* update led strip */
    led_strip->clear();

    for(int i=0; i < LED_QTY; i++) {
      ledArray[i].reRun();
    }

    led_strip->show();
}

Led::Led() {
  //Abschalten des Ledntreibers, welcher von diesem Objekt versorgt wird und setzen der default Werte

  mLedNr = 0;
  mColor = 0; // -> RED
  mColorName = "RED";
  mBrightness = 0;

  mColorRGB[0] = 255;
  mColorRGB[1] = 0;
  mColorRGB[2] = 0;
}

Led::Led(unsigned int ledNr) {
  //Initialisieren des Led-objektes
  mLedNr = ledNr;
  mColor = 0; // -> Off
  mColorName = "RED";
  mBrightness = 0;

  mColorRGB[0] = 255;
  mColorRGB[1] = 0;
  mColorRGB[2] = 0;
}

void Led::setMaxi(bool pMaxi) {
  /* TODO */
}

void Led::setValues(int brightness, int ledColor) {
  mColor = ledColor;
  mBrightness = brightness;

  setLedRGBColorByIdentifier(ledColor, brightness);

  //if(mBrightness > 0) {
    Serial.print("[io] led " + (String)mLedNr + " leuchtet mit Helligkeit ");
    Serial.print(mBrightness);
    Serial.println(" und Farbe " + getRGBColorName());
  //}

  led_strip->setPixelColor(mLedNr,mColorRGB[0],mColorRGB[1],mColorRGB[2]);
}

void Led::reRun() {
  if(mBrightness > 0) {
    led_strip->setPixelColor(mLedNr,mColorRGB[0],mColorRGB[1],mColorRGB[2]);
  }
}

void Led::setLedRGBColorByIdentifier(int colorNumber, int brigthness) {

  mColorRGB[0] = 0;
  mColorRGB[1] = 0;
  mColorRGB[2] = 0;

  if(brigthness >= 0 && brigthness < 256) {
    switch(colorNumber) {
      case 0:
        mColorName = "Off";
        mColorRGB[0] = 0;
        mColorRGB[1] = 0;
        mColorRGB[2] = 0;
      break;
      case 1:
        mColorName = "RED";
        mColorRGB[0] = brigthness;
      break;
      case 2:
        mColorName = "GREEN";
        mColorRGB[1] = brigthness;
      break;
      case 3:
        mColorName = "BLUE";
        mColorRGB[2] = brigthness;
      break;
      default:
        mColorName = "RED";
        mColorRGB[0] = 255;
      break;
    }
  } else {
    mColorName = "RED";
    mColorRGB[0] = 255;
  }
}

String Led::getRGBColorName() {
  return mColorName;
}

/* ====================================================================================================================== */

DigitalAnalogIn::DigitalAnalogIn() {
  mInputNummer = 0;
}

DigitalAnalogIn::DigitalAnalogIn(unsigned int inputNummer) {
  mInputNummer = inputNummer;

//  if (ISMAXI)
//  {
//    mInputPortNr = SX1509_PORT_DIO_PWMO[mInputNummer];
//  }
//  else
//  {
//    mInputPortNr = PORT_IN[mInputNummer];
//  }
}

void DigitalAnalogIn::setMaxi(bool pMaxi) {
  if (pMaxi)
  {
    mInputPortNr = SX1509_PORT_DIO_PWMO[mInputNummer];
	currentPinMode = INPUT_PULLUP;
	sx1509Object.pinMode(mInputPortNr, currentPinMode);
  }
  else
  {
    mInputPortNr = PORT_IN[mInputNummer];
	currentPinMode = INPUT_PULLUP;
	pinMode(mInputPortNr, currentPinMode);
  }

}

unsigned int DigitalAnalogIn::getValueDigital() {
  bool eingabe;
  if (ISMAXI)
  {
	  if (INPUT_PULLUP != currentPinMode)
	  {
		  sx1509Object.pinMode(mInputPortNr, INPUT_PULLUP);  //Pin-Modus einrichten: Input mit Pull-Up Widerstand
	  }
      eingabe = !sx1509Object.digitalRead(mInputPortNr);  //Inverse Logik: Schalter gedrückt = 1 (= Port liegt auf Masse)
  }
  else
  {
	  ledcDetachPin(mInputPortNr);	//für den Fall, dass eine PWM auf dem Pin eingerichtet ist, wird diese vor einer Abfrage von dem Pin getrennt
	  if (INPUT_PULLUP != currentPinMode)
	  {
		  pinMode(mInputPortNr, INPUT_PULLUP);  //Pin-Modus einrichten: Input mit Pull-Up Widerstand
	  }
      eingabe = !digitalRead(mInputPortNr);  //Inverse Logik: Schalter gedrückt = 1 (= Port liegt auf Masse)
  }
  return (unsigned int) eingabe;
}

unsigned int DigitalAnalogIn::getValueAnalog() {
  unsigned int eingabe;

  if (ISMAXI)
  {
	  if (INPUT != currentPinMode)
	  {
		  sx1509Object.pinMode(mInputPortNr, INPUT); //Pin-Modus einrichten: Input ohne Pull-Up Widerstand
	  }
      eingabe = sx1509Object.digitalRead(mInputPortNr);
  }
  else
  {
	  if (INPUT != currentPinMode)
	  {
		  pinMode(mInputPortNr, INPUT); //Pin-Modus einrichten: Input ohne Pull-Up Widerstand
	  }
      eingabe = analogRead(mInputPortNr);
  }
  return eingabe;
}

void DigitalAnalogIn::setValueDigital(bool ledLevel) {
  if (ISMAXI)
  {
    sx1509Object.pinMode(mInputPortNr, OUTPUT);  //Pin_Modus einrichten: Output
  }
  else
  {
    pinMode(mInputPortNr, OUTPUT);  //Pin_Modus einrichten: Output
  }

  Serial.print("[io] Setze LED ");
  Serial.print(mInputNummer);
  Serial.print(" auf ");
  if (ledLevel)
  {
      if (ISMAXI)
      {
        sx1509Object.digitalWrite(mInputPortNr, HIGH); //Pin auf HIGH setzen
      }
      else
      {
        digitalWrite(mInputPortNr, HIGH); //Pin auf HIGH setzen
      }
    Serial.println(" HIGH");
  }
  else
  {
      if (ISMAXI)
      {
            sx1509Object.digitalWrite(mInputPortNr, LOW); //Pin auf LOW setzen
      }
      else
      {
            digitalWrite(mInputPortNr, LOW); //Pin auf LOW setzen
      }
    Serial.println(" LOW");
  }
}

/* ====================================================================================================================== */

/***
 *
 *
 * FOLGENDER ABSCHNITT IST NICHT IMPLEMENTIERT IN DER QUEUE
 *
 *
//#ifdef MAXI
//DigitalIO_PWMout::DigitalIO_PWMout()
//{
//#ifdef DEBUG
//  Serial.println("Ctor DIO_PWMO N/A");
//#endif // DEBUG
//
//
//  //Serial.println("DigitalIO_PWMout mit parameterlosem Ctor initialisiert");
//  mIONumber = 0;
//}
//
//DigitalIO_PWMout::DigitalIO_PWMout(byte io, byte inOut)
//{
//#ifdef DEBUG
//  Serial.println("Ctor DIO_PWMO " + io);
//#endif // DEBUG
//
//
//  mIONumber = io;
//  mDirection = inOut;
//
//  mIOPin = SX1509_PORT_DIO_PWMO[io];
//
//  sx1509Object.pinMode(mIOPin, mDirection);
//}
//
//unsigned int DigitalIO_PWMout::getValue()
//{
//  //if input is configured as INPUT (no pull up) return value as is
//  if (mDirection == INPUT) {
//    unsigned int ret = sx1509Object.digitalRead(mIOPin);
//
//    return ret;
//  }
//
//  //if input is configured as INPUT_PULLUP return inverted value
//  if (mDirection != INPUT_PULLUP) {
//    sx1509Object.pinMode(mIOPin, INPUT);
//    delay(20);
//    sx1509Object.digitalWrite(mIOPin, HIGH);
//    mDirection = INPUT_PULLUP;
//    Serial.println("SX1509 IO Output wurde in 'getValue' zu Input (Pullup) geändert, IONumber: " + mIONumber);
//    Serial.println("IOPin: " + mIOPin);
//  }
//  if (sx1509Object.digitalRead(mIOPin) != 0) {
//    return 0;
//  }
//  else {
//    return 1;
//  }
//  return sx1509Object.digitalRead(mIOPin);
//}
//
//
//void DigitalIO_PWMout::setValueDig(bool val)
//{
//  if (mDirection != OUTPUT) {
//    sx1509Object.pinMode(mIOPin, OUTPUT);
//    mDirection = OUTPUT;
//    Serial.println("SX1509 IO Input wurde in 'setValueDig' zu Output geändert, IONumber: " + mIONumber);
//    Serial.println("IOPin: " + mIOPin);
//  }
//
//  if (val)
//    sx1509Object.digitalWrite(mIOPin, HIGH);
//  else
//    sx1509Object.digitalWrite(mIOPin, LOW);
//}
//
//void DigitalIO_PWMout::setPWM(unsigned char pwmVal)
//{
//  if (mDirection != OUTPUT) {
//    sx1509Object.pinMode(mIOPin, OUTPUT);
//    mDirection = OUTPUT;
//    Serial.println("SX1509 IO Input wurde in 'setPWM' zu Output geändert, IONumber: " + mIONumber);
//    Serial.println("IOPin: " + mIOPin);
//  }
//
//  sx1509Object.analogWrite(mIOPin, pwmVal);
//}
//
//#endif
*/`
