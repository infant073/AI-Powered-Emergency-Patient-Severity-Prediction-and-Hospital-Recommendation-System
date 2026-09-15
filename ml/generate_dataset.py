"""
Emergency Patient Dataset Generator for Healthcare Decision Support Prototype.

Generates a realistic synthetic clinical dataset modeled after Emergency Severity Index (ESI) 
and Modified Early Warning Score (MEWS) clinical guidelines.
NOTE: This dataset is synthesized for software prototype evaluation and research demonstration only.
"""

import os
import json
import numpy as np
import pandas as pd

def generate_emergency_dataset(n_samples: int = 3500, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    records = []
    
    # Target distribution approx: 25% LOW, 35% MODERATE, 25% HIGH, 15% CRITICAL
    target_severities = np.random.choice(
        ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        size=n_samples,
        p=[0.25, 0.35, 0.25, 0.15]
    )
    
    for i, severity in enumerate(target_severities):
        patient_id = f"PT-{1000 + i}"
        age = int(np.random.choice([
            np.random.randint(18, 45),
            np.random.randint(45, 65),
            np.random.randint(65, 92)
        ], p=[0.35, 0.35, 0.30]))
        
        gender = np.random.choice(['Male', 'Female'])
        
        # Medical History (higher probability in older age or higher severity)
        prob_cardiac = 0.4 if (age > 55 or severity in ['HIGH', 'CRITICAL']) else 0.1
        prob_diabetes = 0.35 if age > 50 else 0.12
        prob_stroke = 0.25 if (age > 60 or severity in ['HIGH', 'CRITICAL']) else 0.05
        
        cardiac_history = int(np.random.rand() < prob_cardiac)
        diabetes = int(np.random.rand() < prob_diabetes)
        stroke_history = int(np.random.rand() < prob_stroke)
        
        # Generate vitals and symptoms conditional on intended severity archetype
        if severity == 'LOW':
            heart_rate = int(np.clip(np.random.normal(74, 8), 58, 95))
            systolic_bp = int(np.clip(np.random.normal(118, 10), 95, 135))
            diastolic_bp = int(np.clip(np.random.normal(76, 7), 60, 88))
            spo2 = float(np.clip(np.random.normal(98.2, 1.0), 95.0, 100.0))
            temperature = round(float(np.clip(np.random.normal(36.8, 0.4), 36.1, 37.8)), 1)
            respiratory_rate = int(np.clip(np.random.normal(15, 2), 12, 20))
            
            chest_pain = int(np.random.rand() < 0.03)
            breathing_difficulty = int(np.random.rand() < 0.04)
            dizziness = int(np.random.rand() < 0.10)
            loss_of_consciousness = 0
            severe_bleeding = 0
            confusion = 0
            
        elif severity == 'MODERATE':
            heart_rate = int(np.clip(np.random.normal(96, 12), 70, 120))
            systolic_bp = int(np.clip(np.random.normal(138, 16), 110, 165))
            diastolic_bp = int(np.clip(np.random.normal(86, 10), 65, 100))
            spo2 = float(np.clip(np.random.normal(95.0, 1.8), 92.0, 98.0))
            temperature = round(float(np.clip(np.random.normal(38.1, 0.8), 36.5, 39.5)), 1)
            respiratory_rate = int(np.clip(np.random.normal(21, 3), 16, 26))
            
            chest_pain = int(np.random.rand() < 0.15)
            breathing_difficulty = int(np.random.rand() < 0.25)
            dizziness = int(np.random.rand() < 0.35)
            loss_of_consciousness = int(np.random.rand() < 0.02)
            severe_bleeding = int(np.random.rand() < 0.05)
            confusion = int(np.random.rand() < 0.08)
            
        elif severity == 'HIGH':
            heart_rate = int(np.clip(np.random.normal(118, 18), 90, 155))
            systolic_bp = int(np.clip(np.random.normal(160, 24), 85, 205))
            diastolic_bp = int(np.clip(np.random.normal(96, 14), 55, 118))
            spo2 = float(np.clip(np.random.normal(90.5, 2.5), 85.0, 94.0))
            temperature = round(float(np.clip(np.random.normal(38.6, 1.0), 35.8, 40.5)), 1)
            respiratory_rate = int(np.clip(np.random.normal(27, 4), 22, 36))
            
            chest_pain = int(np.random.rand() < 0.65)
            breathing_difficulty = int(np.random.rand() < 0.60)
            dizziness = int(np.random.rand() < 0.50)
            loss_of_consciousness = int(np.random.rand() < 0.15)
            severe_bleeding = int(np.random.rand() < 0.25)
            confusion = int(np.random.rand() < 0.35)
            
        else: # CRITICAL
            heart_rate = int(np.clip(np.random.choice([
                np.random.normal(148, 16),
                np.random.normal(42, 5) # severe bradycardia
            ], p=[0.85, 0.15]), 35, 195))
            
            systolic_bp = int(np.clip(np.random.choice([
                np.random.normal(72, 10), # shock/hypotension
                np.random.normal(205, 15) # hypertensive crisis
            ], p=[0.7, 0.3]), 55, 235))
            
            diastolic_bp = int(np.clip(np.random.normal(52 if systolic_bp < 90 else 115, 12), 35, 130))
            spo2 = float(np.clip(np.random.normal(83.0, 4.0), 65.0, 89.0))
            temperature = round(float(np.clip(np.random.normal(39.2, 1.2), 34.5, 41.2)), 1)
            respiratory_rate = int(np.clip(np.random.normal(34, 5), 8, 48))
            
            chest_pain = int(np.random.rand() < 0.80)
            breathing_difficulty = int(np.random.rand() < 0.85)
            dizziness = int(np.random.rand() < 0.70)
            loss_of_consciousness = int(np.random.rand() < 0.60)
            severe_bleeding = int(np.random.rand() < 0.45)
            confusion = int(np.random.rand() < 0.75)

        records.append({
            'patient_id': patient_id,
            'age': age,
            'gender': gender,
            'heart_rate': heart_rate,
            'systolic_bp': systolic_bp,
            'diastolic_bp': diastolic_bp,
            'spo2': round(spo2, 1),
            'temperature': temperature,
            'respiratory_rate': respiratory_rate,
            'chest_pain': chest_pain,
            'breathing_difficulty': breathing_difficulty,
            'dizziness': dizziness,
            'loss_of_consciousness': loss_of_consciousness,
            'severe_bleeding': severe_bleeding,
            'confusion': confusion,
            'cardiac_history': cardiac_history,
            'diabetes': diabetes,
            'stroke_history': stroke_history,
            'severity': severity
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    df = generate_emergency_dataset(n_samples=3500)
    output_path = os.path.join('data', 'emergency_triage_data.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset successfully created at {output_path} with {len(df)} samples.")
    print("Class distribution:")
    print(df['severity'].value_counts(normalize=True))
