/* =====================================================
   DU SGPA CALCULATOR
   Supports Semesters I-VIII
===================================================== */

/* ---------- Modal Elements ---------- */

const courseModal = document.querySelector(".course-modal");
const semesterModal = document.querySelector(".semester-modal");
const trackModal = document.querySelector(".track-modal");
const actionModal = document.querySelector(".action-modal");
const targetModal = document.querySelector(".target-modal");
const calculatorModal = document.querySelector(".calculator-modal");

/* ---------- Buttons ---------- */

const courseButtons = document.querySelectorAll(".course-btn");
const semesterButtons = document.querySelectorAll(".semester-btn");
const trackButtons = document.querySelectorAll(".track-btn");
const targetButtons = document.querySelectorAll(".target-btn");

const estimatedSGPABtn = document.getElementById("estimatedSGPABtn");
const targetMarksBtn = document.getElementById("targetMarksBtn");

/* ---------- Calculator Elements ---------- */

const subjectsBody = document.getElementById("subjects-body");
const sgpaCell = document.querySelector(".sgpa-value");
const sgpaCard = document.getElementById("sgpa-card");
const calculatorHeading = document.getElementById("calculator-heading");

const resultsBox = document.getElementById("target-combinations");

const iaTotalHeading = document.getElementById("ia-total-heading");
const iaMarksHeading = document.getElementById("ia-marks-heading");

/* ---------- User Selections ---------- */

let selectedSemester = "";
let selectedCourse = "";
let selectedTrack = "";

let targetGradePoint = "";
let calculatorMode = "";
let targetModel = "difficulty";

/* =====================================================
   SUBJECT ROW GENERATION
===================================================== */

function createSubjectRow(index) {
  const row = document.createElement("tr");

  row.className = "subject-row";
  row.id = `subject${index}`;

  row.innerHTML = `
    <td>${index}</td>

    <td>
      <input
        class="subject-name"
        type="text"
        placeholder="Subject Name"
      >
    </td>

    <td class="subject-type">DSC</td>

    <td class="credit-row">4</td>

    <td class="ia-total">30</td>

    <td>
      <input
        class="marks-input ia-marks"
        type="number"
        min="0"
        max="30"
        step="0.01"
        placeholder="0"
      >
    </td>

    <td class="practical-total practical-column">40</td>

    <td class="practical-column">
      <input
        class="marks-input practical-marks"
        type="number"
        min="0"
        max="40"
        step="0.01"
        placeholder="0"
      >
    </td>

    <td class="theory-total theory-total-column">90</td>

    <td class="theory-marks-column">
      <input
        class="marks-input theory-marks"
        type="number"
        min="0"
        max="90"
        step="0.01"
        placeholder="0"
      >
    </td>

    <td class="difficulty-column">
      <select class="subject-difficulty">
        <option value="difficult">Difficult</option>
        <option value="moderate" selected>Moderate</option>
        <option value="easy">Easy</option>
      </select>
    </td>

    <td class="grade-cap-column">
      <select class="subject-max-gp">
        <option value="">No limit</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </td>

    <td class="subject-total total-column">--</td>

    <td class="grade-points gp-column">--</td>

    <td class="grade grade-column">--</td>
  `;

  return row;
}

/* Create seven rows for the calculator. */

for (let i = 1; i <= 7; i++) {
  subjectsBody.appendChild(createSubjectRow(i));
}

const subjectRows = document.querySelectorAll(".subject-row");

/* =====================================================
   TARGET MODEL UI
===================================================== */

function setupTargetModelUI() {
  const tableContainer = document.querySelector(".table-container");

  const modelControls = document.createElement("div");

  modelControls.className = "target-model-controls";

  modelControls.innerHTML = `
    <h3>Choose your target model</h3>

    <button
      type="button"
      class="target-model-btn active"
      data-model="difficulty"
    >
      Difficulty-Based Model
    </button>

    <button
      type="button"
      class="target-model-btn"
      data-model="grade-point"
    >
      Grade Point-Based Model
    </button>
  `;

  tableContainer.parentNode.insertBefore(
    modelControls,
    tableContainer
  );
}

