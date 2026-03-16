# BayesIQ Data Reliability Audit
**Run ID:** real_estate_month_3
**Generated:** 2026-03-16 06:31 UTC

## Dataset Overview

| Metric | Value |
|--------|-------|
| File | raw_month_3.csv |
| Rows | 3,030 |
| Columns | 19 |
| File Size | 343.0 KB |

## Data Quality Summary

**4 issues found**

- **High:** 3
- **Medium:** 1

## Executive Scorecard

### Data Reliability Score: 65 / 100

**Fair — significant data quality issues detected**

### Top Issues

1. **[HIGH]** vacancy_loss misreported for 2025-12 (off by +100.0%) (1 rows)
   - *Impact:* Reported vacancy_loss for 2025-12 is 5.1%, but recomputed value from raw events is 0.0%. Discrepancy of +100.0%.
2. **[HIGH]** Near-duplicate rows detected (60 rows)
   - *Impact:* Duplicate records inflate aggregations and distort metrics
3. **[HIGH]** Null values in required column: tenant_id (32 rows)
   - *Impact:* Null values in required fields break filters and aggregations
4. **[MEDIUM]** delinquency misreported for 2025-12 (off by -8.7%) (1 rows)
   - *Impact:* Reported delinquency for 2025-12 is 2.7%, but recomputed value from raw events is 2.9%. Discrepancy of -8.7%.

### Prioritized Remediation Plan

| # | Action | Owner | Effort |
|---|--------|-------|--------|
| 1 | Investigate root cause of vacancy_loss discrepancy for 2025-12. Check for duplicate events, missing data, or filter logic differences. | Data Engineering | M |
| 2 | Investigate duplicate records. Add dedup logic keyed on non-key fields. | Data Engineering | M |
| 3 | Fix null values in required column 'tenant_id' at the source. | Data Engineering | M |
| 4 | Investigate root cause of delinquency discrepancy for 2025-12. Check for duplicate events, missing data, or filter logic differences. | Data Engineering | S |

### Score Rationale

| Finding | Severity | Prevalence | Deduction |
|---------|----------|------------|-----------|
| vacancy_loss misreported for 2025-12 (off by +100.0%) | high | low (0.0%) | -8 |
| Near-duplicate rows detected | high | medium (2.0%) | -12 |
| Null values in required column: tenant_id | high | medium (1.1%) | -12 |
| delinquency misreported for 2025-12 (off by -8.7%) | medium | low (0.0%) | -3 |

## Findings

### 1. [HIGH] vacancy_loss misreported for 2025-12 (off by +100.0%)

Reported vacancy_loss for 2025-12 is 5.1%, but recomputed value from raw events is 0.0%. Discrepancy of +100.0%.

- **Rows affected:** 1
- **Examples:** {metric: vacancy_loss, period: 2025-12, reported: 0.0514, recomputed: 0.0, discrepancy_pct: 100.0}

**Recommended fix:** Investigate root cause of vacancy_loss discrepancy for 2025-12. Check for duplicate events, missing data, or filter logic differences.

### 2. [HIGH] Near-duplicate rows detected

60 near-duplicate rows detected (identical on all fields except key columns). This suggests duplicate ingestion or recording.

- **Rows affected:** 60
- **Columns:** `unit_id`, `tenant_id`, `property_id`, `unit_type`, `lease_type`, `payment_method`, `payment_date`, `due_date`, `amount_due`, `amount_paid`, `late_fee`, `days_late`, `delinquent_flag`, `vacancy_flag`, `payment_flag`, `billed_flag`, `collected_flag`, `late_flag`
- **Examples:** `95`, `149`, `366`, `564`, `630` ... and 5 more

**Recommended fix:** Investigate duplicate records. Add dedup logic keyed on non-key fields.

### 3. [HIGH] Null values in required column: tenant_id

Required column 'tenant_id' has 32 null values.

- **Rows affected:** 32
- **Columns:** `tenant_id`
- **Examples:** `36`, `114`, `152`, `168`, `360` ... and 5 more

**Recommended fix:** Fix null values in required column 'tenant_id' at the source.

### 4. [MEDIUM] delinquency misreported for 2025-12 (off by -8.7%)

Reported delinquency for 2025-12 is 2.7%, but recomputed value from raw events is 2.9%. Discrepancy of -8.7%.

- **Rows affected:** 1
- **Examples:** {metric: delinquency, period: 2025-12, reported: 0.0266, recomputed: 0.0289, discrepancy_pct: -8.7}

**Recommended fix:** Investigate root cause of delinquency discrepancy for 2025-12. Check for duplicate events, missing data, or filter logic differences.

## Column Profile Summary

| Column | Type | Null Rate | Unique | Cardinality |
|--------|------|-----------|--------|-------------|
| payment_id | str | 0.0% | 3030 | 1.00 |
| unit_id | str | 0.0% | 1090 | 0.36 |
| tenant_id | str | 1.1% | 2926 | 0.98 |
| property_id | str | 0.0% | 4 | 0.00 |
| unit_type | str | 0.0% | 4 | 0.00 |
| lease_type | str | 0.0% | 3 | 0.00 |
| payment_method | str | 0.0% | 4 | 0.00 |
| payment_date | datetime64[us, UTC] | 5.2% | 10 | 0.00 |
| due_date | datetime64[us, UTC] | 0.0% | 1 | 0.00 |
| amount_due | float64 | 0.0% | 2921 | 0.96 |
| amount_paid | float64 | 0.0% | 2787 | 0.92 |
| late_fee | float64 | 0.0% | 6 | 0.00 |
| days_late | int64 | 0.0% | 10 | 0.00 |
| delinquent_flag | int64 | 0.0% | 2 | 0.00 |
| vacancy_flag | int64 | 0.0% | 2 | 0.00 |
| payment_flag | int64 | 0.0% | 2 | 0.00 |
| billed_flag | int64 | 0.0% | 1 | 0.00 |
| collected_flag | int64 | 0.0% | 2 | 0.00 |
| late_flag | int64 | 0.0% | 2 | 0.00 |

## Recommended Next Steps

See the **Prioritized Remediation Plan** above for detailed actions with owners and effort estimates.

---
*Generated by BayesIQ Data Audit Kit*