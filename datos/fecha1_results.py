# -*- coding: utf-8 -*-
"""
Fecha 1 — Torneo Nacional Juvenil-Adulto Santiago 2026 (30 abr - 3 may 2026).

Real results, transcribed bracket-by-bracket from the official draws at
https://tournamentsoftware.com/sport/draws.aspx?id=D252A3D7-3D1C-4B79-A53A-1B5F5BBF3F54
(Federación Chilena de Badminton's Tournamentsoftware.com profile), one
make_event(...) call per cuadro (18 total: 5 Adulto, 4 Sub15, 5 Sub17, 4 Sub19).

To add Fecha 2 / Fecha 3: copy this file's shape into a new
`datos/fechaN_results.py`, read the equivalent draws off Tournamentsoftware,
and import + concatenate its EVENTS list in build_data.py. See README.md.
"""
from build_data import make_event

# El catálogo de clubes (nombre oficial, sigla, color) es compartido por todas
# las fechas y vive en datos/clubs.py. Acá solo va el plantel de esta fecha.

# name (as it appears in the draws) -> CLUB_MAP key
NAME_CLUB = {
    "Fabian Diaz Gomez": "C.B. ANTOFAGASTA", "Francisca Diaz Gomez": "C.B. ANTOFAGASTA",
    "Simón Álvarez": "C.B. ANTOFAGASTA", "Bastian Astudillo Quispe": "C.B. ANTOFAGASTA",
    "Jhon Alcons Calle": "C.B. ANTOFAGASTA", "Vicente Torres Huidobro": "C.B. ANTOFAGASTA",
    "Joaquin Bugueño Chinchilla": "C.B. ANTOFAGASTA", "Cristobal Miranda Rodriguez": "C.B. ANTOFAGASTA",
    "Gabriel Ponce Barra": "C.B. ANTOFAGASTA", "Alexandra Campusano Molina": "C.B. ANTOFAGASTA",
    "Josefa Morales Castillo": "C.B. ANTOFAGASTA", "Ting Ting Chou Hu": "C.B. ANTOFAGASTA",
    "Haofeng Luo Wo": "C.B. ANTOFAGASTA", "Bruno Mora": "C.B. ANTOFAGASTA",
    "Jose Alcayaga Contreras": "C.B. LIMARI", "Arturo Simon Burgos Quiñones": "C.B. LIMARI",
    "Yeiden Ramirez Reinoso": "C.B. LIMARI", "Gabriel Vicencio López": "C.B. LIMARI",
    "Jiahong Wang": "C.B. LIMARI", "Francisco Rojas Lemus": "C.B. LIMARI",
    "Vicente González Candia": "C.B. LIMARI", "Lorenzo Loyola Soto": "C.B. LIMARI",
    "Juan-José Cos Cortés": "C.B. LIMARI", "Thomas Rohde Cvitanic": "C.B. LIMARI",
    "Alonso Maldonado Sanchez": "C.B. LIMARI", "Ramses Cassis Durango": "C.B. LIMARI",
    "Ricardo Muñoz Toledo": "C.B. SANTIAGO", "Angel Lorca Contreras": "C.B. SANTIAGO",
    "Lucas Contreras Sepúlveda": "C.B. SANTIAGO", "Martín Corvalán Morbiducci": "C.B. SANTIAGO",
    "Daniel Astudillo Opazo": "C.B. SANTIAGO", "Wei Quan Oscar Cen He": "C.B. SANTIAGO",
    "Emmanuel Esquer Coutiño": "C.B. SANTIAGO", "Sebastián Rosselot Vásquez": "C.B. SANTIAGO",
    "Nicole Schneiter": "C.B. SANTIAGO", "Sarai Espinoza Manquecura": "C.B. SANTIAGO",
    "Matias Olagnier": "C.B. SANTIAGO", "Emilia Gonzalez": "C.B. SANTIAGO",
    "Consuelo Moscoso Cordova": "C.B. SANTIAGO", "Steven Jialuo Li Zhong": "C.B. SANTIAGO",
    "Teo Arentsen Piracés": "C.B. SANTIAGO", "Rafael Silva Pino": "C.B. SANTIAGO",
    "Agustin Troncoso": "C.D.S.C. KAIZEN", "Ignacio Navarrete": "C.D.S.C. KAIZEN",
    "Felipe Canario": "C.D.S.C. KAIZEN", "Vania Diaz": "C.D.S.C. KAIZEN",
    "Josefina Reyes": "C.D.S.C. KAIZEN", "Francisca Riquelme": "C.D.S.C. KAIZEN",
    "Derek Oses": "C.D.S.C. KAIZEN", "Felipe Saez Zurita": "C.D.S.C. KAIZEN",
    "Amanda Senn": "C.D.S.C. KAIZEN", "Fabiola Neumann": "C.D.S.C. KAIZEN",
    "Emilia Perez": "C.D.S.C. KAIZEN", "Consuelo Valdebenito": "C.D.S.C. KAIZEN",
    "Clément Delvigne": "C.B. VALPARAISO", "Martin Dodman": "C.B. VALPARAISO",
    "Javiera Villalón Vivar": "C.B. VALPARAISO",
    "Juan Guillermo Del Pino": "C.B. ESPERANZA DE QUILPUE", "Valentina Arriagada Noack": "C.B. ESPERANZA DE QUILPUE",
    "Cristóbal Melgarejo Rozas": "C. B. VICTORIA", "Ashley Montre Rubilar": "C. B. VICTORIA",
    "Javiera Pantoja Andrades": "C. B. VICTORIA", "Nicole Pantoja Sepúlveda": "C. B. VICTORIA",
    "Vadot Elise": "", "Andrea Montero Sanchez": "",
}

