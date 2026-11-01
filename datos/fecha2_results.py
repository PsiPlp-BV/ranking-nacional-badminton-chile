# -*- coding: utf-8 -*-
"""
Fecha 2 — Torneo Nacional Juvenil-Adulto Victoria 2026 (20-23 ago 2026).

Real results, transcribed bracket-by-bracket from the official draws at
https://www.tournamentsoftware.com/tournament/A35095C0-BBEF-4957-94C0-3FED545B9328
(Federación Chilena de Badminton's Tournamentsoftware.com profile), one
make_event(...) call per cuadro.

17 cuadros jugados de 20 eventos inscritos: XD U17 (2 parejas), BD U17 (2) y
GD U17 (1) no alcanzaron cuadro y por lo tanto no reparten puntos.
Reparto por categoría: 5 Adulto, 5 Sub15, 2 Sub17, 5 Sub19.

Tres clubes de la Fecha 1 no viajaron a Victoria (Limarí, Valparaíso y
Esperanza de Quilpué), y aparece un club nuevo en el circuito: C.B. Concón.
"""
from build_data import make_event

# name (as it appears in the draws) -> CLUB_MAP key (ver datos/clubs.py).
# Es el plantel de ESTA fecha: si un deportista cambia de club entre fechas,
# cada archivo refleja el club con el que compitió esa vez.
NAME_CLUB = {
    "Ashlyn Alcons": "C.B. ANTOFAGASTA", "Jhon Alcons Calle": "C.B. ANTOFAGASTA",
    "Simón Álvarez": "C.B. ANTOFAGASTA", "Bastian Astudillo Quispe": "C.B. ANTOFAGASTA",
    "Antonia Cardona": "C.B. ANTOFAGASTA", "Jeronimo Cardona": "C.B. ANTOFAGASTA",
    "Fabian Diaz Gomez": "C.B. ANTOFAGASTA", "Francisca Diaz Gomez": "C.B. ANTOFAGASTA",
    "Haofeng Luo Wo": "C.B. ANTOFAGASTA", "Haojun Luo Wo": "C.B. ANTOFAGASTA",
    "Camila Macaya": "C.B. ANTOFAGASTA", "Cristobal Mena": "C.B. ANTOFAGASTA",
    "Cristobal Miranda Rodriguez": "C.B. ANTOFAGASTA", "Bruno Mora": "C.B. ANTOFAGASTA",
    "Gaspar Ponce": "C.B. ANTOFAGASTA", "Gabriel Ponce Barra": "C.B. ANTOFAGASTA",
    "Josefa Torres": "C.B. ANTOFAGASTA", "Vicente Torres Huidobro": "C.B. ANTOFAGASTA",
    "Andres Trigo": "C.B. ANTOFAGASTA",
    "Teo Arentsen Piracés": "C.B. SANTIAGO", "Javier Aretsen": "C.B. SANTIAGO",
    "Daniel Astudillo Opazo": "C.B. SANTIAGO", "Siul Carrasco": "C.B. SANTIAGO",
    "Wei Quan Oscar Cen He": "C.B. SANTIAGO", "Sarai Espinoza Manquecura": "C.B. SANTIAGO",
    "Emmanuel Esquer Coutiño": "C.B. SANTIAGO", "Emilia Gonzalez": "C.B. SANTIAGO",
    "Camilo Huenchuman": "C.B. SANTIAGO", "Steven Jialuo Li Zhong": "C.B. SANTIAGO",
    "Angel Lorca Contreras": "C.B. SANTIAGO", "Ricardo Muñoz Toledo": "C.B. SANTIAGO",
    "Gonzalo Avello": "C.D.S.C. KAIZEN", "Felipe Canario": "C.D.S.C. KAIZEN",
    "Amanda Carvajal": "C.D.S.C. KAIZEN", "Vania Diaz": "C.D.S.C. KAIZEN",
    "Matias Lema": "C.D.S.C. KAIZEN", "Monserrat Loyola": "C.D.S.C. KAIZEN",
    "Martina Medina": "C.D.S.C. KAIZEN", "Nicolas Monne": "C.D.S.C. KAIZEN",
    "Ignacio Navarrete": "C.D.S.C. KAIZEN", "Fabiola Neumann": "C.D.S.C. KAIZEN",
    "Derek Oses": "C.D.S.C. KAIZEN", "Emilia Perez": "C.D.S.C. KAIZEN",
    "Josefina Reyes": "C.D.S.C. KAIZEN", "Francisca Riquelme": "C.D.S.C. KAIZEN",
    "Felipe Saez Zurita": "C.D.S.C. KAIZEN", "Amanda Senn": "C.D.S.C. KAIZEN",
    "Sofia Tello": "C.D.S.C. KAIZEN", "Agustin Troncoso": "C.D.S.C. KAIZEN",
    "Amaro Valdebenito": "C.D.S.C. KAIZEN", "Consuelo Valdebenito": "C.D.S.C. KAIZEN",
    "Mathias Williams": "C.D.S.C. KAIZEN",
    "Matias Astudillo": "C. B. VICTORIA", "Daniel Cortez": "C. B. VICTORIA",
    "Vicente Fuentes": "C. B. VICTORIA", "Benjamin Higuera": "C. B. VICTORIA",
    "Jorge Higuera": "C. B. VICTORIA", "Cristóbal Melgarejo Rozas": "C. B. VICTORIA",
    "Sebastian Millacoy": "C. B. VICTORIA", "Ashley Montre Rubilar": "C. B. VICTORIA",
    "Beatriz Palma": "C. B. VICTORIA", "Emilia Palma": "C. B. VICTORIA",
    "Javiera Pantoja Andrades": "C. B. VICTORIA", "Nicole Pantoja Sepúlveda": "C. B. VICTORIA",
    "Daniel Rebolledo": "C. B. VICTORIA", "Vicente Rivera": "C. B. VICTORIA",
    "Hernan Vera": "C. B. VICTORIA",
    # Andrea Montero Sanchez competió como independiente en la Fecha 1 y en
    # esta lo hace por C.B. Concón, club que debuta en el circuito.
    "Andrea Montero Sanchez": "C.B. CONCON",
}

