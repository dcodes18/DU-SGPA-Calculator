// Modals Elements
const courseModal = document.querySelector(".course-modal");
const semesterModal = document.querySelector(".semester-modal");
const actionModal = document.querySelector(".action-modal");
const targetModal = document.querySelector(".target-modal");
const calculatorModal = document.querySelector(".calculator-modal");


// Buttons Elements
const estimatedSGPABtn = document.getElementById("estimatedSGPABtn");
const targetMarksBtn = document.getElementById("targetMarksBtn");

const courseButtons = document.querySelectorAll(".course-btn");
const semesterButtons = document.querySelectorAll(".semester-btn");
const targetButtons = document.querySelectorAll(".target-btn");


// Calculator Elememts
const sgpaCell = document.querySelector(".sgpa-value");

const marksInputs = document.querySelectorAll(".marks-input");
const subjectRows = document.querySelectorAll(".subject-row");

const calculatorHeading = document.getElementById("calculator-heading");
const sgpaCard = document.getElementById("sgpa-card");


// Current User Selection
let selectedSemester = "";
let selectedCourse = "";
let targetGradePoint = "";
let calculatorMode = "";


// Course Selection
courseButtons.forEach(function(button) {

  button.addEventListener("click",function() {

    selectedCourse = button.dataset.course;

    courseModal.classList.add("hidden");
    semesterModal.classList.remove("hidden");
  });
});


// Semester Selection
semesterButtons.forEach(function(button) {

  button.addEventListener("click",function() {

    selectedSemester = button.dataset.semester;

    semesterModal.classList.add("hidden");
    actionModal.classList.remove("hidden");
  });
});


// Target SGPA
targetButtons.forEach(function(button) {

  button.addEventListener("click", function() {

    calculatorMode = "target";

    targetGradePoint = Number(button.dataset.target);

    targetModal.classList.add("hidden");
    calculatorModal.classList.remove("hidden");

    updateCalculator();

  });

});


//Estimated SGPA
estimatedSGPABtn.addEventListener("click",function() {
  
   calculatorMode = "estimate";

   actionModal.classList.add("hidden");
   calculatorModal.classList.remove("hidden");

   updateCalculator();

});


// Target Marks
targetMarksBtn.addEventListener("click",function() {

  actionModal.classList.add("hidden");
  targetModal.classList.remove("hidden");
});


// Marks Calculations
marksInputs.forEach(function(input){
  input.addEventListener("input",function(){

    const row = input.closest(".subject-row");

    if(calculatorMode === "estimate"){

      calculateSubject(row);
      calculateSGPA();
    }
    else{
      calculateTargetSubject(row);
    }
  });
});


// Estimated SGPA Function 
function calculateSubject(row){
  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");
  const theoryInput = row.querySelector(".theory-marks");

  const iaTotalCell = row.querySelector(".ia-total");
  const practicalTotalCell = row.querySelector(".practical-total");
  const theoryTotalCell = row.querySelector(".theory-total");

  const subjectTotalCell = row.querySelector(".subject-total");
  const gradePointCell = row.querySelector(".grade-points");
  const gradeCell = row.querySelector(".grade");

  const iaMarks = Math.min(Number(iaInput.value), Number(iaInput.max));
  const practicalMarks = Math.min(Number(practicalInput.value), Number(practicalInput.max));
  const theoryMarks = Math.min(Number(theoryInput.value), Number(theoryInput.max));

  iaInput.value = iaMarks;
  practicalInput.value = practicalMarks;
  theoryInput.value = theoryMarks;

  const totalMarks = iaMarks + practicalMarks + theoryMarks;

  const maxMarks =
    Number(iaTotalCell.textContent) +
    Number(practicalTotalCell.textContent) +
    Number(theoryTotalCell.textContent);

  const percentage = (totalMarks / maxMarks) * 100;

  const result = getGrade(percentage);

  subjectTotalCell.textContent = totalMarks;
  gradePointCell.textContent = result.gradePoint;
  gradeCell.textContent = result.grade;
}

