EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Connector:Jack-DC J1
U 1 1 5FB42A1F
P 2050 3950
F 0 "J1" H 2107 4275 50  0000 C CNN
F 1 "Jack-DC" H 2107 4184 50  0000 C CNN
F 2 "Connector_BarrelJack:BarrelJack_Horizontal" H 2100 3910 50  0001 C CNN
F 3 "~" H 2100 3910 50  0001 C CNN
	1    2050 3950
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR01
U 1 1 5FB54F76
P 2350 3850
F 0 "#PWR01" H 2350 3700 50  0001 C CNN
F 1 "+12V" H 2365 4023 50  0000 C CNN
F 2 "" H 2350 3850 50  0001 C CNN
F 3 "" H 2350 3850 50  0001 C CNN
	1    2350 3850
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR02
U 1 1 5FB55157
P 2350 4050
F 0 "#PWR02" H 2350 3800 50  0001 C CNN
F 1 "GND" H 2355 3877 50  0000 C CNN
F 2 "" H 2350 4050 50  0001 C CNN
F 3 "" H 2350 4050 50  0001 C CNN
	1    2350 4050
	1    0    0    -1  
$EndComp
$Comp
L Regulator_Linear:L7805 U2
U 1 1 5FB5574C
P 3050 3850
F 0 "U2" H 3050 4092 50  0000 C CNN
F 1 "LD1117V33" H 3050 4001 50  0000 C CNN
F 2 "Package_TO_SOT_THT:TO-220-3_Vertical" H 3075 3700 50  0001 L CIN
F 3 "http://www.st.com/content/ccc/resource/technical/document/datasheet/41/4f/b3/b0/12/d4/47/88/CD00000444.pdf/files/CD00000444.pdf/jcr:content/translations/en.CD00000444.pdf" H 3050 3800 50  0001 C CNN
	1    3050 3850
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR04
U 1 1 5FB56752
P 2750 3850
F 0 "#PWR04" H 2750 3700 50  0001 C CNN
F 1 "+12V" H 2765 4023 50  0000 C CNN
F 2 "" H 2750 3850 50  0001 C CNN
F 3 "" H 2750 3850 50  0001 C CNN
	1    2750 3850
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR08
U 1 1 5FB56B3F
P 3050 4150
F 0 "#PWR08" H 3050 3900 50  0001 C CNN
F 1 "GND" H 3055 3977 50  0000 C CNN
F 2 "" H 3050 4150 50  0001 C CNN
F 3 "" H 3050 4150 50  0001 C CNN
	1    3050 4150
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR010
U 1 1 5FB57184
P 3350 3850
F 0 "#PWR010" H 3350 3700 50  0001 C CNN
F 1 "+3V3" H 3365 4023 50  0000 C CNN
F 2 "" H 3350 3850 50  0001 C CNN
F 3 "" H 3350 3850 50  0001 C CNN
	1    3350 3850
	1    0    0    -1  
$EndComp
$Comp
L Regulator_Linear:L7805 U1
U 1 1 5FB58312
P 3050 3000
F 0 "U1" H 3050 3242 50  0000 C CNN
F 1 "L7806CV" H 3050 3151 50  0000 C CNN
F 2 "Package_TO_SOT_THT:TO-220-3_Vertical" H 3075 2850 50  0001 L CIN
F 3 "http://www.st.com/content/ccc/resource/technical/document/datasheet/41/4f/b3/b0/12/d4/47/88/CD00000444.pdf/files/CD00000444.pdf/jcr:content/translations/en.CD00000444.pdf" H 3050 2950 50  0001 C CNN
	1    3050 3000
	1    0    0    -1  
$EndComp
$Comp
L power:+12V #PWR03
U 1 1 5FB5964C
P 2750 3000
F 0 "#PWR03" H 2750 2850 50  0001 C CNN
F 1 "+12V" H 2765 3173 50  0000 C CNN
F 2 "" H 2750 3000 50  0001 C CNN
F 3 "" H 2750 3000 50  0001 C CNN
	1    2750 3000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR07
U 1 1 5FB59B45
P 3050 3300
F 0 "#PWR07" H 3050 3050 50  0001 C CNN
F 1 "GND" H 3055 3127 50  0000 C CNN
F 2 "" H 3050 3300 50  0001 C CNN
F 3 "" H 3050 3300 50  0001 C CNN
	1    3050 3300
	1    0    0    -1  
$EndComp
$Comp
L power:+6V #PWR09
U 1 1 5FB5B114
P 3350 3000
F 0 "#PWR09" H 3350 2850 50  0001 C CNN
F 1 "+6V" H 3365 3173 50  0000 C CNN
F 2 "" H 3350 3000 50  0001 C CNN
F 3 "" H 3350 3000 50  0001 C CNN
	1    3350 3000
	1    0    0    -1  
$EndComp
$Comp
L power:+6V #PWR011
U 1 1 5FB646E1
P 3750 4700
F 0 "#PWR011" H 3750 4550 50  0001 C CNN
F 1 "+6V" H 3765 4873 50  0000 C CNN
F 2 "" H 3750 4700 50  0001 C CNN
F 3 "" H 3750 4700 50  0001 C CNN
	1    3750 4700
	1    0    0    -1  