EVENTS = []


def add_event(category, modality, code, draw_type, size, placements, participation=None):
    EVENTS.append(make_event(2, category, modality, code, draw_type, size, placements, participation))


# ---------- ADULTO (OPEN) ----------
add_event("Adulto", "Individuales Masculino", "MS", "elim", 32, {
    1: [("Bruno Mora",)],
    2: [("Felipe Canario",)],
    3: [("Angel Lorca Contreras",), ("Gonzalo Avello",)],
    5: [("Wei Quan Oscar Cen He",), ("Andres Trigo",), ("Ignacio Navarrete",), ("Vicente Torres Huidobro",)],
}, participation=[
    ("Ricardo Muñoz Toledo",), ("Mathias Williams",), ("Fabian Diaz Gomez",), ("Javier Aretsen",),
    ("Nicolas Monne",), ("Camilo Huenchuman",), ("Jhon Alcons Calle",), ("Cristobal Miranda Rodriguez",),
    ("Daniel Rebolledo",), ("Steven Jialuo Li Zhong",),
    ("Daniel Cortez",), ("Bastian Astudillo Quispe",), ("Cristóbal Melgarejo Rozas",), ("Simón Álvarez",),
    ("Benjamin Higuera",), ("Emmanuel Esquer Coutiño",), ("Daniel Astudillo Opazo",), ("Gabriel Ponce Barra",),
])

add_event("Adulto", "Individuales Femenino", "WS", "elim", 8, {
    1: [("Ashley Montre Rubilar",)],
    2: [("Vania Diaz",)],
    3: [("Andrea Montero Sanchez",), ("Josefina Reyes",)],
    5: [("Francisca Riquelme",), ("Javiera Pantoja Andrades",), ("Antonia Cardona",)],
})