// Grade Calcuclator
function getGrade(percentage){

   if (percentage >= 90) {
    return {
      gradePoint: 10,
      grade: "O"
    };
   }
    
   if (percentage >= 80) {
    return {
      gradePoint: 9,
      grade: "A+"
    };
   }
    
   if (percentage >= 70) {
    return {
      gradePoint: 8,
      grade: "A"
    };
   }

   if (percentage >= 60) {
    return {
      gradePoint: 7,
      grade: "B+"
    };
   }

   if (percentage >= 55) {
    return {
      gradePoint: 6,
      grade: "B"
    };
   }

   if (percentage >= 50) {
    return {
      gradePoint: 5,
      grade: "C"
    };
   }

   if (percentage >= 40) {
    return {
      gradePoint: 4,
      grade: "P"
    };
   }

   return {
    gradePoint: 0,
    grade: "F"
   };

}
   

// Dropdown Functions
function attachSecVacListeners() {

  document.querySelectorAll(".sec-vac-type").forEach(function(select) {

    select.addEventListener("change", function() {

      const row = select.closest(".subject-row");

      const iaTotal = row.querySelector(".ia-total");
      const practicalTotal = row.querySelector(".practical-total");
      const theoryTotal = row.querySelector(".theory-total");

      const iaInput = row.querySelector(".ia-marks");
      const practicalInput = row.querySelector(".practical-marks");
      const theoryInput = row.querySelector(".theory-marks");

      if (
        select.value === "secprac" ||
        select.value === "vacprac"
      ) {

        iaTotal.textContent = "0";
        practicalTotal.textContent = "80";
        theoryTotal.textContent = "0";

        iaInput.max = 0;
        practicalInput.max = 80;
        theoryInput.max = 0;

        iaInput.disabled = true;
        practicalInput.disabled = false;
        theoryInput.disabled = true;

      }

      else {

        iaTotal.textContent = "10";
        practicalTotal.textContent = "40";
        theoryTotal.textContent = "30";

        iaInput.max = 10;
        practicalInput.max = 40;
        theoryInput.max = 30;

        iaInput.disabled = false;
        practicalInput.disabled = false;
        theoryInput.disabled = false;

      }

      iaInput.value = "";
      practicalInput.value = "";
      theoryInput.value = "";

      row.querySelector(".subject-total").textContent = "--";
      row.querySelector(".grade-points").textContent = "--";
      row.querySelector(".grade").textContent = "--";

      calculateSGPA();

    });
  });
}

function attachAECListeners() {

  document.querySelectorAll(".aec-subject").forEach(function(select) {

    select.addEventListener("change", function() {

      const row = select.closest(".subject-row");

      const iaTotal = row.querySelector(".ia-total");
      const practicalTotal = row.querySelector(".practical-total");
      const theoryTotal = row.querySelector(".theory-total");

      const iaInput = row.querySelector(".ia-marks");
      const practicalInput = row.querySelector(".practical-marks");
      const theoryInput = row.querySelector(".theory-marks");

      if (select.value === "hindi") {

        iaTotal.textContent = "20";
        practicalTotal.textContent = "0";
        theoryTotal.textContent = "60";

        iaInput.max = 20;
        practicalInput.max = 0;
        theoryInput.max = 60;

        iaInput.disabled = false;
        practicalInput.disabled = true;
        theoryInput.disabled = false;

      }

      else {

        iaTotal.textContent = "10";
        practicalTotal.textContent = "40";
        theoryTotal.textContent = "30";

        iaInput.max = 10;
        practicalInput.max = 40;
        theoryInput.max = 30;

        iaInput.disabled = false;
        practicalInput.disabled = false;
        theoryInput.disabled = false;

      }

      iaInput.value = "";
      practicalInput.value = "";
      theoryInput.value = "";

      row.querySelector(".subject-total").textContent = "--";
      row.querySelector(".grade-points").textContent = "--";
      row.querySelector(".grade").textContent = "--";

      calculateSGPA();

    });

  });

}


