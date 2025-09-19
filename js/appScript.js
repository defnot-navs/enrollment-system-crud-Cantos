




// ================== NAVIGATION HANDLER ==================
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Load corresponding table when navigating
  if (id === "students") {
    loadStudents();
    loadProgramsDropdown();
  } else if (id === "programs") {
    loadProgramsTable();
  } else if (id === "subjects") {
    loadSemestersDropdown()
    loadSubjects();
    loadYearsDropdown()
  } else if (id === "semesters") {
    loadSemesters();
  } else if (id === "years") {
    loadYears();
  } else if (id === "enrollments") {
    loadEnrollments();
    loadStudentsDropdown();
    loadProgramsDropdownForEnroll();
    loadSubjectsDropdown()
    
  }
}


// ================== STUDENTS CRUD ==================
async function loadStudents() {
  try {
    const response = await fetch("api/getStudents.php");
    const result = await response.json();

    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.students)) {
      result.students.forEach(stu => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${stu.stud_id}</td>
          <td>${stu.first_name} ${stu.middle_initial ? stu.middle_initial + "." : ""} ${stu.last_name}</td>
          <td>${stu.program_name || "N/A"}</td>
          <td>${stu.allowance}</td>
          <td>
            <button onclick="editStudent(${stu.stud_id}, '${stu.first_name}', '${stu.last_name}', '${stu.middle_initial}', ${stu.program_id}, ${stu.allowance})">✏️ Edit</button>
            <button onclick="deleteStudent(${stu.stud_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

document.querySelector("#studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const stud_id = Date.now(); // generate unique stud_id
  const first_name = document.querySelector("#first_name").value.trim();
  const last_name = document.querySelector("#last_name").value.trim();
  const middle_initial = document.querySelector("#middle_initial").value.trim();
  const program = document.querySelector("#program").value;
  const allowance = document.querySelector("#allowance").value;

  // Optional: validate inputs here before sending

  try {
    const response = await fetch("api/addStudents.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stud_id, first_name, last_name, middle_initial, program_id: program, allowance })
    });

    const result = await response.json();

    if (result.success) {
      alert("Student added!");
      loadStudents();
      e.target.reset();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
});


// Edit student (update button handling)
function editStudent(id, first, last, middle, program, allowance) {
  document.querySelector("#first_name").value = first;
  document.querySelector("#last_name").value = last;
  document.querySelector("#middle_initial").value = middle;
  document.querySelector("#program").value = program;
  document.querySelector("#allowance").value = allowance;

  const btn = document.querySelector("#studentForm button");
  btn.textContent = "Update Student";
  btn.onclick = async (e) => {
    e.preventDefault();

    const updatedFirst = document.querySelector("#first_name").value;
    const updatedLast = document.querySelector("#last_name").value;
    const updatedMiddle = document.querySelector("#middle_initial").value;
    const updatedProgram = document.querySelector("#program").value;
    const updatedAllowance = document.querySelector("#allowance").value;

    const response = await fetch("api/updateStudent.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stud_id: id, first_name: updatedFirst, last_name: updatedLast, middle_initial: updatedMiddle, program_id: updatedProgram, allowance: updatedAllowance })
    });

    const result = await response.json();
    if (result.success) {
      alert("Student updated!");
      loadStudents();
      document.querySelector("#studentForm").reset();
      btn.textContent = "Add Student";
      btn.onclick = null;
    } else {
      alert("Error: " + result.message);
    }
  };
}
async function deleteStudent(stud_id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const response = await fetch("api/deleteStudent.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stud_id })
    });

    const result = await response.json();

    if (result.success) {
      alert("Student deleted!");
      loadStudents(); // refresh table
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
}


// ================== LOAD PROGRAMS DROPDOWN ==================
async function loadProgramsDropdown() {
  try {
    const response = await fetch("api/getProgram.php");
    const result = await response.json();

    const select = document.querySelector("#program");
    select.innerHTML = "";

    if (result.success && Array.isArray(result.programs)) {
      result.programs.forEach(program => {
        const option = document.createElement("option");
        option.value = program.program_id;
        option.textContent = program.program_name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}



// ================== PROGRAMS CRUD ==================
async function loadProgramsTable() {
  try {
    const response = await fetch("api/getProgram.php");
    const result = await response.json();

    const tbody = document.querySelector("#programsTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.programs)) {
      result.programs.forEach(prog => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${prog.program_id}</td>
          <td>${prog.program_name}</td>
          <td>${prog.ins_name || prog.ins_id}</td>
          <td>
            <button onclick="editProgram(${prog.program_id}, '${prog.program_name}', ${prog.ins_id})">✏️ Edit</button>
            <button onclick="deleteProgram(${prog.program_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

document.querySelector("#programForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const program_id = document.querySelector("#program_id").value;
  const programName = document.querySelector("#programName").value;
  const insId = document.querySelector("#insId").value;

  try {
    const response = await fetch("api/addProgram.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_id, program_name: programName, ins_id: insId })
    });

    const result = await response.json();

    if (result.success) {
      alert("Program added!");
      loadProgramsTable();
      loadProgramsDropdown(); // refresh dropdown in student form
      e.target.reset();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
});


// Delete program
async function deleteProgram(program_id) {
  if (!confirm("Delete this program?")) return;
  const response = await fetch("api/deleteProgram.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ program_id })
  });
  const result = await response.json();
  if (result.success) {
    loadProgramsTable();
    loadProgramsDropdown();
  } else {
    alert("Error: " + result.message);
  }
}

// Edit program (prefill form)
function editProgram(id, name, insId) {
  document.querySelector("#programName").value = name;
  document.querySelector("#insId").value = insId;

  const btn = document.querySelector("#programForm button");
  btn.textContent = "Update Program";
  btn.onclick = async (e) => {
    e.preventDefault();
    const updatedName = document.querySelector("#programName").value;
    const updatedIns = document.querySelector("#insId").value;

    const response = await fetch("api/updateProgram.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_id: id, program_name: updatedName, ins_id: updatedIns })
    });
    const result = await response.json();
    if (result.success) {
      alert("Program updated!");
      loadProgramsTable();
      loadProgramsDropdown();
      document.querySelector("#programForm").reset();
      btn.textContent = "Add Program";
      btn.onclick = null;
    } else {
      alert("Error: " + result.message);
    }
  };
}





// ================== PLACEHOLDERS FOR OTHER TABLES ==================
async function loadSubjects() {
  try {
    const response = await fetch("api/getSubject.php");
    const result = await response.json();

    const tbody = document.querySelector("#subjectTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.subjects)) {
      result.subjects.forEach(subj => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${subj.subject_id}</td>
          <td>${subj.subject_name}</td>
          <td>${subj.sem_name || "N/A"}</td>
          <td>${subj.year_range || "N/A"}</td>
          <td>
            <button onclick="editSubject(${subj.subject_id}, '${subj.subject_name}', ${subj.sem_id}, ${subj.year_id})">✏️ Edit</button>
            <button onclick="deleteSubject(${subj.subject_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}


// Add Subject
document.querySelector("#subjectForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const subject_id = document.querySelector("#subject_id").value;
  const subject_name = document.querySelector("#subjectName").value;
  const sem_id = document.querySelector("#semId").value;
  const year_id = document.querySelector("#yearId").value;

  const response = await fetch("api/addSubject.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id, subject_name, sem_id, year_id })
  });

  const result = await response.json();

  if (result.success) {
    alert("Subject added!");
    loadSubjects(); // reload table
    e.target.reset();
  } else {
    alert("Error: " + result.message);
  }
});


// Delete subject
async function deleteSubject(subject_id) {
  if (!confirm("Delete this subject?")) return;
  const response = await fetch("api/deleteSubject.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id })
  });
  const result = await response.json();
  if (result.success) {
    loadSubjects();
  } else {
    alert("Error: " + result.message);
  }
}

// Edit subject
function editSubject(id, name, sem_id, year_id) {
  document.querySelector("#subjectName").value = name;
  document.querySelector("#semId").value = sem_id;
  document.querySelector("#yearId").value = year_id;

  const btn = document.querySelector("#subjectForm button");
  btn.textContent = "Update Subject";
  btn.onclick = async (e) => {
    e.preventDefault();
    const updatedName = document.querySelector("#subjectName").value;
    const updatedSem = document.querySelector("#semId").value;
    const updatedYear = document.querySelector("#yearId").value;

    const response = await fetch("api/updateSubject.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: id, subject_name: updatedName, sem_id: updatedSem, year_id: updatedYear })
    });
    const result = await response.json();
    if (result.success) {
      alert("Subject updated!");
      loadSubjects();
      document.querySelector("#subjectForm").reset();
      btn.textContent = "Add Subject";
      btn.onclick = null;
    } else {
      alert("Error: " + result.message);
    }
  };
}

// Dropdowns for semester + year
async function loadSemestersDropdown() {
  try {
    const response = await fetch("api/getSemester.php");
    const result = await response.json();

    const select = document.querySelector("#semId");
    if (!select) return;
    select.innerHTML = "";

    if (result.success && Array.isArray(result.semester)) { // ✅ use semester
      result.semester.forEach(sem => {
        const option = document.createElement("option");
        option.value = sem.sem_id;
        option.textContent = sem.sem_name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function loadYearsDropdown() {
  try {
    const response = await fetch("api/getYears.php");
    const result = await response.json();

    const select = document.querySelector("#yearId");
    if (!select) return;
    select.innerHTML = "";

    if (result.success && Array.isArray(result.years)) {
      result.years.forEach(year => {
        const option = document.createElement("option");
        option.value = year.year_id;
        option.textContent = `${year.year_from}-${year.year_to}`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// ================== SEMESTERS CRUD ==================
async function loadSemesters() {
  try {
    const response = await fetch("api/getSemester.php");
    const result = await response.json();

    const tbody = document.querySelector("#semestersTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.semester)) {
      result.semester.forEach(sem => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${sem.sem_id}</td>
          <td>${sem.sem_name}</td>
          <td>
            <button onclick="editSemester(${sem.sem_id}, '${sem.sem_name}')">✏️ Edit</button>
            <button onclick="deleteSemester(${sem.sem_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Add Semester
document.querySelector("#semesterForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const sem_id = document.querySelector("#sem_id").value;
  const sem_name = document.querySelector("#sem_name").value;

  const response = await fetch("api/addSemester.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sem_id, sem_name })
  });
  const result = await response.json();

  if (result.success) {
    alert("Semester added!");
    loadSemesters();
    e.target.reset();
  } else {
    alert("Error: " + result.message);
  }
});

// Delete Semester
async function deleteSemester(sem_id) {
  if (!confirm("Delete this semester?")) return;
  const response = await fetch("api/deleteSemester.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sem_id })
  });
  const result = await response.json();
  if (result.success) {
    loadSemesters();
  } else {
    alert("Error: " + result.message);
  }
}

// Edit Semester
function editSemester(id, name) {
  document.querySelector("#sem_id").value = id;
  document.querySelector("#sem_name").value = name;

  const btn = document.querySelector("#semesterForm button");
  btn.textContent = "Update Semester";
  btn.onclick = async (e) => {
    e.preventDefault();
    const updatedName = document.querySelector("#sem_name").value;

    const response = await fetch("api/updateSemester.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sem_id: id, sem_name: updatedName })
    });
    const result = await response.json();
    if (result.success) {
      alert("Semester updated!");
      loadSemesters();
      document.querySelector("#semesterForm").reset();
      btn.textContent = "Add Semester";
      btn.onclick = null;
    } else {
      alert("Error: " + result.message);
    }
  };
}

// ================== YEARS CRUD ==================
async function loadYears() {
  try {
    const response = await fetch("api/getYears.php");
    const result = await response.json();

    const tbody = document.querySelector("#yearsTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.years)) {
      result.years.forEach(yr => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${yr.year_id}</td>
          <td>${yr.year_from}</td>
          <td>${yr.year_to}</td>
          <td>
            <button onclick="editYear(${yr.year_id}, ${yr.year_from}, ${yr.year_to})">✏️ Edit</button>
            <button onclick="deleteYear(${yr.year_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Add Year
document.querySelector("#yearForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const year_id = document.querySelector("#year_id").value;
  const year_from = document.querySelector("#year_from").value;
  const year_to = document.querySelector("#year_to").value;

  const response = await fetch("api/addYear.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year_id, year_from, year_to })
  });

  const result = await response.json();

  if (result.success) {
    alert("Year added!");
    loadYears(); // reload table
    e.target.reset();
  } else {
    alert("Error: " + result.message);
  }
});

// Delete Year
async function deleteYear(year_id) {
  if (!confirm("Delete this year?")) return;
  const response = await fetch("api/deleteYear.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year_id })
  });
  const result = await response.json();
  if (result.success) {
    loadYears();
  } else {
    alert("Error: " + result.message);
  }
}

// Edit Year
function editYear(id, from, to) {
  document.querySelector("#year_from").value = from;
  document.querySelector("#year_to").value = to;

  const btn = document.querySelector("#yearForm button");
  btn.textContent = "Update Year";
  btn.onclick = async (e) => {
    e.preventDefault();

    const updatedFrom = document.querySelector("#year_from").value;
    const updatedTo = document.querySelector("#year_to").value;

    const response = await fetch("api/updateYear.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year_id: id, year_from: updatedFrom, year_to: updatedTo })
    });
    const result = await response.json();
    if (result.success) {
      alert("Year updated!");
      loadYears();
      document.querySelector("#yearForm").reset();
      btn.textContent = "Add Year";
      btn.onclick = null;
    } else {
      alert("Error: " + result.message);
    }
  };
}



// ================== ENROLLMENTS CRUD ==================

// Load Enrollments
async function loadEnrollments() {
  try {
    const response = await fetch("api/getEnrollment.php");
    const result = await response.json();

    const tbody = document.querySelector("#enrollmentsTable tbody");
    tbody.innerHTML = "";

    if (result.success && Array.isArray(result.enrollments)) {
      result.enrollments.forEach(enr => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${enr.enrollment_id}</td>
          <td>${enr.student_name}</td>
          <td>${enr.subject_name}</td>
          <td>${enr.program_name}</td>
          <td>${enr.year_range}</td>
          <td>${enr.sem_name}</td>
          <td>
            <button onclick="editEnrollment(${enr.enrollment_id}, ${enr.stud_id}, ${enr.subject_id}, ${enr.program_id})">✏️ Edit</button>
            <button onclick="deleteEnrollment(${enr.enrollment_id})">❌ Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="7">${result.message || "No enrollments found."}</td></tr>`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

document.querySelector("#enrollmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const enrollment_id = document.querySelector("#enrollment_id").value;
  const stud_id = document.querySelector("#enroll_student").value;
  const subject_id = document.querySelector("#enroll_subject").value;
  const program_id = document.querySelector("#enroll_program").value;

  const url = isEditing ? "api/updateEnrollment.php" : "api/addEnrollment.php";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollment_id,
        student_id: stud_id,
        subject_id,
        program_id
      })
    });

    const result = await response.json();
    if (result.success) {
      alert(isEditing ? "Enrollment updated!" : "Enrollment added!");
      loadEnrollments();
      e.target.reset();
      closeForm("enrollmentFormWrapper");

      isEditing = false;
      document.querySelector("#enrollmentFormTitle").textContent = "Add Enrollment";
      document.querySelector("#enrollmentForm button[type='submit']").textContent = "Add Enrollment";
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
});

// Delete Enrollment
async function deleteEnrollment(enrollment_id) {
  if (!confirm("Delete this enrollment?")) return;
  const response = await fetch("api/deleteEnrollment.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrollment_id })
  });
  const result = await response.json();
  if (result.success) {
    loadEnrollments();
  } else {
    alert("Error: " + result.message);
  }
}

// Edit Enrollment
function editEnrollment(id, student_id, subject_id, program_id) {
  // Prefill dropdowns with current values
  document.querySelector("#enrollment_id").value = id;
  document.querySelector("#enroll_student").value = student_id;
  document.querySelector("#enroll_subject").value = subject_id;
  document.querySelector("#enroll_program").value = program_id;

  // Switch button text to Update
  const btn = document.querySelector("#enrollmentForm button[type='submit']");
  btn.textContent = "Update Enrollment";

  // Replace form submit behavior
  btn.onclick = async (e) => {
    e.preventDefault();

    const updatedStudent = document.querySelector("#enroll_student").value;
    const updatedSubject = document.querySelector("#enroll_subject").value;
    const updatedProgram = document.querySelector("#enroll_program").value;

    try {
      const response = await fetch("api/updateEnrollment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollment_id: id,
          student_id: updatedStudent,
          subject_id: updatedSubject,
          program_id: updatedProgram
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Enrollment updated!");
        loadEnrollments();
        document.querySelector("#enrollmentForm").reset();
        btn.textContent = "Add Enrollment";
        btn.onclick = null; // reset to default
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
}


// ================== DROPDOWNS FOR ENROLLMENTS ==================

// Load students
async function loadStudentsDropdown() {
  try {
    const response = await fetch("api/getStudents.php");
    const result = await response.json();

    const select = document.querySelector("#enroll_student");
    if (!select) return;
    select.innerHTML = "";

    if (result.success && Array.isArray(result.students)) {
      result.students.forEach(stu => {
        const option = document.createElement("option");
        option.value = stu.stud_id;
        option.textContent = stu.name || `${stu.first_name} ${stu.last_name}`; // ✅ unified
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error (students):", error);
  }
}

// Load programs
async function loadProgramsDropdownForEnroll() {
  try {
    const response = await fetch("api/getProgram.php");
    const result = await response.json();

    const select = document.querySelector("#enroll_program");
    if (!select) return;
    select.innerHTML = "";

    if (result.success && Array.isArray(result.programs)) {
      result.programs.forEach(prog => {
        const option = document.createElement("option");
        option.value = prog.program_id;
        option.textContent = prog.program_name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error (programs):", error);
  }
}

// Load subjects (includes year + semester info)
async function loadSubjectsDropdown() {
  try {
    const response = await fetch("api/getSubject.php");
    const result = await response.json();

    const select = document.querySelector("#enroll_subject");
    if (!select) return;
    select.innerHTML = "";

    if (result.success && Array.isArray(result.subjects)) {
      result.subjects.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub.subject_id;
        option.textContent = `${sub.subject_name} (${sub.year_range}, ${sub.sem_name})`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Fetch error (subjects):", error);
  }
}

// Flag to check mode
let isEditing = false;

// Open form for Add
function openAddEnrollment() {
  isEditing = false;
  document.querySelector("#enrollmentFormTitle").textContent = "Add Enrollment";
  document.querySelector("#enrollmentForm button[type='submit']").textContent = "Add Enrollment";
  document.querySelector("#enrollmentForm").reset();
  openForm("enrollmentFormWrapper");

  // Reload dropdowns
  loadStudentsDropdown("enroll_student");
  loadSubjectsDropdown("enroll_subject");
  loadProgramsDropdownForEnroll("enroll_program");
}

// Open form for Edit
function editEnrollment(id, student_id, subject_id, program_id) {
  isEditing = true; // now in edit mode

  document.querySelector("#enrollmentFormTitle").textContent = "Edit Enrollment";
  document.querySelector("#enrollmentForm button[type='submit']").textContent = "Update Enrollment";

  document.querySelector("#enrollment_id").value = id;

  // Reload dropdowns with pre-selected values
  loadStudentsDropdown("enroll_student", student_id);
  loadSubjectsDropdown("enroll_subject", subject_id);
  loadProgramsDropdownForEnroll("enroll_program", program_id);

  openForm("enrollmentFormWrapper");
}







// ================== INIT ==================
window.addEventListener("DOMContentLoaded", () => {
  showSection("students"); // default section
});