setupTargetModelUI();

/* ---------- Target Model Button Listener ---------- */

document.addEventListener("click", function(event) {
  const button = event.target.closest(".target-model-btn");

  if (!button) return;

  targetModel = button.dataset.model;

  document.querySelectorAll(".target-model-btn").forEach(function(item) {
    item.classList.toggle("active", item === button);
  });

  calculatorModal.classList.toggle(
    "grade-point-model",
    targetModel === "grade-point"
  );

  calculateTargetCombinations();
});

/* =====================================================
   COURSE SELECTION
===================================================== */

courseButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedCourse = button.dataset.course;

    courseModal.classList.add("hidden");
    semesterModal.classList.remove("hidden");
  });
});

/* =====================================================
   SEMESTER SELECTION
===================================================== */

semesterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedSemester = button.dataset.semester;

    semesterModal.classList.add("hidden");

    /*
      Programme students choosing Semester VII or VIII
      must select their fourth-year track.
    */

    if (
      selectedCourse === "programme" &&
      (selectedSemester === "7" || selectedSemester === "8")
    ) {
      trackModal.classList.remove("hidden");
    } else {
      trackModal.classList.add("hidden");
      actionModal.classList.remove("hidden");
    }
  });
});

/* =====================================================
   FOURTH-YEAR TRACK SELECTION
===================================================== */

trackButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedTrack = button.dataset.track;

    trackModal.classList.add("hidden");
    actionModal.classList.remove("hidden");
  });
});

/* =====================================================
   ACTION SELECTION
===================================================== */

estimatedSGPABtn.addEventListener("click", function() {
  calculatorMode = "estimate";
  targetGradePoint = "";

  actionModal.classList.add("hidden");
  targetModal.classList.add("hidden");

  calculatorModal.classList.remove("hidden");

  targetModel = "difficulty";

  updateCalculator();
  calculateAllSubjects();
  calculateSGPA();
});

targetMarksBtn.addEventListener("click", function() {
  actionModal.classList.add("hidden");
  targetModal.classList.remove("hidden");
});

/* =====================================================
   TARGET SGPA SELECTION
===================================================== */

targetButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    targetGradePoint = Number(button.dataset.target);

    calculatorMode = "target";
    targetModel = "difficulty";

    document.querySelectorAll(".target-model-btn").forEach(function(item) {
      item.classList.toggle(
        "active",
        item.dataset.model === "difficulty"
      );
    });

    targetModal.classList.add("hidden");
    calculatorModal.classList.remove("hidden");

    updateCalculator();
    calculateTargetCombinations();
  });
});

/* =====================================================
   GRADE CALCULATOR
===================================================== */

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

  if (percentage >= 50) {
    return { gradePoint: 6, grade: "B" };
  }

  if (percentage >= 40) {
    return { gradePoint: 5, grade: "C" };
  }

  if (percentage >= 30) {
    return { gradePoint: 4, grade: "D" };
  }

  return { gradePoint: 0, grade: "F" };
}

/* =====================================================
   MARKS INPUT HELPER
===================================================== */

function getInputMarks(input) {
  if (!input) return 0;

  const maximum = input.max === ""
    ? Infinity
    : Number(input.max);

  const entered = Number(input.value) || 0;

  return Math.min(
    Math.max(entered, 0),
    maximum
  );
}

/* =====================================================
   SUBJECT CONFIGURATION HELPERS
===================================================== */

function getRow(index) {
  return document.getElementById(`subject${index}`);
}

function setType(row, content) {
  row.querySelector(".subject-type").innerHTML = content;
}

function setCredits(row, credits) {
  row.querySelector(".credit-row").textContent = credits;
}

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

function resetRow(row) {
  row.style.display = "";

  row.dataset.component = "paper";

  /*
    Restore the normal subject-name input if this row was
    previously used for the fourth-year project dropdown.
    This prevents the project dropdown from carrying over
    when the user switches to another semester or track.
  */

  const subjectName = row.querySelector(".subject-name");

  if (subjectName && subjectName.matches(".project-type")) {
    subjectName.outerHTML = `
      <input
        class="subject-name"
        type="text"
        placeholder="Subject Name"
      >
    `;
  }

  row.querySelector(".subject-name").value = "";

  setType(row, "DSC");
  setCredits(row, 4);
  setSubjectTotals(row, 30, 40, 90);

  row.querySelector(".subject-difficulty").value = "moderate";
  row.querySelector(".subject-max-gp").value = "";
}

