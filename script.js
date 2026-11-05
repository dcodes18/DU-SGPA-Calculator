/* =========================
   MODAL ELEMENTS
========================= */
const courseModal = document.querySelector(".course-modal");
const semesterModal = document.querySelector(".semester-modal");
const actionModal = document.querySelector(".action-modal");
const targetModal = document.querySelector(".target-modal");
const calculatorModal = document.querySelector(".calculator-modal");

/* =========================
   BUTTONS
========================= */
const estimatedSGPABtn = document.getElementById("estimatedSGPABtn");
const targetMarksBtn = document.getElementById("targetMarksBtn");
const courseButtons = document.querySelectorAll(".course-btn");
const semesterButtons = document.querySelectorAll(".semester-btn");
const targetButtons = document.querySelectorAll(".target-btn");

/* =========================
   CALCULATOR ELEMENTS
========================= */
const sgpaCell = document.querySelector(".sgpa-value");
const subjectRows = document.querySelectorAll(".subject-row");
const calculatorHeading = document.getElementById("calculator-heading");
const sgpaCard = document.getElementById("sgpa-card");

/* =========================
   USER SELECTIONS
========================= */
let selectedSemester = "";
let selectedCourse = "";
let targetGradePoint = "";
let calculatorMode = "";

/* =========================
   COURSE SELECTION
========================= */
courseButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedCourse = button.dataset.course;

    courseModal.classList.add("hidden");
    semesterModal.classList.remove("hidden");
  });
});

/* =========================
   SEMESTER SELECTION
========================= */
semesterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedSemester = button.dataset.semester;

    semesterModal.classList.add("hidden");
    actionModal.classList.remove("hidden");
  });
});

/* =========================
   ESTIMATED SGPA BUTTON
========================= */
estimatedSGPABtn.addEventListener("click", function() {
  calculatorMode = "estimate";
  targetGradePoint = "";

  actionModal.classList.add("hidden");
  targetModal.classList.add("hidden");
  calculatorModal.classList.remove("hidden");

  updateCalculator();
  calculateAllSubjects();
  calculateSGPA();
});

/* =========================
   TARGET SGPA BUTTON
========================= */
targetMarksBtn.addEventListener("click", function() {
  actionModal.classList.add("hidden");
  targetModal.classList.remove("hidden");
});

targetButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    targetGradePoint = Number(button.dataset.target);
    calculatorMode = "target";

    targetModal.classList.add("hidden");
    calculatorModal.classList.remove("hidden");

    updateCalculator();
    calculateTargetCombinations();
  });
});

/* =========================
   MARKS INPUT LISTENER
========================= */
document.addEventListener("input", function(event) {
  if (!event.target.matches(".marks-input")) return;

  const row = event.target.closest(".subject-row");
  if (!row) return;

  if (calculatorMode === "estimate") {
    calculateSubject(row);
    calculateSGPA();
  }

  if (calculatorMode === "target") {
    calculateTargetCombinations();
  }
});

/* =========================
   GRADE CALCULATOR
========================= */
function getGrade(percentage) {
  if (percentage >= 90) {
    return { gradePoint: 10, grade: "O" };
  }

  if (percentage >= 80) {
    return { gradePoint: 9, grade: "A+" };
  }

  if (percentage >= 70) {
    return { gradePoint: 8, grade: "A" };
  }

  if (percentage >= 60) {
    return { gradePoint: 7, grade: "B+" };
  }

  if (percentage >= 55) {
    return { gradePoint: 6, grade: "B" };
  }

  if (percentage >= 50) {
    return { gradePoint: 5, grade: "C" };
  }

  if (percentage >= 40) {
    return { gradePoint: 4, grade: "P" };
  }

  return { gradePoint: 0, grade: "F" };
}

/* =========================
   MARKS INPUT HELPER
========================= */
function getInputMarks(input) {
  const maximum = input.max === "" ? Infinity : Number(input.max);
  const entered = Number(input.value) || 0;

  return Math.min(Math.max(entered, 0), maximum);
}

