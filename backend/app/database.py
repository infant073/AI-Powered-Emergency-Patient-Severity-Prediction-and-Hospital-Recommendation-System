import sqlite3
import json
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "emergency_triage.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create patients assessment history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        severity_level TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        confidence REAL NOT NULL,
        heart_rate INTEGER NOT NULL,
        blood_pressure TEXT NOT NULL,
        spo2 REAL NOT NULL,
        temperature REAL NOT NULL,
        respiratory_rate INTEGER NOT NULL,
        symptoms_summary TEXT NOT NULL,
        recommended_hospital TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Evaluated',
        details_json TEXT
    )
    """)
    
    # Create hospitals table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        distance_km REAL NOT NULL,
        emergency_department INTEGER NOT NULL,
        icu_beds_total INTEGER NOT NULL,
        icu_beds_available INTEGER NOT NULL,
        er_beds_total INTEGER NOT NULL,
        er_beds_available INTEGER NOT NULL,
        cardiology INTEGER NOT NULL,
        neurology INTEGER NOT NULL,
        trauma_level_1 INTEGER NOT NULL,
        pediatric_er INTEGER NOT NULL,
        general_emergency INTEGER NOT NULL,
        estimated_wait_min INTEGER NOT NULL,
        ambulance_bay_status TEXT NOT NULL,
        contact_phone TEXT NOT NULL
    )
    """)
    
    conn.commit()
    
    # Seed hospitals if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM hospitals")
    if cursor.fetchone()['cnt'] == 0:
        seed_hospitals(conn)
        
    # Seed sample historical patients if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM patients")
    if cursor.fetchone()['cnt'] == 0:
        seed_patients(conn)
        
    conn.close()

def seed_hospitals(conn):
    hospitals_json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "sample_hospitals.json")
    if os.path.exists(hospitals_json_path):
        with open(hospitals_json_path, 'r') as f:
            hospitals = json.load(f)
            cursor = conn.cursor()
            for h in hospitals:
                cursor.execute("""
                INSERT OR REPLACE INTO hospitals (
                    id, name, location, lat, lng, distance_km,
                    emergency_department, icu_beds_total, icu_beds_available,
                    er_beds_total, er_beds_available, cardiology, neurology,
                    trauma_level_1, pediatric_er, general_emergency,
                    estimated_wait_min, ambulance_bay_status, contact_phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    h['id'], h['name'], h['location'],
                    h['coordinates']['lat'], h['coordinates']['lng'],
                    h['distance_km'],
                    1 if h['emergency_department'] else 0,
                    h['icu_beds_total'], h['icu_beds_available'],
                    h['er_beds_total'], h['er_beds_available'],
                    1 if h['cardiology'] else 0,
                    1 if h['neurology'] else 0,
                    1 if h['trauma_level_1'] else 0,
                    1 if h['pediatric_er'] else 0,
                    1 if h['general_emergency'] else 0,
                    h['estimated_wait_min'],
                    h['ambulance_bay_status'],
                    h['contact_phone']
                ))
            conn.commit()

def seed_patients(conn):
    # (patient_id, age, gender, severity, risk_score, confidence, hr, bp, spo2, temp, rr, symptoms, hospital, status, minutes_offset)
    sample_records = [
        ("PT-901", 68, "Male", "CRITICAL", 94, 0.96, 142, "78/48", 82.0, 39.1, 32, "Chest Pain, Dyspnea, LOC", "Metro General Hospital & Trauma Center", "En Route (EMS)", -18),
        ("PT-902", 72, "Female", "HIGH", 78, 0.91, 115, "175/98", 89.5, 38.4, 26, "Chest Pain, Confusion, Cardiac Hx", "St. Jude Heart & Vascular Institute", "Admitted", -45),
        ("PT-903", 34, "Male", "MODERATE", 54, 0.88, 98, "138/86", 96.0, 38.6, 20, "Fever, Moderate Dyspnea", "CityCare Emergency & Comprehensive Stroke Center", "Treated & Released", -90),
        ("PT-904", 26, "Female", "LOW", 18, 0.95, 72, "118/74", 98.5, 36.8, 14, "Mild Dizziness", "Community Health Urgent & Emergency Clinic", "Treated & Released", -140),
        ("PT-905", 81, "Male", "CRITICAL", 96, 0.98, 155, "68/40", 79.0, 39.4, 36, "Severe Bleeding, Shock, LOC", "Metro General Hospital & Trauma Center", "ICU Admitted", -210),
        ("PT-906", 55, "Female", "HIGH", 74, 0.89, 110, "168/102", 91.0, 38.2, 24, "Chest Pain, Dizziness, Diabetes", "St. Jude Heart & Vascular Institute", "Under Observation", -280),
        ("PT-907", 42, "Male", "MODERATE", 48, 0.85, 92, "130/82", 95.5, 38.0, 18, "Breathing Difficulty", "Pine Crest Regional Medical Center", "Discharged", -350),
        ("PT-908", 29, "Female", "LOW", 14, 0.97, 68, "112/70", 99.0, 36.6, 14, "Isolated Mild Headache", "Mercy Urgent Care & Triage Annex", "Discharged", -420),
        ("PT-909", 63, "Male", "HIGH", 82, 0.93, 122, "182/105", 88.0, 37.9, 28, "Confusion, Stroke History, Dyspnea", "CityCare Emergency & Comprehensive Stroke Center", "In Surgery", -500),
        ("PT-910", 77, "Female", "CRITICAL", 91, 0.94, 38, "80/50", 83.5, 36.0, 30, "Severe Bradycardia, LOC, Cardiac Hx", "Metro General Hospital & Trauma Center", "ICU Admitted", -620)
    ]
    
    now = datetime.now()
    cursor = conn.cursor()
    for pt in sample_records:
        created_time = (now + timedelta(minutes=pt[14])).strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
        INSERT INTO patients (
            patient_id, created_at, age, gender, severity_level,
            risk_score, confidence, heart_rate, blood_pressure,
            spo2, temperature, respiratory_rate, symptoms_summary,
            recommended_hospital, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            pt[0], created_time, pt[1], pt[2], pt[3], pt[4], pt[5],
            pt[6], pt[7], pt[8], pt[9], pt[10], pt[11], pt[12], pt[13]
        ))
    conn.commit()
