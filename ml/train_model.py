"""
Model Training and Evaluation Pipeline for Emergency Severity Prediction.
Uses scikit-learn RandomForestClassifier with comprehensive metrics generation.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

FEATURE_COLS = [
    'age',
    'gender_male',
    'heart_rate',
    'systolic_bp',
    'diastolic_bp',
    'spo2',
    'temperature',
    'respiratory_rate',
    'chest_pain',
    'breathing_difficulty',
    'dizziness',
    'loss_of_consciousness',
    'severe_bleeding',
    'confusion',
    'cardiac_history',
    'diabetes',
    'stroke_history'
]

SEVERITY_CLASSES = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

def preprocess_dataframe(df: pd.DataFrame):
    df_clean = df.copy()
    if 'gender_male' not in df_clean.columns:
        df_clean['gender_male'] = (df_clean['gender'].str.lower() == 'male').astype(int)
    X = df_clean[FEATURE_COLS]
    y = df_clean['severity']
    return X, y

def train_and_evaluate():
    data_path = os.path.join('data', 'emergency_triage_data.csv')
    if not os.path.exists(data_path):
        from generate_dataset import generate_emergency_dataset
        df = generate_emergency_dataset(3500)
        os.makedirs('data', exist_ok=True)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)

    X, y = preprocess_dataframe(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=150,
        max_depth=14,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42
    )

    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_proba = clf.predict_proba(X_test)

    acc = float(accuracy_score(y_test, y_pred))
    prec_macro = float(precision_score(y_test, y_pred, average='macro'))
    rec_macro = float(recall_score(y_test, y_pred, average='macro'))
    f1_macro = float(f1_score(y_test, y_pred, average='macro'))
    
    prec_weighted = float(precision_score(y_test, y_pred, average='weighted'))
    rec_weighted = float(recall_score(y_test, y_pred, average='weighted'))
    f1_weighted = float(f1_score(y_test, y_pred, average='weighted'))

    # Per class metrics
    class_rep = classification_report(y_test, y_pred, output_dict=True, target_names=SEVERITY_CLASSES)
    cm = confusion_matrix(y_test, y_pred, labels=SEVERITY_CLASSES).tolist()

    # Feature importances
    feature_importances = []
    for col, imp in zip(FEATURE_COLS, clf.feature_importances_):
        readable_name = col.replace('_', ' ').title()
        feature_importances.append({
            'feature': col,
            'name': readable_name,
            'importance': round(float(imp), 4),
            'importance_pct': round(float(imp) * 100, 2)
        })
    feature_importances.sort(key=lambda x: x['importance'], reverse=True)

    metadata = {
        'model_name': 'RandomForestClassifier (Triage Ensemble)',
        'framework': 'scikit-learn',
        'n_estimators': 150,
        'dataset_type': 'Synthetic Clinical Decision Dataset (Triage/ESI Guideline Modeled)',
        'dataset_notice': 'Synthetic data generated for software prototype demonstration and educational evaluation.',
        'total_samples': len(df),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'classes': SEVERITY_CLASSES,
        'features': FEATURE_COLS,
        'accuracy': round(acc, 4),
        'precision_macro': round(prec_macro, 4),
        'recall_macro': round(rec_macro, 4),
        'f1_macro': round(f1_macro, 4),
        'precision_weighted': round(prec_weighted, 4),
        'recall_weighted': round(rec_weighted, 4),
        'f1_weighted': round(f1_weighted, 4),
        'confusion_matrix': cm,
        'classification_report': class_rep,
        'feature_importances': feature_importances
    }

    os.makedirs('models', exist_ok=True)
    model_file = os.path.join('models', 'severity_model.joblib')
    joblib.dump(clf, model_file)

    meta_file = os.path.join('models', 'model_metadata.json')
    with open(meta_file, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"Model trained successfully!")
    print(f"Accuracy: {acc:.4f}, F1-Macro: {f1_macro:.4f}")
    print(f"Model saved to {model_file}")
    print(f"Metadata saved to {meta_file}")

if __name__ == '__main__':
    train_and_evaluate()
