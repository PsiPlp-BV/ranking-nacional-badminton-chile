# -*- coding: utf-8 -*-
"""
Fecha 3 — Torneo Nacional Juvenil y Adulto 3ª Fecha Clausura, Santiago 2026
(28 oct - 1 nov 2026, Centro de Entrenamiento Olímpico, Ñuñoa).

https://www.tournamentsoftware.com/tournament/d719b846-761e-4340-8cd0-5addb561e2e7

Resultados reales de los 19 cuadros (GD U17 no alcanzó cuadro), leídos el
1 nov 2026 de Tournamentsoftware: en eliminación, la ronda en que cada uno
perdió según el propio cuadro (Final, Semi final, Quarter final, rondas
previas = participación); en Round Robin, la tabla de posiciones oficial.
Los nombres van tal como salen en los cuadros; add_event los pasa por ALIAS.
88 deportistas inscritos (fecha3_inscritos.json).

Walkovers y retiros — criterio aplicado (no hay precedente en F1/F2):
- Quien no jugó NINGÚN partido (todo por walkover) no suma puntos, aunque el
  cuadro o la tabla lo ubiquen: Josefina Reyes (WS, GS U17), Vania Diaz &
  Josefina Reyes (WD), Angel Lorca & Josefina Reyes (XD, XD U19), Lucas
  Quichel (BS U15), Consuelo Moscoso (GS U17), Josefina Reyes & Francisca
  Riquelme (GD U19).
- Quien jugó y después se retiró de un Round Robin suma participación (la
  tabla oficial anula sus partidos): Juan Bolivar & Consuelo Moscoso (XD U17,
  2 jugados), Lucas Quichel & Sebastian Sanhueza (BD U17, 1 jugado).
"""
import json
from pathlib import Path

from build_data import make_event

# En esta fecha Tournamentsoftware escribe a muchos deportistas con el nombre
# completo ("Bruno Mora Moreno") y a otros más corto que antes ("Felipe Saez").
# El ranking conserva el nombre con que entró al circuito: de él sale la
# dirección del perfil (#/jugador/bruno-mora), que ya está impresa en los QR
# de las credenciales. Nombre en Tournamentsoftware -> nombre en el ranking.
ALIAS = {
    "Simon Alvarez": "Simón Álvarez",
    "Javier Arentsen Bonilla": "Javier Aretsen",
    "Matías Astudillo Pailahueque": "Matias Astudillo",
    "Antonia Cardona Santa": "Antonia Cardona",
    "Jeronimo Cardona Santa": "Jeronimo Cardona",
    "Siul Del Piero Carrasco": "Siul Carrasco",
    "Daniel Cortez Henríquez": "Daniel Cortez",
    "Juan-Jose Cos Cortes": "Juan-José Cos Cortés",
    "Juan Guillermo Del Pino Lizana": "Juan Guillermo Del Pino",
    "Martín Dodman Vivar": "Martin Dodman",
    "Sarai Espinoza": "Sarai Espinoza Manquecura",
    "Emilia Gonzalez Valenzuela": "Emilia Gonzalez",
    "Benjamin Higuera Burgos": "Benjamin Higuera",
    "Haofeng Luo Wu": "Haofeng Luo Wo",
    "Camila Macaya Salinas": "Camila Macaya",
    "Cristobal Mena Lorca": "Cristobal Mena",
    "Nicolas Monne Canales": "Nicolas Monne",
    "Bruno Mora Moreno": "Bruno Mora",
    "Consuelo Moscoso Córdova": "Consuelo Moscoso Cordova",
    "Beatriz Palma Sandoval": "Beatriz Palma",
    "Emilia Palma Sandoval": "Emilia Palma",
    "Gaspar Ponce Barra": "Gaspar Ponce",
    "Yeiden Ramírez Reinoso": "Yeiden Ramirez Reinoso",
    "Vicente Rivera Molina": "Vicente Rivera",
    "Felipe Saez": "Felipe Saez Zurita",
    "Josefa Torres Godoy": "Josefa Torres",
    "Elise Vadot": "Vadot Elise",
    "Hernán Vera Vergara": "Hernan Vera",
}