add_event("Adulto", "Dobles Masculino", "MD", "elim", 16, {
    1: [("Gonzalo Avello", "Mathias Williams")],
    2: [("Felipe Canario", "Nicolas Monne")],
    3: [("Daniel Cortez", "Cristóbal Melgarejo Rozas"), ("Simón Álvarez", "Fabian Diaz Gomez")],
    5: [("Emmanuel Esquer Coutiño", "Angel Lorca Contreras"), ("Cristobal Miranda Rodriguez", "Gabriel Ponce Barra"),
        ("Bruno Mora", "Vicente Torres Huidobro"), ("Wei Quan Oscar Cen He", "Ignacio Navarrete")],
}, participation=[
    ("Jhon Alcons Calle", "Bastian Astudillo Quispe"), ("Ricardo Muñoz Toledo", "Andres Trigo"),
    ("Benjamin Higuera", "Jorge Higuera"), ("Siul Carrasco", "Camilo Huenchuman"),
    ("Javier Aretsen", "Daniel Astudillo Opazo"),
])

add_event("Adulto", "Dobles Femenino", "WD", "rr", 5, {
    1: [("Camila Macaya", "Ashley Montre Rubilar")],
    2: [("Vania Diaz", "Josefina Reyes")],
    3: [("Andrea Montero Sanchez", "Francisca Riquelme")],
    4: [("Javiera Pantoja Andrades", "Nicole Pantoja Sepúlveda")],
    5: [("Antonia Cardona", "Francisca Diaz Gomez")],
})

add_event("Adulto", "Dobles Mixto", "XD", "elim", 16, {
    1: [("Bruno Mora", "Ashley Montre Rubilar")],
    2: [("Felipe Canario", "Vania Diaz")],
    3: [("Daniel Astudillo Opazo", "Andrea Montero Sanchez"), ("Angel Lorca Contreras", "Josefina Reyes")],
    5: [("Simón Álvarez", "Camila Macaya"), ("Ignacio Navarrete", "Francisca Riquelme"),
        ("Vicente Torres Huidobro", "Nicole Pantoja Sepúlveda"), ("Daniel Cortez", "Javiera Pantoja Andrades")],
}, participation=[
    ("Daniel Rebolledo", "Emilia Palma"), ("Gabriel Ponce Barra", "Sarai Espinoza Manquecura"),
    ("Jhon Alcons Calle", "Ashlyn Alcons"), ("Ricardo Muñoz Toledo", "Emilia Gonzalez"),
])

# ---------- SUB 15 ----------
add_event("Sub15", "Individuales Masculino", "BS U15", "elim", 16, {
    1: [("Fabian Diaz Gomez",)],
    2: [("Bastian Astudillo Quispe",)],
    3: [("Gaspar Ponce",), ("Vicente Rivera",)],
    5: [("Amaro Valdebenito",), ("Hernan Vera",), ("Cristobal Mena",), ("Vicente Fuentes",)],
}, participation=[
    ("Sebastian Millacoy",), ("Felipe Saez Zurita",), ("Haojun Luo Wo",), ("Matias Astudillo",),
    ("Derek Oses",), ("Haofeng Luo Wo",),
])

add_event("Sub15", "Individuales Femenino", "GS U15", "elim", 16, {
    1: [("Antonia Cardona",)],
    2: [("Francisca Diaz Gomez",)],
    3: [("Monserrat Loyola",), ("Josefa Torres",)],
    5: [("Consuelo Valdebenito",), ("Amanda Carvajal",), ("Fabiola Neumann",), ("Amanda Senn",)],
}, participation=[("Ashlyn Alcons",), ("Emilia Perez",)])

add_event("Sub15", "Dobles Masculino", "BD U15", "elim", 8, {
    1: [("Bastian Astudillo Quispe", "Fabian Diaz Gomez")],
    2: [("Vicente Rivera", "Amaro Valdebenito")],
    3: [("Gaspar Ponce", "Agustin Troncoso"), ("Vicente Fuentes", "Sebastian Millacoy")],
    5: [("Matias Astudillo", "Hernan Vera"), ("Jeronimo Cardona", "Cristobal Mena"),
        ("Haofeng Luo Wo", "Haojun Luo Wo"), ("Derek Oses", "Felipe Saez Zurita")],
})

add_event("Sub15", "Dobles Femenino", "GD U15", "rr", 5, {
    1: [("Antonia Cardona", "Francisca Diaz Gomez")],
    2: [("Emilia Perez", "Consuelo Valdebenito")],
    3: [("Amanda Carvajal", "Monserrat Loyola")],
    4: [("Fabiola Neumann", "Amanda Senn")],
    5: [("Ashlyn Alcons", "Josefa Torres")],
})