/* =========================
   ESTIMATED SGPA CALCULATION
========================= */
function calculateSubject(row) {
  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");
  const theoryInput = row.querySelector(".theory-marks");

  const iaTotal =
    Number(row.querySelector(".ia-total").textContent) || 0;

  const practicalTotal =
    Number(row.querySelector(".practical-total").textContent) || 0;

  const theoryTotal =
    Number(row.querySelector(".theory-total").textContent) || 0;

  const iaMarks = getInputMarks(iaInput);
  const practicalMarks = getInputMarks(practicalInput);
  const theoryMarks = getInputMarks(theoryInput);

  // Keep entered marks within their allowed limits.
  if (Number(iaInput.value) > Number(iaInput.max)) {
    iaInput.value = iaInput.max;
  }

  if (Number(practicalInput.value) > Number(practicalInput.max)) {
    practicalInput.value = practicalInput.max;
  }

  if (Number(theoryInput.value) > Number(theoryInput.max)) {
    theoryInput.value = theoryInput.max;
  }

  const totalMarks = iaMarks + practicalMarks + theoryMarks;
  const maximumMarks = iaTotal + practicalTotal + theoryTotal;

  const percentage = maximumMarks > 0
    ? (totalMarks / maximumMarks) * 100
    : 0;

  const result = getGrade(percentage);

  row.querySelector(".subject-total").textContent =
    Number(totalMarks.toFixed(2)).toString();

  row.querySelector(".grade-points").textContent = result.gradePoint;
  row.querySelector(".grade").textContent = result.grade;
}

function calculateAllSubjects() {
  subjectRows.forEach(function(row) {
    if (row.style.display !== "none") {
      calculateSubject(row);
    }
  });
}

/* =========================
   SGPA CALCULATION
========================= */
function calculateSGPA() {
  let weightedSum = 0;
  let totalCredits = 0;

  subjectRows.forEach(function(row) {
    if (row.style.display === "none") return;

    const credits = Number(
      row.querySelector(".credit-row").textContent
    ) || 0;

    const gradePoint = Number(
      row.querySelector(".grade-points").textContent
    );

    weightedSum += credits *
      (Number.isFinite(gradePoint) ? gradePoint : 0);

    totalCredits += credits;
  });

  if (totalCredits === 0) {
    sgpaCell.textContent = "--";
    return;
  }

  sgpaCell.textContent = (weightedSum / totalCredits).toFixed(2);
}

/* =========================
   UPDATE A SUBJECT'S TOTALS
========================= */
function setSubjectTotals(row, ia, practical, theory) {
  const iaTotal = row.querySelector(".ia-total");
  const practicalTotal = row.querySelector(".practical-total");
  const theoryTotal = row.querySelector(".theory-total");

  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");
  const theoryInput = row.querySelector(".theory-marks");

  iaTotal.textContent = ia;
  practicalTotal.textContent = practical;
  theoryTotal.textContent = theory;

  iaInput.max = ia;
  practicalInput.max = practical;
  theoryInput.max = theory;

  // Clear marks when the marking scheme changes.
  iaInput.value = "";
  practicalInput.value = "";
  theoryInput.value = "";

  iaInput.disabled = ia === 0;
  practicalInput.disabled = practical === 0;
  theoryInput.disabled = theory === 0;

  row.querySelector(".subject-total").textContent = "--";
  row.querySelector(".grade-points").textContent = "--";
  row.querySelector(".grade").textContent = "--";
}

/* =========================
   DROPDOWN CHANGE LISTENER
========================= */
document.addEventListener("change", function(event) {
  const select = event.target;
  const row = select.closest(".subject-row");

  if (!row) return;

  if (select.matches(".sec-vac-type")) {
    if (select.value === "secprac" || select.value === "vacprac") {
      setSubjectTotals(row, 0, 80, 0);
    } else {
      setSubjectTotals(row, 10, 40, 30);
    }
  }

  else if (select.matches(".aec-subject")) {
    if (select.value === "hindi") {
      setSubjectTotals(row, 20, 0, 60);
    } else {
      setSubjectTotals(row, 10, 40, 30);
    }
  }

  else if (select.matches(".dse-ge-type")) {
    if (select.value === "gePractical") {
      setSubjectTotals(row, 20, 80, 60);
    } else {
      setSubjectTotals(row, 30, 40, 90);
    }
  }

  else if (select.matches(".subject-difficulty")) {
    // Difficulty affects ranking only, not grade calculations.
  }

  else {
    return;
  }

  if (calculatorMode === "estimate") {
    calculateSubject(row);
    calculateSGPA();
  }

  if (calculatorMode === "target") {
    calculateTargetCombinations();
  }
});