# La Federación los inscribió como independientes (planilla de inscripción de
# la 3ª Fecha), aunque Tournamentsoftware les pone C.B. Pirque y C. Agua Clara
# de Magallanes, clubes que no forman parte del circuito.
INDEPENDIENTES = {"Ramses Cassis Durango", "Matías Gompertz Pérez", "Loreto Pontigo Oberreuter"}


def canon(name):
    return ALIAS.get(name, name)


_SRC = json.loads((Path(__file__).with_name("fecha3_inscritos.json")).read_text(encoding="utf-8"))

# Plantel inscrito: (nombre en el ranking, categorías en que figura).
INSCRITOS = [(canon(j["nombre"]), j["categorias"]) for j in _SRC["jugadores"]]

# name (en el ranking) -> CLUB_MAP key (ver datos/clubs.py).
NAME_CLUB = {
    canon(j["nombre"]): "" if j["nombre"] in INDEPENDIENTES else j["club"]
    for j in _SRC["jugadores"]
}

EVENTS = []


def add_event(category, modality, code, draw_type, size, placements, participation=None):
    placements = {pos: [tuple(canon(n) for n in e) for e in entries] for pos, entries in placements.items()}
    participation = [tuple(canon(n) for n in e) for e in (participation or [])]
    EVENTS.append(make_event(3, category, modality, code, draw_type, size, placements, participation))


# ---------- ADULTO (OPEN) ----------
add_event("Adulto", "Individuales Masculino", "MS", "elim", 64, {
    1: [("Bruno Mora Moreno",)],
    2: [("Alonso Medel Araya",)],
    3: [("Benjamin Bahamondez Barraza",), ("Daniel Cortez Henríquez",)],
    5: [("Cristian Araya Ortiz",), ("Fabian Diaz Gomez",), ("Emmanuel Esquer Coutiño",), ("Simon Alvarez",)],
}, participation=[
    ("Nicolas Monne Canales",), ("Javier Arentsen Bonilla",), ("Sebastian Peña Fajuri",), ("Gabriel Vicencio López",),
    ("Bastian Astudillo Quispe",), ("Ricardo Muñoz Toledo",), ("Yeiden Ramírez Reinoso",), ("Teo Arentsen Piracés",),
    ("Juan Guillermo Del Pino Lizana",), ("Francisco Rojas Lemus",), ("Eickhen Knauer Bravo",),
    ("Joaquin Bugueño Chinchilla",), ("Matías Gompertz Pérez",), ("Cristóbal Melgarejo Rozas",), ("Jhon Alcons Calle",),
    ("Steven Jialuo Li Zhong",), ("Ignacio Navarrete",), ("Sebastián Rosselot Vásquez",), ("Daniel Astudillo Opazo",),
    ("Ariel Navarro Cáceres",), ("Vicente Torres Huidobro",), ("Gabriel Ponce Barra",), ("Angel Lorca Contreras",),
    ("Benjamin Higuera Burgos",), ("Martín Dodman Vivar",), ("Wei Quan Oscar Cen He",), ("Matias Traviesa Frugone",),
    ("Ramses Cassis Durango",), ("Felipe Canario",),
])

add_event("Adulto", "Individuales Femenino", "WS", "elim", 16, {
    1: [("Ashley Montre Rubilar",)],
    2: [("Vania Diaz",)],
    3: [("Loreto Pontigo Oberreuter",), ("Antonia Cardona Santa",)],
    5: [("Javiera Pantoja Andrades",), ("Francisca Riquelme",), ("Emilia Perez",)],
}, participation=[
    ("Emilia Gonzalez Valenzuela",), ("Elise Vadot",), ("Valentina Arriagada Noack",),
])  # sin partidos jugados (walkover en cuartos): Josefina Reyes