// Calculator Setup
function updateCalculator() {

  const row4 = document.getElementById("subject4");
  const row5 = document.getElementById("subject5");
  const row6 = document.getElementById("subject6");
  const row7 = document.getElementById("subject7");

  if (calculatorMode === "target") {
    calculatorHeading.textContent = "Target SGPA Calculator";
    sgpaCard.style.display = "none";

    document.querySelectorAll(".total-column").forEach(function(item){
      item.style.display = calculatorMode === "target" ? "none" : "";
    });

    document.querySelectorAll(".gp-column").forEach(function(item){
      item.style.display = calculatorMode === "target" ? "none" : "";
    });

    document.querySelectorAll(".grade-column").forEach(function(item){
      item.style.display = calculatorMode === "target" ? "none" : "";
    });
  }

  else {
    calculatorHeading.textContent = "Estimated SGPA Calculator";
    sgpaCard.style.display = "block";

    document.querySelectorAll(".total-column").forEach(function(item){
      item.style.display = "";
    });

    document.querySelectorAll(".gp-column").forEach(function(item){
      item.style.display = "";
    });

    document.querySelectorAll(".grade-column").forEach(function(item){
      item.style.display = "";
    });
  }


  // Semester 5 & 6
  if (selectedSemester === "5" || selectedSemester === "6") {

    row7.style.display = "none";

    row4.querySelector(".subject-type").textContent = "DSE";

    row5.querySelector(".subject-type").textContent = "GE";

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

  // Semester 3 & 4
  else if (selectedSemester === "3" || selectedSemester === "4") {

     row7.style.display = "";

     if (selectedCourse === "programme") {

      row4.querySelector(".subject-type").textContent = "GE";

    }

    else {

      row4.querySelector(".subject-type").innerHTML = `
        <select class="dse-ge-type">
          <option value="" disabled selected>Select your type</option>
          <option value="dse">DSE</option>
          <option value="ge">GE</option>
        </select>
      `;

    }

  }

  // Semester 1 & 2
  else {

     row7.style.display = "";

     row4.querySelector(".subject-type").textContent = "GE";

  }

  attachSecVacListeners();
  attachAECListeners();

}


// SGPA Calculation
function calculateSGPA() {

  let weightedSum = 0;
  let totalCredits = 0;

  subjectRows.forEach(function(row){

    if(row.style.display === "none") return;

    const credits = Number(row.querySelector(".credit-row").textContent);

    let gradePoint = Number(row.querySelector(".grade-points").textContent);

    if (isNaN(gradePoint)) {
      gradePoint = "0"
    }

      weightedSum += credits * gradePoint;
      totalCredits += credits;

  });

  if(totalCredits === 0){
    sgpaCell.textContent = "--";
    return;
  }

  const sgpa = weightedSum / totalCredits;
  sgpaCell.textContent = sgpa.toFixed(2);

}


// Target Marks Calculator
function calculateTargetSubject(row){

  const iaInput = row.querySelector(".ia-marks");
  const practicalInput = row.querySelector(".practical-marks");
  const theoryInput = row.querySelector(".theory-marks");

  const iaTotal = Number(row.querySelector(".ia-total").textContent);
  const practicalTotal = Number(row.querySelector(".practical-total").textContent);
  const theoryTotal = Number(row.querySelector(".theory-total").textContent);

  const iaMarks = Number(iaInput.value) || 0;
  const practicalMarks = Number(practicalInput.value) || 0;

  const maxMarks = iaTotal + practicalTotal + theoryTotal;

  const requiredPercentage = targetGradePoint * 10 - 10;

  const requiredTotal = (maxMarks * requiredPercentage / 100);

  const requiredTheory =
    requiredTotal - iaMarks - practicalMarks;

  if(requiredTheory <= 0){
    theoryInput.value = "Achieved ✓";
  }

  else if(requiredTheory > theoryTotal){
    theoryInput.value = "Not Possible";
  }

  else{
    theoryInput.value = requiredTheory.toFixed(1);
  }

}