/* =========================
   CALCULATOR SETUP
========================= */
function updateCalculator() {
  calculatorModal.classList.toggle(
    "target-mode",
    calculatorMode === "target"
  );

  const row4 = document.getElementById("subject4");
  const row5 = document.getElementById("subject5");
  const row6 = document.getElementById("subject6");
  const row7 = document.getElementById("subject7");

  if (calculatorMode === "target") {
    calculatorHeading.textContent = "Target SGPA Calculator";
    sgpaCard.style.display = "none";
  } else {
    calculatorHeading.textContent = "Estimated SGPA Calculator";
    sgpaCard.style.display = "block";
  }

  document.querySelectorAll(
    ".total-column, .gp-column, .grade-column"
  ).forEach(function(item) {
    item.style.display = calculatorMode === "target" ? "none" : "";
  });

  // Semester 5 and 6
  if (selectedSemester === "5" || selectedSemester === "6") {
    row7.style.display = "none";

    row4.querySelector(".subject-type").textContent = "DSE";

    row5.querySelector(".subject-type").innerHTML = `
      <select class="dse-ge-type">
        <option value="" disabled selected>Select your type</option>
        <option value="geTheory">GE (Theory)</option>
        <option value="gePractical">GE (Theory + Practical)</option>
      </select>
    `;

    row5.querySelector(".credit-row").textContent = "4";
    row5.querySelector(".ia-total").textContent = "30";
    row5.querySelector(".practical-total").textContent = "40";
    row5.querySelector(".theory-total").textContent = "90";

    row5.querySelector(".ia-marks").max = 30;
    row5.querySelector(".practical-marks").max = 40;
    row5.querySelector(".theory-marks").max = 90;

    row6.querySelector(".subject-type").innerHTML = `
      <select class="sec-vac-type">
        <option value="" disabled selected>Select your type</option>
        <option value="secprac">SEC Practical</option>
        <option value="secnonprac">SEC Non-Practical</option>
      </select>
    `;
  }

  // Semester 3 and 4
  else if (selectedSemester === "3" || selectedSemester === "4") {
    row7.style.display = "";

    if (selectedCourse === "programme") {
      row4.querySelector(".subject-type").innerHTML = `
        <select class="dse-ge-type">
          <option value="" disabled selected>Select your type</option>
          <option value="geTheory">GE (Theory)</option>
          <option value="gePractical">GE (Theory + Practical)</option>
        </select>
      `;
    } else {
      row4.querySelector(".subject-type").innerHTML = `
        <select class="dse-ge-type">
          <option value="" disabled selected>Select your type</option>
          <option value="dse">DSE</option>
          <option value="ge">GE (Theory)</option>
          <option value="gePractical">GE (Theory + Practical)</option>
        </select>
      `;
    }
  }

  // Semester 1 and 2
  else {
    row7.style.display = "";

    row4.querySelector(".subject-type").innerHTML = `
      <select class="dse-ge-type">
        <option value="" disabled selected>Select your type</option>
        <option value="geTheory">GE (Theory)</option>
        <option value="gePractical">GE (Theory + Practical)</option>
      </select>
    `;
  }

  const resultsBox = document.getElementById("target-combinations");

  if (resultsBox && calculatorMode !== "target") {
    resultsBox.innerHTML = "";
  }
}