add_event("Adulto", "Dobles Masculino", "MD", "elim", 32, {
    1: [("Benjamin Bahamondez Barraza", "Alonso Medel Araya")],
    2: [("Daniel Cortez Henríquez", "Cristóbal Melgarejo Rozas")],
    3: [("Cristian Araya Ortiz", "Nicolas Monne Canales"), ("Daniel Astudillo Opazo", "Gabriel Fernandes Morales")],
    5: [("Juan Guillermo Del Pino Lizana", "Martín Dodman Vivar"), ("Simon Alvarez", "Fabian Diaz Gomez"),
        ("Felipe Canario", "Ignacio Navarrete"), ("Yeiden Ramírez Reinoso", "Gabriel Vicencio López")],
}, participation=[
    ("Benjamin Higuera Burgos", "Ariel Navarro Cáceres"), ("Joaquin Bugueño Chinchilla", "Vicente Torres Huidobro"),
    ("Angel Lorca Contreras", "Sebastian Peña Fajuri"), ("Sebastián Rosselot Vásquez", "Matias Traviesa Frugone"),
    ("Emmanuel Esquer Coutiño", "Wei Quan Oscar Cen He"), ("Ricardo Muñoz Toledo", "Francisco Rojas Lemus"),
    ("Javier Arentsen Bonilla", "Ramses Cassis Durango"), ("Zhi Xing Lai Li", "Steven Jialuo Li Zhong"),
    ("Teo Arentsen Piracés", "Eickhen Knauer Bravo"), ("Jhon Alcons Calle", "Bastian Astudillo Quispe"),
])

add_event("Adulto", "Dobles Femenino", "WD", "elim", 8, {
    1: [("Camila Macaya Salinas", "Ashley Montre Rubilar")],
    2: [("Antonia Cardona Santa", "Francisca Diaz Gomez")],
    3: [("Emilia Perez", "Francisca Riquelme"), ("Javiera Pantoja Andrades", "Nicole Pantoja Sepúlveda")],
    5: [("Monica Cordoba Navarro", "María Valdebenito Novoa"), ("Emilia Gonzalez Valenzuela", "Josefa Morales Castillo"),
        ("Valentina Arriagada Noack", "Elise Vadot")],
})  # sin partidos jugados (walkover en cuartos): Vania Diaz & Josefina Reyes

add_event("Adulto", "Dobles Mixto", "XD", "elim", 16, {
    1: [("Cristian Araya Ortiz", "Vania Diaz")],
    2: [("Benjamin Bahamondez Barraza", "Camila Macaya Salinas")],
    3: [("Nicolas Monne Canales", "Nicole Pantoja Sepúlveda"), ("Bruno Mora Moreno", "Ashley Montre Rubilar")],
    5: [("Wei Quan Oscar Cen He", "Elise Vadot"), ("Gabriel Fernandes Morales", "María Valdebenito Novoa"),
        ("Cristóbal Melgarejo Rozas", "Javiera Pantoja Andrades"), ("Felipe Canario", "Francisca Riquelme")],
}, participation=[
    ("Matías Gompertz Pérez", "Loreto Pontigo Oberreuter"), ("Ricardo Muñoz Toledo", "Emilia Gonzalez Valenzuela"),
    ("Gabriel Ponce Barra", "Josefa Morales Castillo"), ("Ignacio Navarrete", "Emilia Perez"),
    ("Juan Guillermo Del Pino Lizana", "Valentina Arriagada Noack"), ("Sebastián Rosselot Vásquez", "Monica Cordoba Navarro"),
])  # sin partidos jugados (walkover en octavos): Angel Lorca Contreras & Josefina Reyes

