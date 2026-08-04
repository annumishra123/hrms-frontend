export const DEFAULT_RULES = {
    hraPercent: 0.40,
    conveyance: 1600,
    medicalAllowance: 1250,
    pfPercent: 0.12,
    pfWageCeiling: 15000,
    esiPercent: 0.0075,
    esiEligibilityCeiling: 21000,
    professionalTaxSlabs: [
      { upto: 7500, tax: 0 },
      { upto: 10000, tax: 175 },
      { upto: Infinity, tax: 200 },
    ],
  };
  
  function getProfessionalTax(gross, slabs) {
    const slab = slabs.find((s) => gross <= s.upto);
    return slab ? slab.tax : 0;
  }
  
  export function calculateSalary(employee, attendance, rules = DEFAULT_RULES) {
    const { basic } = employee;
    const { totalDays, presentDays, paidLeaves = 0 } = attendance;
  
    const hra = Math.round(basic * rules.hraPercent);
    const conveyance = rules.conveyance;
    const medical = rules.medicalAllowance;
    const grossSalary = basic + hra + conveyance + medical;
  
    const effectivePresentDays = Math.min(presentDays + paidLeaves, totalDays);
    const absentDays = Math.max(totalDays - effectivePresentDays, 0);
    const perDaySalary = grossSalary / totalDays;
    const lopDeduction = Math.round(perDaySalary * absentDays);
    const earnedGross = grossSalary - lopDeduction;
  
    const pfWage = Math.min(basic, rules.pfWageCeiling);
    const pf = Math.round(pfWage * rules.pfPercent);
  
    const esi =
      grossSalary <= rules.esiEligibilityCeiling
        ? Math.round(earnedGross * rules.esiPercent)
        : 0;
  
    const professionalTax = getProfessionalTax(earnedGross, rules.professionalTaxSlabs);
  
    const totalDeductions = pf + esi + professionalTax + lopDeduction;
    const netSalary = grossSalary - pf - esi - professionalTax - lopDeduction;
  
    return {
      empId: employee.id,
      basic, hra, conveyance, medical, grossSalary,
      absentDays, lopDeduction, earnedGross,
      pf, esi, professionalTax, totalDeductions,
      netSalary,
    };
  }
  
  export async function calculateBulkPayroll(
    employees,
    attendanceByEmpId,
    rules = DEFAULT_RULES,
    onProgress = () => {},
    chunkSize = 500
  ) {
    const results = [];
    const total = employees.length;
  
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = employees.slice(i, i + chunkSize);
  
      for (const emp of chunk) {
        const attendance = attendanceByEmpId[emp.id] ?? {
          totalDays: 30,
          presentDays: 30,
          paidLeaves: 0,
        };
        results.push(calculateSalary(emp, attendance, rules));
      }
  
      onProgress(Math.min(i + chunkSize, total), total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  
    return results;
  }