/* =========================
   TARGET SGPA: SUBJECT OPTIONS
========================= */
function getPossibleTheoryOptions(row) {
  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");

  const iaMarks = getInputMarks(iaInput);
  const practicalMarks = getInputMarks(practicalInput);

  const iaTotal =
    Number(row.querySelector(".ia-total").textContent) || 0;

  const practicalTotal =
    Number(row.querySelector(".practical-total").textContent) || 0;

  const theoryTotal =
    Number(row.querySelector(".theory-total").textContent) || 0;

  const maximumMarks = iaTotal + practicalTotal + theoryTotal;
  const internalMarks = iaMarks + practicalMarks;

  // Store the minimum theory mark needed for each achievable grade point.
  const optionsByGrade = new Map();
  const maximumCents = Math.round(theoryTotal * 100);

  // Theory papers require at least 40% of their maximum marks.
  // Subjects without a theory paper are exempt from this rule.
  const minimumTheoryCents = theoryTotal > 0
    ? Math.ceil(theoryTotal * 40)
    : 0;

  for (
    let cents = minimumTheoryCents;
    cents <= maximumCents;
    cents++
  ) {
    const theoryMarks = cents / 100;

    const percentage = maximumMarks > 0
      ? ((internalMarks + theoryMarks) / maximumMarks) * 100
      : 0;

    const gradePoint = getGrade(percentage).gradePoint;

    // Do not recommend an overall failing grade.
    if (gradePoint === 0) continue;

    // The first mark found for each grade point is the minimum for that GP.
    if (!optionsByGrade.has(gradePoint)) {
      optionsByGrade.set(gradePoint, {
        gradePoint,
        theoryMarks
      });
    }
  }

  const credits = Number(
    row.querySelector(".credit-row").textContent
  ) || 0;

  const nameElement = row.querySelector(".subject-name");
  let enteredName = "";

  if (nameElement) {
    if (nameElement.matches("input, select")) {
      enteredName = nameElement.value.trim();
    } else {
      const nameControl = nameElement.querySelector("input, select");

      enteredName = nameControl
        ? nameControl.value.trim()
        : nameElement.textContent.trim();
    }
  }

  const name = enteredName ||
    `Subject ${row.id.replace("subject", "")}`;

  const difficulty =
    row.querySelector(".subject-difficulty")?.value || "moderate";

  return {
    name,
    credits,
    difficulty,
    options: [...optionsByGrade.values()]
  };
}

/* =========================
   TARGET SGPA: DIFFICULTY RANKING
========================= */
function getDifficultyPenalty(difficulty, gradePoint) {
  // Lower penalty means a more preferred combination.
  // Difficult subjects are favored for lower GPs.
  // Easy subjects are favored for higher GPs.
  // Moderate subjects are kept close to the selected target GP.

  if (difficulty === "difficult") {
    return gradePoint * 2;
  }

  if (difficulty === "easy") {
    return (10 - gradePoint) * 2;
  }

  return Math.abs(gradePoint - Number(targetGradePoint));
}