/* ---------- DSE / GE Dropdown ---------- */

function dseGeDropdown(includeDSE = true) {
  return `
    <select class="dse-ge-type">
      <option value="" disabled selected>Select your type</option>
      ${includeDSE ? '<option value="dse">DSE</option>' : ""}
      <option value="geTheory">GE (Theory)</option>
      <option value="gePractical">GE (Theory + Practical)</option>
    </select>
  `;
}

/* ---------- SEC / VAC Dropdown ---------- */

function secVacDropdown(type = "SEC") {
  const prefix = type.toLowerCase();

  return `
    <select class="sec-vac-type">
      <option value="" disabled selected>Select your type</option>
      <option value="${prefix}prac">${type} Practical</option>
      <option value="${prefix}nonprac">${type} Non-Practical</option>
    </select>
  `;
}

/* =====================================================
   SEMESTER I-IV CONFIGURATION
===================================================== */

function configureSemestersOneToFour() {
  const isProgramme = selectedCourse === "programme";

  /* Rows 1-3: DSC */

  for (let i = 1; i <= 3; i++) {
    const row = getRow(i);

    setType(row, "DSC");
    setCredits(row, 4);
    setSubjectTotals(row, 30, 40, 90);
  }

  /* Row 4: GE / DSE */

  const row4 = getRow(4);

  if (selectedSemester === "1" || selectedSemester === "2") {
    setType(row4, dseGeDropdown(false));
  } else if (isProgramme) {
    setType(row4, dseGeDropdown(false));
  } else {
    setType(row4, dseGeDropdown(true));
  }

  setCredits(row4, 4);
  setSubjectTotals(row4, 30, 40, 90);

  /* Row 5: SEC */

  const row5 = getRow(5);

  setType(row5, secVacDropdown("SEC"));
  setCredits(row5, 2);
  setSubjectTotals(row5, 10, 40, 30);

  /* Row 6: VAC */

  const row6 = getRow(6);

  setType(row6, secVacDropdown("VAC"));
  setCredits(row6, 2);
  setSubjectTotals(row6, 10, 40, 30);

  /* Row 7: AEC */

  const row7 = getRow(7);

  row7.querySelector(".subject-name").outerHTML = `
    <select class="subject-name aec-subject">
      <option value="" disabled selected>Subject Name</option>
      <option value="evs">EVS</option>
      <option value="hindi">Hindi</option>
    </select>
  `;

  setType(row7, "AEC");
  setCredits(row7, 2);
  setSubjectTotals(row7, 10, 40, 30);

  if (
    selectedSemester === "3" ||
    selectedSemester === "4"
  ) {
    row7.style.display = "";
  } else {
    row7.style.display = "";
  }
}

/* =====================================================
   SEMESTER V-VI CONFIGURATION
===================================================== */

function configureSemestersFiveAndSix() {
  /* Rows 1-3: DSC */

  for (let i = 1; i <= 3; i++) {
    const row = getRow(i);

    setType(row, "DSC");
    setCredits(row, 4);
    setSubjectTotals(row, 30, 40, 90);
  }

  /* Row 4: Compulsory DSE */

  const row4 = getRow(4);

  setType(row4, "DSE");
  setCredits(row4, 4);
  setSubjectTotals(row4, 30, 40, 90);

  /* Row 5: GE */

  const row5 = getRow(5);

  setType(row5, dseGeDropdown(false));
  setCredits(row5, 4);
  setSubjectTotals(row5, 30, 40, 90);

  /* Row 6: SEC */

  const row6 = getRow(6);

  setType(row6, secVacDropdown("SEC"));
  setCredits(row6, 2);
  setSubjectTotals(row6, 10, 40, 30);

  /* Row 7 is not used */

  getRow(7).style.display = "none";
}