EVENTS = []


def add_event(category, modality, code, draw_type, size, placements, participation=None):
    EVENTS.append(make_event(1, category, modality, code, draw_type, size, placements, participation))


# ---------- ADULTO (OPEN) ----------
add_event("Adulto", "Individuales Masculino", "MS", "elim", 32, {
    1: [("Bruno Mora",)],
    2: [("Felipe Canario",)],
    3: [("Arturo Simon Burgos Quiñones",), ("Cristóbal Melgarejo Rozas",)],
    5: [("Angel Lorca Contreras",), ("Clément Delvigne",), ("Juan Guillermo Del Pino",), ("Emmanuel Esquer Coutiño",)],
}, participation=[
    ("Ricardo Muñoz Toledo",), ("Joaquin Bugueño Chinchilla",), ("Gabriel Vicencio López",), ("Fabian Diaz Gomez",),
    ("Martín Corvalán Morbiducci",), ("Agustin Troncoso",), ("Yeiden Ramirez Reinoso",), ("Daniel Astudillo Opazo",),
    ("Wei Quan Oscar Cen He",), ("Jiahong Wang",), ("Jose Alcayaga Contreras",), ("Martin Dodman",),
    ("Sebastián Rosselot Vásquez",),
    ("Francisco Rojas Lemus",), ("Ignacio Navarrete",), ("Lucas Contreras Sepúlveda",), ("Bastian Astudillo Quispe",),
    ("Jhon Alcons Calle",), ("Vicente Torres Huidobro",), ("Simón Álvarez",), ("Cristobal Miranda Rodriguez",),
])

add_event("Adulto", "Individuales Femenino", "WS", "elim", 16, {
    1: [("Ashley Montre Rubilar",)],
    2: [("Vania Diaz",)],
    3: [("Ting Ting Chou Hu",), ("Francisca Riquelme",)],
    5: [("Nicole Schneiter",), ("Josefina Reyes",), ("Javiera Pantoja Andrades",), ("Andrea Montero Sanchez",)],
}, participation=[
    ("Josefa Morales Castillo",), ("Alexandra Campusano Molina",), ("Vadot Elise",), ("Javiera Villalón Vivar",),
    ("Valentina Arriagada Noack",), ("Sarai Espinoza Manquecura",),
])

