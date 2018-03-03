/*
Ausgangstreiber für ESP32-Fischertechnik-Anbindung
Autor: Johannes Marquart
*/
#ifndef FT_ESP32_IOOBJECTS_H
#define FT_ESP32_IOOBJECTS_H

#include <Arduino.h>

//Festlegen Anzahl Ports
constexpr size_t MOTOR_QTY = 4;	//Anzahl der Motoren
constexpr size_t LAMP_QTY = 4;	//Anzahl der Lampen
constexpr size_t DAIN_QTY = 7;	//Anzahl der Eingänge (digital/analog)

//Zuweisung Ports
const int PORT_M_DIR[MOTOR_QTY] = { 17, 4, 14, 12 };	//Output-Pins Motor-Richtung
const int PORT_M_PWM[MOTOR_QTY] = { 16, 2, 13, 15 };	//Output-Pins Motor-Drehzahl
const int PIN_M_INH = 27;	//Output-Pin Einschalten Motortreiber

const int PORT_L_PWM[LAMP_QTY] = { 16, 2, 13, 15 };	//Output-Pins Lampe, werden hier über den selben Treiber angesteuert
const int PIN_L_INH = 27;	//Output-Pin Einschalten Lampentreiber

const int PORT_IN[DAIN_QTY] = { 39, 34, 35, 32, 33, 25, 26 };	//Input-Pins Ditital/Analog


class Motor
{
public:
	Motor();	//Standardkonstruktor, setzt alles auf 0;
	Motor(unsigned int motorNr);	//Konstruktor, Motor-Nr (0..3), weist zu: Pin-Nr für PWM, Pin-Nr für Richtung
	void setValues(bool, unsigned int);	//neue Motorwerte setzen (Richtung, Drehzahl)
	void reRun();	//bei Aufruf werden erneut die Pins und PWM mit den Attributen gesetzt
	//evtl. eine Methode Stop einbauen
private:
	unsigned int mMotorNr;	//Motornummer 0..3, wird bei Erstellung des Objekts angelegt
	unsigned int mPortNrPWM;	//Portnummer für PWM, wird bei Erstellung des Objekts zugewiesen
	unsigned int mPortNrDir;	//PortNr für Richtung, wird bei Erstellung des Objekts zugewiesen
	bool mRechtslauf;	//Drehrichtung: rechts = ture, links = false
	unsigned int mDrehzahl;	//aktuelle Geschwindigkeit (von 0 bis 8)

};

class Lampe
{
public:
	Lampe();
	Lampe(unsigned int);	//Konstruktor, Lampe-Nr (0..7), weist zu: Pin-Nr für PWM
	void setValues(unsigned int);	//neue Lampenwerte setzen (Aktiv, Helligkeit)
	void reRun();	//bei Aufruf werden erneut die Pins und PWM mit den Attributen gesetzt
private:
	unsigned int mLampeNr;	//LampenNr 0..7, wird bei Erstellung des Objekts angelegt
	unsigned int mPortNrPWM;	//Portnummer für PWM, wird bei Erstellung des Objekts zugewiesen
	unsigned int mHelligkeit;	//aktuelle Helligkeit (von 0 bis 8)
};

class Encoder
{
public:

private:

};

class DigitalAnalogIn
{
public:
	DigitalAnalogIn();
	DigitalAnalogIn(unsigned int);
	unsigned int getValueAnalog();
	unsigned int getValueDigital();
private:
	unsigned int mInputNummer;
	unsigned int mInputPortNr;
};

#endif