/* =====================================================
   FOURTH YEAR: ACADEMIC TRACK
===================================================== */

function configureProjectDropdown(projectRow) {
  const subjectName = projectRow.querySelector(".subject-name");

  /* Avoid replacing the dropdown if this function runs again. */
  if (!subjectName || subjectName.matches(".project-type")) {
    return;
  }

  subjectName.outerHTML = `
    <select
      class="subject-name project-type"
      aria-label="Select Research / Project / Entrepreneurship component"
    >
      <option value="" selected disabled>Select component</option>
      <option value="Dissertation">Dissertation</option>
      <option value="Academic Project">Academic Project</option>
      <option value="Entrepreneurship">Entrepreneurship</option>
    </select>
  `;
}

function configureAcademicTrack() {
  /*
    Row 1: Dissertation / Academic Project / Entrepreneurship
    10 credits, 400 marks.

    The marks are entered in the first marks field.
    There is no IA, practical or theory division.
  */

  const projectRow = getRow(1);

  configureProjectDropdown(projectRow);

  projectRow.dataset.component = "project";

  setType(projectRow, "Project");
  setCredits(projectRow, 10);
  setSubjectTotals(projectRow, 400, 0, 0);

  /* Row 2: Compulsory DSE */

  const compulsoryDSE = getRow(2);

  setType(compulsoryDSE, "DSE");
  setCredits(compulsoryDSE, 4);
  setSubjectTotals(compulsoryDSE, 30, 40, 90);

  /* Rows 3 and 4: Independently selectable DSE / GE */

  for (let i = 3; i <= 4; i++) {
    const row = getRow(i);

    setType(row, dseGeDropdown(true));
    setCredits(row, 4);
    setSubjectTotals(row, 30, 40, 90);
  }

  /* Hide unused rows */

  for (let i = 5; i <= 7; i++) {
    getRow(i).style.display = "none";
  }

  iaTotalHeading.textContent = "IA / Project Total";
  iaMarksHeading.textContent = "IA / Project Marks Scored";
}

/* =====================================================
   FOURTH YEAR: COURSEWORK + SKILL-BASED TRACK
===================================================== */

function configureCourseworkTrack() {
  /* Row 1: DSC */

  const row1 = getRow(1);

  setType(row1, "DSC");
  setCredits(row1, 4);
  setSubjectTotals(row1, 30, 40, 90);

  /* Rows 2-5: Four independently selectable DSE / GE papers */

  for (let i = 2; i <= 5; i++) {
    const row = getRow(i);

    setType(row, dseGeDropdown(true));
    setCredits(row, 4);
    setSubjectTotals(row, 30, 40, 90);
  }

  /* Row 6: SEC */

  const row6 = getRow(6);

  setType(row6, secVacDropdown("SEC"));
  setCredits(row6, 2);
  setSubjectTotals(row6, 10, 40, 30);

  /* Row 7 is not used */

  getRow(7).style.display = "none";

  iaTotalHeading.textContent = "IA Total";
  iaMarksHeading.textContent = "IA Marks Scored";
}

/* =====================================================
   CALCULATOR SETUP
===================================================== */

function updateCalculator() {
  calculatorModal.classList.toggle(
    "target-mode",
    calculatorMode === "target"
  );

  calculatorModal.classList.toggle(
    "grade-point-model",
    calculatorMode === "target" &&
    targetModel === "grade-point"
  );

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
    item.style.display =
      calculatorMode === "target" ? "none" : "";
  });

  /* Reset all rows before configuring the selected semester. */

  subjectRows.forEach(function(row) {
    resetRow(row);
  });

  iaTotalHeading.textContent = "IA Total";
  iaMarksHeading.textContent = "IA Marks Scored";

  /* Semester I-IV */

  if (
    selectedSemester === "1" ||
    selectedSemester === "2" ||
    selectedSemester === "3" ||
    selectedSemester === "4"
  ) {
    configureSemestersOneToFour();
  }

  /* Semester V-VI */

  else if (
    selectedSemester === "5" ||
    selectedSemester === "6"
  ) {
    configureSemestersFiveAndSix();
  }

  /* Semester VII-VIII */

  else if (
    selectedSemester === "7" ||
    selectedSemester === "8"
  ) {
    if (
      selectedCourse === "honours" ||
      selectedTrack === "academic"
    ) {
      configureAcademicTrack();
    } else {
      configureCourseworkTrack();
    }
  }

  /* Clear old target results when switching to estimated mode. */

  if (calculatorMode !== "target") {
    resultsBox.innerHTML = "";
  }
}

