from typing import List, Dict, Any
from .models import PatientInput, HospitalRecommendation

def calculate_hospital_suitability(patient: PatientInput, severity_level: str, hospital_row: Dict[str, Any]) -> HospitalRecommendation:
    score = 50.0 # baseline
    reasons = []
    alert_notes = None
    
    # Needs detection
    needs_cardiology = patient.chest_pain or patient.cardiac_history
    needs_neurology = patient.stroke_history or patient.confusion or (patient.loss_of_consciousness and not patient.severe_bleeding)
    needs_trauma = patient.severe_bleeding or (severity_level == 'CRITICAL' and patient.loss_of_consciousness)
    
    # 1. Emergency Department capability
    if not hospital_row['emergency_department']:
        if severity_level in ['HIGH', 'CRITICAL']:
            score -= 40
            alert_notes = "Warning: Facility lacks full Emergency Department triage for critical care."
        else:
            score += 5
            reasons.append("Suitable for outpatient / low-acuity urgent triage")
    else:
        score += 15
        reasons.append("Full 24/7 Emergency Department operational")
        
    # 2. Specialty Matching
    if needs_cardiology:
        if hospital_row['cardiology']:
            score += 25
            reasons.append("On-site Cardiology & Catheterization facilities available")
        else:
            score -= 15
            
    if needs_neurology:
        if hospital_row['neurology']:
            score += 20
            reasons.append("Comprehensive Stroke & Neurology team on standby")
        else:
            score -= 10
            
    if needs_trauma:
        if hospital_row['trauma_level_1']:
            score += 25
            reasons.append("Level-1 Trauma Center with immediate surgical readiness")
        else:
            score -= 15
            
    # 3. Severity & ICU Bed availability
    icu_avail = hospital_row['icu_beds_available']
    er_avail = hospital_row['er_beds_available']
    
    if severity_level == 'CRITICAL':
        if icu_avail > 3:
            score += 25
            reasons.append(f"High ICU capacity ({icu_avail} intensive care beds open)")
        elif icu_avail > 0:
            score += 15
            reasons.append(f"ICU bed secured ({icu_avail} available)")
        else:
            score -= 30
            alert_notes = "Alert: Zero ICU beds currently available at this facility."
    elif severity_level == 'HIGH':
        if icu_avail > 0:
            score += 10
            reasons.append(f"ICU back-up available ({icu_avail} beds)")
            
    if er_avail > 10:
        score += 8
        reasons.append(f"High ER throughput ({er_avail} open emergency bays)")
        
    # 4. Proximity & Travel Distance
    dist = hospital_row['distance_km']
    if dist < 3.0:
        score += 15
        reasons.append(f"Immediate proximity ({dist:.1f} km away)")
    elif dist < 5.0:
        score += 8
        reasons.append(f"Moderate transit distance ({dist:.1f} km)")
    elif dist > 6.0:
        score -= 10
        
    # 5. Estimated Waiting Time
    wait = hospital_row['estimated_wait_min']
    if wait <= 10:
        score += 12
        reasons.append(f"Minimal estimated triage queue (~{wait} min)")
    elif wait <= 20:
        score += 5
    else:
        score -= 8
        
    # 6. Ambulance bay status
    if hospital_row['ambulance_bay_status'] == 'OPEN':
        score += 5
    else:
        score -= 20
        alert_notes = "Ambulance bay currently restricted / on diversion."
        
    # Final normalization 0 - 99
    suitability_pct = int(max(10, min(98, round(score))))
    
    return HospitalRecommendation(
        hospital_id=hospital_row['id'],
        name=hospital_row['name'],
        location=hospital_row['location'],
        coordinates={"lat": hospital_row['lat'], "lng": hospital_row['lng']},
        distance_km=hospital_row['distance_km'],
        suitability_score=suitability_pct,
        icu_beds_available=hospital_row['icu_beds_available'],
        icu_beds_total=hospital_row['icu_beds_total'],
        er_beds_available=hospital_row['er_beds_available'],
        er_beds_total=hospital_row['er_beds_total'],
        emergency_department=bool(hospital_row['emergency_department']),
        cardiology=bool(hospital_row['cardiology']),
        neurology=bool(hospital_row['neurology']),
        trauma_level_1=bool(hospital_row['trauma_level_1']),
        estimated_wait_min=hospital_row['estimated_wait_min'],
        ambulance_bay_status=hospital_row['ambulance_bay_status'],
        contact_phone=hospital_row['contact_phone'],
        match_reasons=reasons[:4],
        alert_notes=alert_notes
    )

def rank_hospitals(patient: PatientInput, severity_level: str, hospitals_list: List[Dict[str, Any]]) -> List[HospitalRecommendation]:
    recommendations = [
        calculate_hospital_suitability(patient, severity_level, h) for h in hospitals_list
    ]
    # Sort descending by suitability score
    recommendations.sort(key=lambda x: x.suitability_score, reverse=True)
    return recommendations