# ---------- SUB 15 ----------
add_event("Sub15", "Individuales Masculino", "BS U15", "elim", 32, {
    1: [("Fabian Diaz Gomez",)],
    2: [("Bastian Astudillo Quispe",)],
    3: [("Jeronimo Cardona Santa",), ("Vicente Rivera Molina",)],
    5: [("Cristobal Mena Lorca",), ("Matías Astudillo Pailahueque",), ("Felipe Saez",), ("Derek Oses",)],
}, participation=[
    ("Vicente González Candia",), ("Hernán Vera Vergara",), ("Juan-Jose Cos Cortes",), ("Fernando Cavieres Avilés",),
    ("Haojun Luo Wo",), ("Luciano Mamani Pacheco",), ("Haofeng Luo Wu",), ("Gaspar Ponce Barra",),
    ("Sebastian Millacoy",), ("Thomas Rohde Cvitanic",), ("Agustin Troncoso",),
])  # sin partidos jugados (walkover en octavos): Lucas Quichel

add_event("Sub15", "Individuales Femenino", "GS U15", "elim", 8, {
    1: [("Antonia Cardona Santa",)],
    2: [("Francisca Diaz Gomez",)],
    3: [("Emilia Perez",), ("Josefa Torres Godoy",)],
    5: [("Consuelo Valdebenito",), ("Fabiola Neumann",), ("Amanda Senn",)],
})

add_event("Sub15", "Dobles Mixto", "XD U15", "elim", 8, {
    1: [("Fabian Diaz Gomez", "Antonia Cardona Santa")],
    2: [("Jeronimo Cardona Santa", "Francisca Diaz Gomez")],
    3: [("Bastian Astudillo Quispe", "Amanda Senn"), ("Cristobal Mena Lorca", "Josefa Torres Godoy")],
    5: [("Agustin Troncoso", "Emilia Perez"), ("Derek Oses", "Consuelo Valdebenito"), ("Felipe Saez", "Fabiola Neumann")],
})

add_event("Sub15", "Dobles Masculino", "BD U15", "elim", 8, {
    1: [("Vicente Rivera Molina", "Agustin Troncoso")],
    2: [("Bastian Astudillo Quispe", "Fabian Diaz Gomez")],
    3: [("Vicente González Candia", "Gaspar Ponce Barra"), ("Jeronimo Cardona Santa", "Cristobal Mena Lorca")],
    5: [("Juan-Jose Cos Cortes", "Thomas Rohde Cvitanic"), ("Haojun Luo Wo", "Haofeng Luo Wu"),
        ("Derek Oses", "Felipe Saez"), ("Matías Astudillo Pailahueque", "Hernán Vera Vergara")],
})

add_event("Sub15", "Dobles Femenino", "GD U15", "rr", 3, {
    1: [("Antonia Cardona Santa", "Francisca Diaz Gomez")],
    2: [("Emilia Perez", "Consuelo Valdebenito")],
    3: [("Fabiola Neumann", "Amanda Senn")],
})

# ---------- SUB 17 ----------
add_event("Sub17", "Individuales Masculino", "BS U17", "elim", 16, {
    1: [("Gabriel Ponce Barra",)],
    2: [("Simon Alvarez",)],
    3: [("Gabriel Vicencio López",), ("Yeiden Ramírez Reinoso",)],
    5: [("Teo Arentsen Piracés",), ("Steven Jialuo Li Zhong",), ("Sebastian Sanhueza",), ("Juan Bolivar Calderón",)],
}, participation=[("Jiayu Huang",)])

add_event("Sub17", "Individuales Femenino", "GS U17", "elim", 8, {
    1: [("Beatriz Palma Sandoval",)],
    2: [("Emilia Gonzalez Valenzuela",)],
    3: [("Nicole Pantoja Sepúlveda",)],
    5: [("Emilia Palma Sandoval",), ("Josefa Morales Castillo",)],
})  # sin partidos jugados: Consuelo Moscoso Córdova (WO en cuartos), Josefina Reyes (pasó cuartos por WO, WO en semis)