add_event("Sub15", "Dobles Mixto", "XD U15", "elim", 16, {
    1: [("Fabian Diaz Gomez", "Antonia Cardona")],
    2: [("Jeronimo Cardona", "Francisca Diaz Gomez")],
    3: [("Agustin Troncoso", "Emilia Perez"), ("Amaro Valdebenito", "Monserrat Loyola")],
    5: [("Felipe Saez Zurita", "Amanda Senn"), ("Bastian Astudillo Quispe", "Ashlyn Alcons"),
        ("Gaspar Ponce", "Consuelo Valdebenito"), ("Derek Oses", "Fabiola Neumann")],
}, participation=[("Cristobal Mena", "Josefa Torres")])

# ---------- SUB 17 ----------
# XD U17 (2 parejas), BD U17 (2) y GD U17 (1) quedaron sin cuadro: no se jugó
# ningún partido, así que no reparten puntos de participación.
add_event("Sub17", "Individuales Masculino", "BS U17", "elim", 8, {
    1: [("Simón Álvarez",)],
    2: [("Gabriel Ponce Barra",)],
    3: [("Agustin Troncoso",), ("Steven Jialuo Li Zhong",)],
    5: [("Siul Carrasco",), ("Teo Arentsen Piracés",)],
})

add_event("Sub17", "Individuales Femenino", "GS U17", "rr", 4, {
    1: [("Josefina Reyes",)],
    2: [("Nicole Pantoja Sepúlveda",)],
    3: [("Beatriz Palma",)],
    4: [("Emilia Palma",)],
})

# ---------- SUB 19 ----------
add_event("Sub19", "Individuales Masculino", "BS U19", "elim", 16, {
    1: [("Angel Lorca Contreras",)],
    2: [("Felipe Canario",)],
    3: [("Emmanuel Esquer Coutiño",), ("Cristóbal Melgarejo Rozas",)],
    5: [("Camilo Huenchuman",), ("Jorge Higuera",), ("Wei Quan Oscar Cen He",), ("Vicente Torres Huidobro",)],
}, participation=[("Jhon Alcons Calle",), ("Matias Lema",), ("Ignacio Navarrete",)])

add_event("Sub19", "Individuales Femenino", "GS U19", "rr", 4, {
    1: [("Francisca Riquelme",)],
    2: [("Martina Medina",)],
    3: [("Sofia Tello",)],
    4: [("Sarai Espinoza Manquecura",)],
})

add_event("Sub19", "Dobles Masculino", "BD U19", "elim", 8, {
    1: [("Cristóbal Melgarejo Rozas", "Vicente Torres Huidobro")],
    2: [("Felipe Canario", "Wei Quan Oscar Cen He")],
    3: [("Emmanuel Esquer Coutiño", "Angel Lorca Contreras"), ("Simón Álvarez", "Gabriel Ponce Barra")],
    5: [("Matias Lema", "Ignacio Navarrete"), ("Jhon Alcons Calle", "Jorge Higuera"),
        ("Teo Arentsen Piracés", "Steven Jialuo Li Zhong"), ("Siul Carrasco", "Camilo Huenchuman")],
})

add_event("Sub19", "Dobles Femenino", "GD U19", "rr", 4, {
    1: [("Josefina Reyes", "Francisca Riquelme")],
    2: [("Martina Medina", "Nicole Pantoja Sepúlveda")],
    3: [("Beatriz Palma", "Emilia Palma")],
    4: [("Sarai Espinoza Manquecura", "Sofia Tello")],
})

add_event("Sub19", "Dobles Mixto", "XD U19", "elim", 8, {
    1: [("Felipe Canario", "Francisca Riquelme")],
    2: [("Angel Lorca Contreras", "Josefina Reyes")],
    3: [("Vicente Rivera", "Beatriz Palma"), ("Cristóbal Melgarejo Rozas", "Nicole Pantoja Sepúlveda")],
    5: [("Gabriel Ponce Barra", "Sarai Espinoza Manquecura"), ("Ignacio Navarrete", "Sofia Tello"),
        ("Matias Lema", "Martina Medina"), ("Wei Quan Oscar Cen He", "Emilia Gonzalez")],
})

assert len(EVENTS) == 17, f"expected 17 cuadros, got {len(EVENTS)}"
