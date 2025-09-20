import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
df = pd.read_csv("dataset/pandemic_data.csv")


X = df[["Population", "Death Rate (%)", "Hospital Admission"]]
y = df["Pandemic/Diseased Total"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

joblib.dump(model, "models/disease_model.pkl")
score = model.score(X_test, y_test)
print(f"Model R^2 score: {score:.2f}")
