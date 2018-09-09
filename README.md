# WaitingNumbers
#### Author: Nico Friedrich <n.friedrich@fpsvisioanry.com>
#### Version: 0.6

### Erweiterung zur Anzeige der aktuellen und nächsten Ausweisnummern für eine Verbesserung der Wartesituation bei einer Lebensmittelausgabe der Tafeln ###

Diese Erweiterung soll Ihnen helfen in wenigen Schritten die Warte/Schlangensituation vor Ihrer Tafel zu verbessern.
Folgende Vorteile bietet Ihnen die Erweiterung:

* keine Streitigkeiten wer der nächste Kunde ist
* geringere Wartezeiten für die Kunden, da keine Diskussionen mehr
* bessere Planbarkeit für die Kunden
* bessere Planbarkeit für die Mitarbeiter der Tafel
* besseres Image für Ihre Tafel
----

Zukünftige Features für WaitingNumbers:

* Termine mit Vorang (Werden dynamisch vorgezogen)
* Ausfall/Nicht anwesenheits-management

## Entwicklung
### Entwickelt wird die Erweiterung auf 3 Instanzen
* TafelPickup (Tafel-Ausgabe Modul WebApp plain oop JavaScript / PHP bridge to Symfony)
* TafelWebSocket (Python, tornado, live Websocket später evtl. als Windows, Mac und Linux Binary)
* WaitingNumbers (React, Frontend JS)

### Ablaufplan
Einen groben Ablaufplan können Sie im angefügten Dokument einsehen. 
[Attach:waiting_numbers.pdf]

### [UML WaitingNumbers]
Ein Klassendiagramm können Sie in der angefügten Datei einsehen