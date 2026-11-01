# -*- coding: utf-8 -*-
"""
Catálogo de clubes del circuito — compartido por todas las fechas.

Vive aparte de los archivos de resultados porque un club no pertenece a una
fecha: participa en varias, y su nombre/sigla/color deben ser idénticos en
todas. Cada `datos/fechaN_results.py` mapea sus deportistas a las claves de
CLUB_MAP (el string tal como aparece en Tournamentsoftware); aquí se traduce
esa clave al nombre oficial, la sigla corta y el color.

Al agregar una fecha con un club nuevo, agrégalo a los tres diccionarios.
"""

# Clave = club tal como lo escribe Tournamentsoftware (ojo: los espacios y
# puntos varían entre clubes, por eso se copian literales).
CLUB_MAP = {
    "C.B. ANTOFAGASTA": "Club Bádminton Antofagasta",
    "C.B. LIMARI": "Club Bádminton Limarí",
    "C.B. VALPARAISO": "Club Bádminton Valparaíso",
    "C.B. ESPERANZA DE QUILPUE": "Club Bádminton Esperanza de Quilpué",
    "C.B. SANTIAGO": "Club Bádminton Santiago",
    "C.D.S.C. KAIZEN": "Club Deportivo Kaizen",
    "C. B. VICTORIA": "Club Bádminton Victoria",
    "C.B. CONCON": "Club Bádminton Concón",
    # Desde la 3ª Fecha Tournamentsoftware escribe estos dos con espacio.
    "C. B. ANTOFAGASTA": "Club Bádminton Antofagasta",
    "C. B. SANTIAGO": "Club Bádminton Santiago",
    "": "Independiente",
}

CLUB_SHORT = {
    "Club Bádminton Antofagasta": "CB Antofagasta",
    "Club Bádminton Limarí": "CB Limarí",
    "Club Bádminton Valparaíso": "CB Valparaíso",
    "Club Bádminton Esperanza de Quilpué": "CB Esperanza de Quilpué",
    "Club Bádminton Santiago": "CB Santiago",
    "Club Deportivo Kaizen": "CDSC Kaizen",
    "Club Bádminton Victoria": "CB Victoria",
    "Club Bádminton Concón": "CB Concón",
    "Independiente": "Independiente",
}

# Fixed hue per club (dataviz-validated categorical palette), assigned by
# club identity — never by current ranking position, so colors don't
# repaint as standings change fecha to fecha.
CLUB_COLOR = {
    "Club Bádminton Antofagasta": "#2a78d6",
    "Club Bádminton Limarí": "#eb6834",
    "Club Bádminton Valparaíso": "#1baf7a",
    "Club Bádminton Esperanza de Quilpué": "#eda100",
    "Club Bádminton Santiago": "#e87ba4",
    "Club Deportivo Kaizen": "#008300",
    "Club Bádminton Victoria": "#4a3aa7",
    "Club Bádminton Concón": "#8a5a3c",
}