$EndComp
Wire Wire Line
	3750 4700 4100 4700
$Comp
L power:GND #PWR012
U 1 1 5FB652FE
P 3750 4800
F 0 "#PWR012" H 3750 4550 50  0001 C CNN
F 1 "GND" H 3755 4627 50  0000 C CNN
F 2 "" H 3750 4800 50  0001 C CNN
F 3 "" H 3750 4800 50  0001 C CNN
	1    3750 4800
	1    0    0    -1  
$EndComp
Wire Wire Line
	3750 4800 3850 4800
Wire Wire Line
	3850 4800 3850 4600
Wire Wire Line
	3850 4600 4100 4600
$Comp
L power:+3V3 #PWR05
U 1 1 5FB6C227
P 2850 4950
F 0 "#PWR05" H 2850 4800 50  0001 C CNN
F 1 "+3V3" H 2865 5123 50  0000 C CNN
F 2 "" H 2850 4950 50  0001 C CNN
F 3 "" H 2850 4950 50  0001 C CNN
	1    2850 4950
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR06
U 1 1 5FB6DBAC
P 3000 5050
F 0 "#PWR06" H 3000 4800 50  0001 C CNN
F 1 "GND" H 3005 4877 50  0000 C CNN
F 2 "" H 3000 5050 50  0001 C CNN
F 3 "" H 3000 5050 50  0001 C CNN
	1    3000 5050
	1    0    0    -1  
$EndComp
Wire Wire Line
	2850 5050 3000 5050
Text Label 2850 5150 0    50   ~ 0
SCL
$Comp
L Connector:Conn_01x07_Female J2
U 1 1 5FB66EDE
P 2650 5250
F 0 "J2" H 2542 4725 50  0000 C CNN
F 1 "Conn_01x07_Female" H 2542 4816 50  0000 C CNN
F 2 "Connector_PinSocket_2.00mm:PinSocket_1x07_P2.00mm_Vertical" H 2650 5250 50  0001 C CNN
F 3 "~" H 2650 5250 50  0001 C CNN
	1    2650 5250
	-1   0    0    1   
$EndComp
Text Label 5700 3400 0    50   ~ 0
SCL
Text Label 2850 5250 0    50   ~ 0
SDA
Text Label 5700 3500 0    50   ~ 0
SDA
NoConn ~ 2850 5350
NoConn ~ 2850 5450
NoConn ~ 2850 5550
NoConn ~ 4100 3300
NoConn ~ 4100 3400
NoConn ~ 4100 3500
NoConn ~ 4100 3600
NoConn ~ 4100 3700
NoConn ~ 4100 3800
NoConn ~ 4100 3900
NoConn ~ 4100 4000
NoConn ~ 4100 4100
NoConn ~ 4100 4300
NoConn ~ 4100 4400
NoConn ~ 4100 4500
NoConn ~ 5700 4700
NoConn ~ 5700 4500
NoConn ~ 5700 4400
NoConn ~ 5700 4300
NoConn ~ 5700 4200
NoConn ~ 5700 4100
NoConn ~ 5700 4000
NoConn ~ 5700 3800
NoConn ~ 5700 3700
NoConn ~ 5700 3600
$Comp
L ESP8266:NodeMCU1.0(ESP-12E) U3
U 1 1 5FB52459
P 4900 4000
F 0 "U3" H 4900 5087 60  0000 C CNN
F 1 "NodeMCU1.0(ESP-12E)" H 4900 4981 60  0000 C CNN
F 2 "ESP8266:NodeMCU1.0(12-E)" H 4300 3150 60  0001 C CNN
F 3 "" H 4300 3150 60  0000 C CNN
	1    4900 4000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR015
U 1 1 5FB8BA56
P 5900 4600
F 0 "#PWR015" H 5900 4350 50  0001 C CNN
F 1 "GND" H 5905 4427 50  0000 C CNN
F 2 "" H 5900 4600 50  0001 C CNN
F 3 "" H 5900 4600 50  0001 C CNN
	1    5900 4600
	1    0    0    -1  
$EndComp
Wire Wire Line
	5700 4600 5900 4600
$Comp
L power:GND #PWR014
U 1 1 5FB8E596
P 5900 3900
F 0 "#PWR014" H 5900 3650 50  0001 C CNN
F 1 "GND" H 5905 3727 50  0000 C CNN
F 2 "" H 5900 3900 50  0001 C CNN
F 3 "" H 5900 3900 50  0001 C CNN
	1    5900 3900
	1    0    0    -1  
$EndComp
Wire Wire Line
	5700 3900 5900 3900
$Comp
L power:GND #PWR013
U 1 1 5FB8F2B0
P 3800 4200
F 0 "#PWR013" H 3800 3950 50  0001 C CNN
F 1 "GND" H 3805 4027 50  0000 C CNN
F 2 "" H 3800 4200 50  0001 C CNN
F 3 "" H 3800 4200 50  0001 C CNN
	1    3800 4200
	1    0    0    -1  
$EndComp
Wire Wire Line
	3800 4200 4100 4200
NoConn ~ 5700 3300
NoConn ~ 4650 4550
$EndSCHEMATC