/* =========================
   TARGET SGPA: COMBINATIONS
========================= */
function calculateTargetCombinations() {
  const resultsBox = document.getElementById("target-combinations");

  if (!resultsBox) return;

  resultsBox.innerHTML = "";

  if (calculatorMode !== "target" || !targetGradePoint) return;

  const rows = [...subjectRows].filter(function(row) {
    return row.style.display !== "none";
  });

  const subjects = rows
    .map(getPossibleTheoryOptions)
    .filter(subject => subject.credits > 0);

  if (subjects.some(subject => subject.options.length === 0)) {
    resultsBox.textContent =
      "No valid combination is possible because at least one subject " +
      "cannot achieve a passing overall grade while meeting the 40% " +
      "theory minimum. Check your IA and CA/practical marks.";

    return;
  }

  if (subjects.length === 0) {
    resultsBox.textContent = "No subjects available to calculate.";
    return;
  }

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  if (totalCredits <= 0) {
    resultsBox.textContent = "Could not calculate total credits.";
    return;
  }

  // Weighted grade points are stored multiplied by 100.
  let combinations = new Map();

  combinations.set(0, [{
    totalTheory: 0,
    preferencePenalty: 0,
    choices: []
  }]);

  const KEEP_PER_SCORE = 30;

  for (const subject of subjects) {
    const next = new Map();

    for (const [score, paths] of combinations) {
      for (const path of paths) {
        for (const option of subject.options) {
          const newScore =
            score + Math.round(
              subject.credits * option.gradePoint * 100
            );

          const candidate = {
            totalTheory: path.totalTheory + option.theoryMarks,

            preferencePenalty:
              path.preferencePenalty +
              getDifficultyPenalty(
                subject.difficulty,
                option.gradePoint
              ),

            choices: [
              ...path.choices,
              {
                name: subject.name,
                difficulty: subject.difficulty,
                theoryMarks: option.theoryMarks,
                gradePoint: option.gradePoint
              }
            ]
          };

          if (!next.has(newScore)) {
            next.set(newScore, []);
          }

          next.get(newScore).push(candidate);
        }
      }
    }

    // Retain multiple alternatives for each weighted score.
    for (const [score, paths] of next) {
      paths.sort((a, b) =>
        a.preferencePenalty - b.preferencePenalty ||
        a.totalTheory - b.totalTheory
      );

      next.set(score, paths.slice(0, KEEP_PER_SCORE));
    }

    combinations = next;
  }

  // The target is a minimum, not an exact SGPA.
  const requiredScore = targetGradePoint * totalCredits * 100;
  const valid = [];

  for (const [score, paths] of combinations) {
    if (score >= Math.ceil(requiredScore - 1e-8)) {
      for (const path of paths) {
        valid.push({
          sgpa: score / 100 / totalCredits,
          totalTheory: path.totalTheory,
          preferencePenalty: path.preferencePenalty,
          choices: path.choices
        });
      }
    }
  }

  if (valid.length === 0) {
    const maximumScore = Math.max(...combinations.keys());
    const maximumSGPA = maximumScore / 100 / totalCredits;

    const message = document.createElement("p");

    message.textContent =
      `Target not possible with these IA and CA/practical marks. ` +
      `Maximum possible SGPA: ${maximumSGPA.toFixed(2)}.`;

    resultsBox.appendChild(message);
    return;
  }

  // Prioritize subject difficulty, then the closest SGPA above target,
  // then lower combined theory marks.
  valid.sort((a, b) =>
    a.preferencePenalty - b.preferencePenalty ||
    (a.sgpa - Number(targetGradePoint)) -
      (b.sgpa - Number(targetGradePoint)) ||
    a.totalTheory - b.totalTheory
  );

  // Avoid duplicate combinations.
  const unique = [];
  const seen = new Set();

  for (const item of valid) {
    const key = item.choices
      .map(choice => `${choice.gradePoint}:${choice.theoryMarks}`)
      .join("|");

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }

    if (unique.length === 10) break;
  }

  // Results heading
  const heading = document.createElement("h3");

  heading.textContent =
    `Theory mark combinations for at least ` +
    `${Number(targetGradePoint).toFixed(2)} SGPA`;

  const note = document.createElement("p");

  note.textContent =
    "Up to 10 valid combinations are shown. They are ranked using " +
    "your subject difficulty choices, then by how closely they meet " +
    "the target SGPA. Each combination meets or exceeds your target. " +
    "GP means grade points; theory marks shown are the minimum needed " +
    "for that GP.";

  // Results table
  const table = document.createElement("table");
  table.className = "target-results-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  [
    "Combination",
    ...subjects.map(subject => subject.name),
    "SGPA",
    "Total theory marks"
  ].forEach(function(label) {
    const th = document.createElement("th");
    th.textContent = label;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  unique.forEach(function(item, index) {
    const tr = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);
    tr.appendChild(numberCell);

    item.choices.forEach(function(choice) {
      const td = document.createElement("td");

      td.textContent =
        `${choice.theoryMarks.toFixed(2)} marks ` +
        `(GP ${choice.gradePoint})`;

      tr.appendChild(td);
    });

    const sgpaCellResult = document.createElement("td");
    sgpaCellResult.textContent = item.sgpa.toFixed(2);
    tr.appendChild(sgpaCellResult);

    const totalCell = document.createElement("td");
    totalCell.textContent = item.totalTheory.toFixed(2);
    tr.appendChild(totalCell);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "target-results-wrapper";
  tableWrapper.appendChild(table);

  resultsBox.append(heading, note, tableWrapper);
}