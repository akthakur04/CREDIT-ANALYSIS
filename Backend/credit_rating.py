from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from models import Mortgage

def calculate_credit_rating(mortgage: Mortgage, db: Session):
    risk_score = 0

    # Loan-to-Value (LTV) Ratio: Avoid division by zero
    ltv = mortgage.loan_amount / mortgage.property_value if mortgage.property_value and mortgage.property_value != 0 else 0
    if ltv > 0.9:
        risk_score += 2
    elif ltv > 0.8:
        risk_score += 1

    # Debt-to-Income (DTI) Ratio: Avoid division by zero
    dti = mortgage.debt_amount / mortgage.annual_income if mortgage.annual_income and mortgage.annual_income != 0 else 0
    if dti > 0.5:
        risk_score += 2
    elif dti > 0.4:
        risk_score += 1

    if mortgage.credit_score >= 700:
        risk_score -= 1
    elif mortgage.credit_score < 650:
        risk_score += 1

    # Loan Type Check
    if mortgage.loan_type == "fixed":
        risk_score -= 1
    elif mortgage.loan_type == "adjustable":
        risk_score += 1  # Ensuring only adjustable-rate loans add risk

    # Property Type Check
    if mortgage.property_type == "condo":
        risk_score += 1

    # Average Credit Score from Database (avoid NoneType error)
    avg_credit_score = db.query(func.avg(Mortgage.credit_score)).scalar()
    avg_credit_score = avg_credit_score if avg_credit_score is not None else 0
    print(risk_score)

    if avg_credit_score >= 700:
        risk_score -= 1
    elif 500 <= avg_credit_score <= 650:
        risk_score += 2
    elif avg_credit_score < 500:
        risk_score += 3
    # Determine Credit Rating
    if risk_score <= 2:
        return "AAA"
    elif 3 <= risk_score <= 5:
        return "BBB"
    else:
        return "C"