add_event("Adulto", "Dobles Masculino", "MD", "elim", 16, {
    1: [("Wei Quan Oscar Cen He", "Cristóbal Melgarejo Rozas")],
    2: [("Cristobal Miranda Rodriguez", "Bruno Mora")],
    3: [("Emmanuel Esquer Coutiño", "Angel Lorca Contreras"), ("Felipe Canario", "Ignacio Navarrete")],
    5: [("Juan Guillermo Del Pino", "Agustin Troncoso"), ("Jhon Alcons Calle", "Bastian Astudillo Quispe"),
        ("Joaquin Bugueño Chinchilla", "Vicente Torres Huidobro"), ("Simón Álvarez", "Fabian Diaz Gomez")],
}, participation=[
    ("Ricardo Muñoz Toledo", "Matias Olagnier"), ("Clément Delvigne", "Martin Dodman"),
    ("Yeiden Ramirez Reinoso", "Gabriel Vicencio López"), ("Daniel Astudillo Opazo", "Martín Corvalán Morbiducci"),
    ("Jose Alcayaga Contreras", "Jiahong Wang"), ("Arturo Simon Burgos Quiñones", "Francisco Rojas Lemus"),
])

add_event("Adulto", "Dobles Femenino", "WD", "elim", 8, {
    1: [("Vania Diaz", "Ashley Montre Rubilar")],
    2: [("Valentina Arriagada Noack", "Ting Ting Chou Hu")],
    3: [("Vadot Elise", "Andrea Montero Sanchez"), ("Josefina Reyes", "Francisca Riquelme")],
    5: [("Javiera Pantoja Andrades", "Nicole Pantoja Sepúlveda"), ("Alexandra Campusano Molina", "Josefa Morales Castillo"),
        ("Emilia Gonzalez", "Nicole Schneiter")],
})

add_event("Adulto", "Dobles Mixto", "XD", "elim", 16, {
    1: [("Bruno Mora", "Ashley Montre Rubilar")],
    2: [("Felipe Canario", "Vania Diaz")],
    3: [("Martín Corvalán Morbiducci", "Vadot Elise"), ("Vicente Torres Huidobro", "Nicole Pantoja Sepúlveda")],
    5: [("Ricardo Muñoz Toledo", "Ting Ting Chou Hu"), ("Cristobal Miranda Rodriguez", "Alexandra Campusano Molina"),
        ("Ignacio Navarrete", "Francisca Riquelme"), ("Juan Guillermo Del Pino", "Valentina Arriagada Noack")],
}, participation=[
    ("Agustin Troncoso", "Josefina Reyes"), ("Martin Dodman", "Javiera Villalón Vivar"),
    ("Simón Álvarez", "Josefa Morales Castillo"), ("Daniel Astudillo Opazo", "Andrea Montero Sanchez"),
])

# ---------- SUB 15 ----------
add_event("Sub15", "Individuales Masculino", "BS U15", "elim", 16, {
    1: [("Fabian Diaz Gomez",)],
    2: [("Bastian Astudillo Quispe",)],
    3: [("Felipe Saez Zurita",), ("Agustin Troncoso",)],
    5: [("Thomas Rohde Cvitanic",), ("Derek Oses",), ("Juan-José Cos Cortés",), ("Lorenzo Loyola Soto",)],
}, participation=[("Vicente González Candia",), ("Haofeng Luo Wo",)])

add_event("Sub15", "Individuales Femenino", "GS U15", "rr", 4, {
    1: [("Francisca Diaz Gomez",)], 2: [("Amanda Senn",)], 3: [("Fabiola Neumann",)], 4: [("Emilia Perez",)],
})

add_event("Sub15", "Dobles Masculino", "BD U15", "rr", 5, {
    1: [("Bastian Astudillo Quispe", "Fabian Diaz Gomez")],
    2: [("Haofeng Luo Wo", "Agustin Troncoso")],
    3: [("Vicente González Candia", "Lorenzo Loyola Soto")],
    4: [("Derek Oses", "Felipe Saez Zurita")],
    5: [("Juan-José Cos Cortés", "Thomas Rohde Cvitanic")],
})

