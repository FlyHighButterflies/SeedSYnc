from math import radians, sin, cos, sqrt, atan2

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c  # in kilometers

province_locations = {
    "Abra": (17.5793, 120.8055),
"AgusandelNorte": (9.0145, 125.5227),
"AgusandelSur": (8.4035, 125.7573),
"Aklan": (11.6099, 122.2474),
"Albay": (13.2113, 123.6153),
"Antique": (11.1266, 122.0695),
"Apayao": (18.0922, 121.1970),
"Aurora": (15.9268, 121.7046),
"Basilan": (6.5795, 122.0218),
"Bataan": (14.6646, 120.4493),
"Batanes": (20.5491, 121.8876),
"Batangas": (13.8998, 121.0301),
"Benguet": (16.5391, 120.7042),
"Biliran": (11.5968, 124.4730),
"Bohol": (9.8537, 124.1975),
"Bukidnon": (8.0201, 124.9985),
"Bulacan": (14.9708, 121.0652),
"Cagayan": (18.0995, 121.7631),
"CamarinesNorte": (14.1439, 122.7284),
"CamarinesSur": (13.7051, 123.2630),
"Camiguin": (9.1718, 124.7178),
"Capiz": (11.3682, 122.6359),
"Catanduanes": (13.7835, 124.2369),
"Cavite": (14.2534, 120.8722),
"Cebu": (10.3565, 123.7556),
"CompostelaValley": (7.5772, 126.0177),
"DavaodelNorte": (7.5822, 125.6373),
"DavaodelSur": (6.6972, 125.4188),
"DavaoOriental": (7.2569, 126.2973),
"DinagatIslands": (10.1700, 125.6019),
"EasternSamar": (11.6565, 125.3802),
"Guimaras": (10.5682, 122.6135),
"Ifugao": (16.8521, 121.2144),
"IlocosNorte": (18.1998, 120.7309),
"IlocosSur": (17.2211, 120.5517),
"Iloilo": (11.0056, 122.6035),
"Isabela": (16.9842, 121.9609),
"Kalinga": (17.4339, 121.2911),
"LaUnion": (16.5809, 120.4277),
"Laguna": (14.2833, 121.3251),
"LanaodelNorte": (8.0214, 124.0443),
"LanaodelSur": (7.8091, 124.3340),
"Leyte": (10.9773, 124.7538),
"Maguindanao": (7.0241, 124.3763),
"Marinduque": (13.3916, 121.9720),
"Masbate": (12.2949, 123.5520),
"MetropolitanManila": (14.5987, 121.0326),
"MisamisOccidental": (8.3251, 123.6886),
"MisamisOriental": (8.6464, 124.8114),
"MountainProvince": (17.1005, 121.1324),
"NegrosOccidental": (10.3014, 122.9847),
"NegrosOriental": (9.6013, 123.0388),
"NorthCotabato": (7.2147, 124.8520),
"NorthernSamar": (12.4133, 124.7901),
"NuevaEcija": (15.6175, 121.0226),
"NuevaVizcaya": (16.3118, 121.1511),
"OccidentalMindoro": (12.9771, 120.8887),
"OrientalMindoro": (12.9625, 121.2633),
"Palawan": (9.9878, 118.7518),
"Pampanga": (15.0571, 120.6651),
"Pangasinan": (16.0003, 120.3117),
"Quezon": (14.1620, 121.9690),
"Quirino": (16.2920, 121.5886),
"Rizal": (14.6287, 121.2701),
"Romblon": (12.4373, 122.2329),
"Samar": (11.8429, 124.9406),
"Sarangani": (6.0215, 125.1468),
"Siquijor": (9.1851, 123.5883),
"Sorsogon": (12.8540, 123.9290),
"SouthCotabato": (6.2825, 124.8460),
"SouthernLeyte": (10.2924, 125.0522),
"SultanKudarat": (6.5461, 124.4743),
"Sulu": (5.9561, 121.0515),
"SurigaodelNorte": (9.6627, 125.7325),
"SurigaodelSur": (8.8217, 126.1043),
"Tarlac": (15.4788, 120.4788),
"Tawi-Tawi": (5.2617, 119.8600),
"Zambales": (15.2885, 120.1437),
"ZamboangadelNorte": (8.0521, 122.8129),
"ZamboangadelSur": (7.6737, 122.9931),
"ZamboangaSibugay": (7.6778, 122.7134)
}

threshold_km = 120  # If two provinces are within 120km, consider them neighbors

philippines_graph = {}

for prov1 in province_locations:
    connections = []
    for prov2 in province_locations:
        if prov1 != prov2:
            dist = haversine_distance(*province_locations[prov1], *province_locations[prov2])
            if dist <= threshold_km:
                connections.append((prov2, round(dist)))
    philippines_graph[prov1] = connections