add_event("Sub17", "Dobles Mixto", "XD U17", "rr", 4, {
    1: [("Gabriel Ponce Barra", "Josefa Morales Castillo")],
    2: [("Simon Alvarez", "Emilia Gonzalez Valenzuela")],
    3: [("Vicente Rivera Molina", "Beatriz Palma Sandoval")],
}, participation=[
    ("Juan Bolivar Calderón", "Consuelo Moscoso Córdova"),  # jugaron 2 y se retiraron
])

add_event("Sub17", "Dobles Masculino", "BD U17", "rr", 5, {
    1: [("Simon Alvarez", "Gabriel Ponce Barra")],
    2: [("Yeiden Ramírez Reinoso", "Gabriel Vicencio López")],
    3: [("Teo Arentsen Piracés", "Steven Jialuo Li Zhong")],
    4: [("Juan Bolivar Calderón", "Jiayu Huang")],
}, participation=[
    ("Lucas Quichel", "Sebastian Sanhueza"),  # jugaron 1 y se retiraron
])

# ---------- SUB 19 ----------
add_event("Sub19", "Individuales Masculino", "BS U19", "elim", 16, {
    1: [("Angel Lorca Contreras",)],
    2: [("Felipe Canario",)],
    3: [("Emmanuel Esquer Coutiño",), ("Vicente Torres Huidobro",)],
    5: [("Cristóbal Melgarejo Rozas",), ("Ramses Cassis Durango",), ("Wei Quan Oscar Cen He",), ("Ignacio Navarrete",)],
}, participation=[
    ("Siul Del Piero Carrasco",), ("Jhon Alcons Calle",), ("Juan Saavedra Cordova",), ("Zhi Xing Lai Li",),
    ("Joaquin Bugueño Chinchilla",),
])

add_event("Sub19", "Individuales Femenino", "GS U19", "rr", 3, {
    1: [("Francisca Riquelme",)],
    2: [("Sarai Espinoza",)],
    3: [("Fernanda Rivera Conejeros",)],
})

add_event("Sub19", "Dobles Mixto", "XD U19", "rr", 5, {
    1: [("Cristóbal Melgarejo Rozas", "Nicole Pantoja Sepúlveda")],
    2: [("Felipe Canario", "Francisca Riquelme")],
    3: [("Ignacio Navarrete", "Sarai Espinoza")],
    4: [("Juan Saavedra Cordova", "Fernanda Rivera Conejeros")],
})  # sin partidos jugados (todos por walkover): Angel Lorca Contreras & Josefina Reyes

add_event("Sub19", "Dobles Masculino", "BD U19", "elim", 8, {
    1: [("Cristóbal Melgarejo Rozas", "Vicente Torres Huidobro")],
    2: [("Emmanuel Esquer Coutiño", "Angel Lorca Contreras")],
    3: [("Felipe Canario", "Ignacio Navarrete"), ("Joaquin Bugueño Chinchilla", "Wei Quan Oscar Cen He")],
    5: [("Ramses Cassis Durango", "Juan Saavedra Cordova"), ("Jiayu Huang", "Zhi Xing Lai Li")],
})

add_event("Sub19", "Dobles Femenino", "GD U19", "rr", 4, {
    1: [("Emilia Gonzalez Valenzuela", "Josefa Morales Castillo")],
    2: [("Beatriz Palma Sandoval", "Emilia Palma Sandoval")],
    3: [("Sarai Espinoza", "Fernanda Rivera Conejeros")],
})  # sin partidos jugados (todos por walkover): Josefina Reyes & Francisca Riquelme


assert len(EVENTS) == 19, f"expected 19 cuadros, got {len(EVENTS)}"
assert len(INSCRITOS) == 88, f"expected 88 inscritos, got {len(INSCRITOS)}"
assert len(NAME_CLUB) == 88, "dos inscritos quedaron con el mismo nombre en el ranking"