/* =====================================================
   ESTIMATED SGPA: SUBJECT CALCULATION
===================================================== */

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

  /* Keep entered marks within their allowed limits. */

  if (Number(iaInput.value) > Number(iaInput.max)) {
    iaInput.value = iaInput.max;
  }

  if (Number(practicalInput.value) > Number(practicalInput.max)) {
    practicalInput.value = practicalInput.max;
  }

  if (Number(theoryInput.value) > Number(theoryInput.max)) {
    theoryInput.value = theoryInput.max;
  }

  const totalMarks =
    iaMarks + practicalMarks + theoryMarks;

  const maximumMarks =
    iaTotal + practicalTotal + theoryTotal;

  const percentage = maximumMarks > 0
    ? (totalMarks / maximumMarks) * 100
    : 0;

  const result = getGrade(percentage);

  row.querySelector(".subject-total").textContent =
    Number(totalMarks.toFixed(2)).toString();

  row.querySelector(".grade-points").textContent =
    result.gradePoint;

  row.querySelector(".grade").textContent =
    result.grade;
}

function calculateAllSubjects() {
  subjectRows.forEach(function(row) {
    if (row.style.display !== "none") {
      calculateSubject(row);
    }
  });
}

/* =====================================================
   SGPA CALCULATION
===================================================== */

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

  sgpaCell.textContent =
    (weightedSum / totalCredits).toFixed(2);
}

/* =====================================================
   DROPDOWN CHANGE LISTENER
===================================================== */

