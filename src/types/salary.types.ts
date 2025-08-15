// Salary Calculator API Types - SALARY_API.md'ye göre

// Request Types
export interface SalaryCalculateRequest {
  grossSalary?: number
  netSalary?: number
  year?: number
  month?: number
  isMarried?: boolean
  dependentCount?: number
  isDisabled?: boolean
  disabilityDegree?: 1 | 2 | 3
}

export interface GrossToNetRequest {
  grossSalary: number
  year?: number
  month?: number
  isMarried?: boolean
  dependentCount?: number
  isDisabled?: boolean
  disabilityDegree?: 1 | 2 | 3
}

export interface NetToGrossRequest {
  netSalary: number
  year?: number
  month?: number
  maxIterations?: number
  precision?: number
  isMarried?: boolean
  dependentCount?: number
  isDisabled?: boolean
  disabilityDegree?: 1 | 2 | 3
}

// Response Types
export interface TaxBracket {
  minAmount: number
  maxAmount: number
  rate: number
  cumulativeTax: number
}

export interface SalaryBreakdown {
  taxableIncome: number
  appliedTaxBracket: TaxBracket
  minimumWageExemption: number
  minimumLivingAllowance: number
  effectiveTaxRate: number
}

export interface SalaryCalculationData {
  grossSalary: number
  netSalary: number
  sgkEmployeeShare: number
  unemploymentInsurance: number
  incomeTax: number
  stampTax: number
  totalDeductions: number
  employerCost: number
  employerSgkShare: number
  employerUnemploymentInsurance: number
  breakdown: SalaryBreakdown
}

export interface SalaryCalculationResponse {
  success: boolean
  data: SalaryCalculationData
  message?: string
}

// Salary Limits Types
export interface SalaryLimitsData {
  minGrossSalary: number
  maxGrossSalary: number
  minNetSalary: number
  maxNetSalary: number
}

export interface SalaryLimitsResponse {
  success: boolean
  data: SalaryLimitsData
  message?: string
}

// Tax Configuration Types
export interface SGKRates {
  employeeRate: number
  employerRate: number
  employerDiscountedRate: number
  unemploymentEmployeeRate: number
  unemploymentEmployerRate: number
  lowerLimit: number
  upperLimit: number
}

export interface MinimumWage {
  gross: number
  net: number
  daily: number
  hourly: number
}

export interface TaxConfigurationData {
  year: number
  brackets: TaxBracket[]
  sgkRates: SGKRates
  stampTaxRate: number
  minimumWage: MinimumWage
}

export interface TaxConfigurationResponse {
  success: boolean
  data: TaxConfigurationData
  message?: string
}

// Form Types
export interface SalaryFormData {
  calculationType: 'gross-to-net' | 'net-to-gross'
  amount: string
  year: number
  month: number
  isMarried: boolean
  dependentCount: number
  isDisabled: boolean
  disabilityDegree: 1 | 2 | 3
}

// Chart Data Types
export interface SalaryChartData {
  name: string
  amount: number
  percentage: number
  color: string
}

// Component State Types
export interface SalaryCalculatorState {
  formData: SalaryFormData
  result: SalaryCalculationData | null
  limits: SalaryLimitsData | null
  taxConfig: TaxConfigurationData | null
  loading: boolean
  error: string | null
}
