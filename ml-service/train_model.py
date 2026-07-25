import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib

# Load the dataset
df = pd.read_csv('data.csv')
print("Shape:", df.shape)

# Select the same 7 interpretable features as before
selected_features = [
    ' ROA(C) before interest and depreciation before interest',
    ' Operating Gross Margin',
    ' Current Ratio',
    ' Quick Ratio',
    ' Debt ratio %',
    ' Net Income to Total Assets',
    ' Working Capital to Total Assets',
]

X = df[selected_features]
y = df['Bankrupt?']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the base model
base_model = LogisticRegression(class_weight='balanced', random_state=42)

# Wrap it with calibration so predict_proba gives trustworthy percentages
model = CalibratedClassifierCV(base_model, method='sigmoid', cv=5)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Not Bankrupt', 'Bankrupt']))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nROC-AUC Score:", roc_auc_score(y_test, y_pred_proba))

# Save the model and scaler
joblib.dump(model, 'risk_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("\nModel and scaler saved successfully (calibrated)!")

# Sanity check: test on a real known non-bankrupt example
sample = df[df['Bankrupt?'] == 0][selected_features].iloc[0].values.reshape(1, -1)
sample_scaled = scaler.transform(sample)
sample_risk = model.predict_proba(sample_scaled)[0][1]
print(f"\nSanity check - known non-bankrupt company risk score: {sample_risk * 100:.2f}%")

# Second sanity check: a known BANKRUPT company, should show HIGH risk
sample_bankrupt = df[df['Bankrupt?'] == 1][selected_features].iloc[0].values.reshape(1, -1)
sample_bankrupt_scaled = scaler.transform(sample_bankrupt)
sample_bankrupt_risk = model.predict_proba(sample_bankrupt_scaled)[0][1]
print(f"Sanity check - known BANKRUPT company risk score: {sample_bankrupt_risk * 100:.2f}%")

# Check the distribution of risk scores across the whole test set
all_test_scores = model.predict_proba(X_test_scaled)[:, 1] * 100
print(f"\nScore distribution across test set:")
print(f"Min: {all_test_scores.min():.2f}%")
print(f"25th percentile: {np.percentile(all_test_scores, 25):.2f}%")
print(f"Median: {np.percentile(all_test_scores, 50):.2f}%")
print(f"75th percentile: {np.percentile(all_test_scores, 75):.2f}%")
print(f"90th percentile: {np.percentile(all_test_scores, 90):.2f}%")
print(f"Max: {all_test_scores.max():.2f}%")

# Also show average score split by actual outcome, for calibration sanity
print(f"\nAverage score for actually non-bankrupt companies: {all_test_scores[y_test == 0].mean():.2f}%")
print(f"Average score for actually bankrupt companies: {all_test_scores[y_test == 1].mean():.2f}%")

# Test 5 non-bankrupt and 5 bankrupt companies individually, to see spread
print("\n--- Sample of 5 non-bankrupt companies ---")
non_bankrupt_samples = df[df['Bankrupt?'] == 0][selected_features].iloc[0:5]
non_bankrupt_scaled = scaler.transform(non_bankrupt_samples)
print(model.predict_proba(non_bankrupt_scaled)[:, 1] * 100)

print("\n--- Sample of 5 bankrupt companies ---")
bankrupt_samples = df[df['Bankrupt?'] == 1][selected_features].iloc[0:5]
bankrupt_scaled = scaler.transform(bankrupt_samples)
print(model.predict_proba(bankrupt_scaled)[:, 1] * 100)