document.addEventListener("change", function(event) {
  const select = event.target;

  const row = select.closest(".subject-row");

  if (!row) return;

  if (select.matches(".sec-vac-type")) {
    if (
      select.value === "secprac" ||
      select.value === "vacprac"
    ) {
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

  else if (
    select.matches(".subject-difficulty") ||
    select.matches(".subject-max-gp") ||
    select.matches(".project-type")
  ) {
    // Project type only changes the component name.
    // It does not change the 400-mark structure.
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

/* =====================================================
   MARKS INPUT LISTENER
===================================================== */

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

/* =====================================================
   SUBJECT NAME HELPER
===================================================== */

function getSubjectName(row) {
  const nameElement = row.querySelector(".subject-name");

  let enteredName = "";

  if (nameElement) {
    enteredName = nameElement.value.trim();
  }

  return enteredName ||
    `Subject ${row.id.replace("subject", "")}`;
}

/* =====================================================
   TARGET SGPA: SUBJECT OPTIONS
===================================================== */

function getPossibleOptions(row) {
  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");
  const theoryInput = row.querySelector(".theory-marks");

  const iaMarks = getInputMarks(iaInput);
  const practicalMarks = getInputMarks(practicalInput);

  const iaTotal =
    Number(row.querySelector(".ia-total").textContent) || 0;

  const practicalTotal =
    Number(row.querySelector(".practical-total").textContent) || 0;

  const theoryTotal =
    Number(row.querySelector(".theory-total").textContent) || 0;

  const credits = Number(
    row.querySelector(".credit-row").textContent
  ) || 0;

  const name = getSubjectName(row);

  const difficulty =
    row.querySelector(".subject-difficulty")?.value ||
    "moderate";

  const maxGradePointValue =
    row.querySelector(".subject-max-gp")?.value || "";

  const maxGradePoint = maxGradePointValue
    ? Number(maxGradePointValue)
    : null;

  const optionsByGrade = new Map();

  /*
    PROJECT COMPONENT

    The project is a single 400-mark component.
    It is not divided into IA, practical or theory.

    The first marks field is used for the project marks.
  */

  if (row.dataset.component === "project") {
    const maximumCents = Math.round(iaTotal * 100);

    for (let cents = 0; cents <= maximumCents; cents++) {
      const projectMarks = cents / 100;

      const percentage = iaTotal > 0
        ? (projectMarks / iaTotal) * 100
        : 0;

      const gradePoint = getGrade(percentage).gradePoint;

      if (gradePoint === 0) continue;

      if (!optionsByGrade.has(gradePoint)) {
        optionsByGrade.set(gradePoint, {
          gradePoint,
          marks: projectMarks,
          marksLabel: `${projectMarks.toFixed(2)} / ${iaTotal}`
        });
      }
    }
  }

  /*
    NORMAL THEORY / PRACTICAL COMPONENTS
  */

  else {
    const maximumMarks =
      iaTotal + practicalTotal + theoryTotal;

    const internalMarks =
      iaMarks + practicalMarks;

    if (theoryTotal > 0) {
      const maximumCents = Math.round(theoryTotal * 100);

      /*
        Theory papers require at least 40% of their
        maximum theory marks.
      */

      const minimumTheoryCents =
        Math.ceil(theoryTotal * 40);

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

        if (gradePoint === 0) continue;

        if (!optionsByGrade.has(gradePoint)) {
          optionsByGrade.set(gradePoint, {
            gradePoint,
            marks: theoryMarks,
            marksLabel: `${theoryMarks.toFixed(2)} theory marks`
          });
        }
      }
    }

    /*
      Subjects without theory have only one possible
      result based on the marks entered in their
      internal / practical component.
    */

    else {
      const percentage = maximumMarks > 0
        ? (internalMarks / maximumMarks) * 100
        : 0;

      const gradePoint = getGrade(percentage).gradePoint;

      if (gradePoint > 0) {
        optionsByGrade.set(gradePoint, {
          gradePoint,
          marks: 0,
          marksLabel: "Based on entered marks"
        });
      }
    }
  }

  const allOptions = [...optionsByGrade.values()];

  /*
    Apply the maximum GP restriction only in
    the Grade Point-Based Model.
  */

  const options = targetModel === "grade-point" &&
    maxGradePoint !== null
      ? allOptions.filter(function(option) {
          return option.gradePoint <= maxGradePoint;
        })
      : allOptions;

  return {
    name,
    credits,
    difficulty,
    maxGradePoint,
    options
  };
}

/* =====================================================
   TARGET SGPA: DIFFICULTY RANKING
===================================================== */

function getDifficultyPenalty(difficulty, gradePoint) {
  /*
    Lower penalty means a more preferred combination.

    Difficult subjects are favoured for lower GPs.
    Easy subjects are favoured for higher GPs.
    Moderate subjects stay close to the selected target.
  */

  if (difficulty === "difficult") {
    return gradePoint * 2;
  }

  if (difficulty === "easy") {
    return (10 - gradePoint) * 2;
  }

  return Math.abs(
    gradePoint - Number(targetGradePoint)
  );
}

/* =====================================================
   TARGET SGPA: COMBINATIONS
===================================================== */

function calculateTargetCombinations() {
  resultsBox.innerHTML = "";

  if (
    calculatorMode !== "target" ||
    !targetGradePoint
  ) {
    return;
  }

  const rows = [...subjectRows].filter(function(row) {
    return row.style.display !== "none";
  });

  const subjects = rows
    .map(getPossibleOptions)
    .filter(subject => subject.credits > 0);

  if (subjects.some(subject => subject.options.length === 0)) {
    resultsBox.textContent =
      "At least one subject has no valid passing grade-point option under the current marks, 40% theory minimum, and selected maximum-GP limits. Check your marks or raise/remove that subject's GP cap.";

    return;
  }

  if (subjects.length === 0) {
    resultsBox.textContent =
      "No subjects available to calculate.";

    return;
  }

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  if (totalCredits <= 0) {
    resultsBox.textContent =
      "Could not calculate total credits.";

    return;
  }

  /*
    Weighted grade points are stored multiplied by 100.
    This keeps the calculations accurate to two decimal
    places without using floating-point score keys.
  */

  let combinations = new Map();

  combinations.set(0, [{
    preferencePenalty: 0,
    choices: []
  }]);

  const KEEP_PER_SCORE = 30;

  for (const subject of subjects) {
    const next = new Map();

    for (const [score, paths] of combinations) {
      for (const path of paths) {
        for (const option of subject.options) {
          const newScore = score + Math.round(
            subject.credits * option.gradePoint * 100
          );

          const preferencePenalty =
            targetModel === "difficulty"
              ? getDifficultyPenalty(
                  subject.difficulty,
                  option.gradePoint
                )
              : 0;

          const candidate = {
            preferencePenalty:
              path.preferencePenalty + preferencePenalty,

            choices: [
              ...path.choices,
              {
                name: subject.name,
                difficulty: subject.difficulty,
                marks: option.marks,
                marksLabel: option.marksLabel,
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

    /* Retain multiple alternatives for each weighted score. */

    for (const [score, paths] of next) {
      paths.sort((a, b) =>
        a.preferencePenalty - b.preferencePenalty
      );

      next.set(score, paths.slice(0, KEEP_PER_SCORE));
    }

    combinations = next;
  }

  /* Target SGPA is a minimum, not an exact SGPA. */

  const requiredScore =
    targetGradePoint * totalCredits * 100;

  const valid = [];

  for (const [score, paths] of combinations) {
    if (score >= Math.ceil(requiredScore - 1e-8)) {
      for (const path of paths) {
        valid.push({
          sgpa: score / 100 / totalCredits,
          preferencePenalty: path.preferencePenalty,
          choices: path.choices
        });
      }
    }
  }

  /* If target is impossible, show maximum achievable SGPA. */

  if (valid.length === 0) {
    const maximumScore = Math.max(
      ...combinations.keys()
    );

    const maximumSGPA =
      maximumScore / 100 / totalCredits;

    const message = document.createElement("p");

    message.textContent =
      `Target not possible under the current marks and maximum-GP limits. Maximum possible SGPA: ${maximumSGPA.toFixed(2)}.`;

    resultsBox.appendChild(message);

    return;
  }

  /* Sort combinations. */

  valid.sort((a, b) => {
    if (targetModel === "difficulty") {
      return (
        a.preferencePenalty - b.preferencePenalty ||
        (a.sgpa - Number(targetGradePoint)) -
          (b.sgpa - Number(targetGradePoint))
      );
    }

    return (
      (a.sgpa - Number(targetGradePoint)) -
        (b.sgpa - Number(targetGradePoint))
    );
  });

  /* Remove duplicate combinations. */

  const unique = [];
  const seen = new Set();

  for (const item of valid) {
    const key = item.choices
      .map(choice =>
        `${choice.gradePoint}:${choice.marksLabel}`
      )
      .join("|");

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }

    if (unique.length === 15) break;
  }

  /* Results heading. */

  const heading = document.createElement("h3");

  heading.textContent =
    `Mark combinations for at least ${Number(targetGradePoint).toFixed(2)} SGPA`;

  const note = document.createElement("p");

  if (targetModel === "difficulty") {
    note.textContent =
      "Up to 15 valid combinations are shown. They are ranked using your subject difficulty choices, then by how closely they meet the target SGPA. Each combination meets or exceeds your target. GP means grade points. Marks shown are the minimum needed for that GP.";
  } else {
    note.textContent =
      "Up to 15 valid combinations are shown. Each subject's selected maximum GP is treated as a limit, not an exact grade point. Blank selections have no GP limit. Each combination meets or exceeds your target.";
  }

  /* Results table. */

  const table = document.createElement("table");

  table.className = "target-results-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  [
    "Combination",
    ...subjects.map(subject => subject.name),
    "SGPA"
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
        `${choice.marksLabel} (GP ${choice.gradePoint})`;

      tr.appendChild(td);
    });

    const sgpaCellResult = document.createElement("td");

    sgpaCellResult.textContent =
      item.sgpa.toFixed(2);

    tr.appendChild(sgpaCellResult);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const tableWrapper = document.createElement("div");

  tableWrapper.className = "target-results-wrapper";

  tableWrapper.appendChild(table);

  resultsBox.append(heading, note, tableWrapper);
}