add_event("Sub15", "Dobles Mixto", "XD U15", "rr", 5, {
    1: [("Fabian Diaz Gomez", "Francisca Diaz Gomez")],
    2: [("Bastian Astudillo Quispe", "Emilia Perez")],
    3: [("Derek Oses", "Consuelo Valdebenito")],
    4: [("Felipe Saez Zurita", "Amanda Senn")],
    5: [("Haofeng Luo Wo", "Fabiola Neumann")],
})

# ---------- SUB 17 ----------
add_event("Sub17", "Individuales Masculino", "BS U17", "elim", 8, {
    1: [("Simón Álvarez",)],
    2: [("Gabriel Ponce Barra",)],
    3: [("Gabriel Vicencio López",), ("Yeiden Ramirez Reinoso",)],
    5: [("Steven Jialuo Li Zhong",), ("Teo Arentsen Piracés",), ("Rafael Silva Pino",)],
})

add_event("Sub17", "Individuales Femenino", "GS U17", "elim", 8, {
    1: [("Josefina Reyes",)],
    2: [("Nicole Pantoja Sepúlveda",)],
    3: [("Josefa Morales Castillo",), ("Alexandra Campusano Molina",)],
    5: [("Emilia Gonzalez",), ("Consuelo Moscoso Cordova",)],
})

add_event("Sub17", "Dobles Masculino", "BD U17", "rr", 3, {
    1: [("Simón Álvarez", "Gabriel Ponce Barra")],
    2: [("Yeiden Ramirez Reinoso", "Gabriel Vicencio López")],
    3: [("Teo Arentsen Piracés", "Steven Jialuo Li Zhong")],
})

add_event("Sub17", "Dobles Femenino", "GD U17", "rr", 3, {
    1: [("Alexandra Campusano Molina", "Josefa Morales Castillo")],
    2: [("Emilia Perez", "Consuelo Valdebenito")],
    3: [("Fabiola Neumann", "Amanda Senn")],
})

add_event("Sub17", "Dobles Mixto", "XD U17", "rr", 3, {
    1: [("Simón Álvarez", "Josefa Morales Castillo")],
    2: [("Agustin Troncoso", "Josefina Reyes")],
    3: [("Gabriel Ponce Barra", "Alexandra Campusano Molina")],
})

# ---------- SUB 19 ----------
add_event("Sub19", "Individuales Masculino", "BS U19", "elim", 16, {
    1: [("Felipe Canario",)],
    2: [("Angel Lorca Contreras",)],
    3: [("Emmanuel Esquer Coutiño",), ("Wei Quan Oscar Cen He",)],
    5: [("Jiahong Wang",), ("Ramses Cassis Durango",), ("Joaquin Bugueño Chinchilla",), ("Cristóbal Melgarejo Rozas",)],
}, participation=[("Alonso Maldonado Sanchez",), ("Vicente Torres Huidobro",), ("Jhon Alcons Calle",), ("Ignacio Navarrete",)])

add_event("Sub19", "Individuales Femenino", "GS U19", "rr", 3, {
    1: [("Francisca Riquelme",)], 2: [("Consuelo Valdebenito",)], 3: [("Sarai Espinoza Manquecura",)],
})

add_event("Sub19", "Dobles Masculino", "BD U19", "rr", 5, {
    1: [("Joaquin Bugueño Chinchilla", "Vicente Torres Huidobro")],
    2: [("Felipe Canario", "Ignacio Navarrete")],
    3: [("Emmanuel Esquer Coutiño", "Angel Lorca Contreras")],
    4: [("Wei Quan Oscar Cen He", "Cristóbal Melgarejo Rozas")],
    5: [("Ramses Cassis Durango", "Alonso Maldonado Sanchez")],
})

add_event("Sub19", "Dobles Mixto", "XD U19", "rr", 4, {
    1: [("Felipe Canario", "Francisca Riquelme")],
    2: [("Cristóbal Melgarejo Rozas", "Nicole Pantoja Sepúlveda")],
    3: [("Angel Lorca Contreras", "Emilia Gonzalez")],
    4: [("Joaquin Bugueño Chinchilla", "Sarai Espinoza Manquecura")],
})

assert len(EVENTS) == 18, f"expected 18 cuadros, got {len(EVENTS)}"
