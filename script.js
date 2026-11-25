
"use strict";

// ==========================================
// 1. DOM Elements
// ==========================================

const studentForm = document.getElementById("studentForm");

const studentNameInput = document.getElementById("studentName");
const subject1Input = document.getElementById("subject1");
const subject2Input = document.getElementById("subject2");
const subject3Input = document.getElementById("subject3");
const attendanceInput = document.getElementById("attendance");

const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

const studentsTableBody = document.getElementById("studentsTableBody");
const reportArea = document.getElementById("reportArea");

const runCommitteeBtn = document.getElementById("runCommitteeBtn");

const totalStudentsElement = document.getElementById("totalStudents");
const candidateCountElement = document.getElementById("candidateCount");
const classAverageElement = document.getElementById("classAverage");

// ==========================================
// 2. Students Array
// ==========================================

let studentsList = [];

// ==========================================
// 3. Student Class
// ==========================================

class Student {

    #name;
    #subject1;
    #subject2;
    #subject3;
    #attendance;

    constructor(name, subject1, subject2, subject3, attendance) {

        this.name = name;
        this.subject1 = subject1;
        this.subject2 = subject2;
        this.subject3 = subject3;
        this.attendance = attendance;

    }

    // Name Setter
    set name(value) {

        if (!value || value.trim() === "") {
            throw new Error("Student name cannot be empty.");
        }

        this.#name = value.trim();

    }

    get name() {
        return this.#name;
    }

    // Subject 1 Setter
    set subject1(value) {

        if (value === "" || value === null || value === undefined) {
            throw new Error("Subject 1 grade is required.");
        }

        const grade = Number(value);

        if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
            throw new Error("Subject 1 grade must be between 0 and 100.");
        }

        this.#subject1 = grade;

    }

    get subject1() {
        return this.#subject1;
    }

    // Subject 2 Setter
    set subject2(value) {

        if (value === "" || value === null || value === undefined) {
            throw new Error("Subject 2 grade is required.");
        }

        const grade = Number(value);

        if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
            throw new Error("Subject 2 grade must be between 0 and 100.");
        }

        this.#subject2 = grade;

    }

    get subject2() {
        return this.#subject2;
    }

    // Subject 3 Setter
    set subject3(value) {

        if (value === "" || value === null || value === undefined) {
            throw new Error("Subject 3 grade is required.");
        }

        const grade = Number(value);

        if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
            throw new Error("Subject 3 grade must be between 0 and 100.");
        }

        this.#subject3 = grade;

    }

    get subject3() {
        return this.#subject3;
    }

    // Attendance Setter
    set attendance(value) {

        if (value === "" || value === null || value === undefined) {
            throw new Error("Attendance percentage is required.");
        }

        const percentage = Number(value);

        if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
            throw new Error("Attendance must be between 0 and 100.");
        }

        this.#attendance = percentage;

    }

    get attendance() {
        return this.#attendance;
    }

    // Calculate Student Average
    get average() {

        return (
            this.#subject1 +
            this.#subject2 +
            this.#subject3
        ) / 3;

    }

}

// ==========================================
// 4. Display Messages
// ==========================================

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.classList.remove("d-none");

    successMessage.classList.add("d-none");

}

function showSuccess(message) {

    successMessage.textContent = message;
    successMessage.classList.remove("d-none");

    errorMessage.classList.add("d-none");

}

function clearMessages() {

    errorMessage.classList.add("d-none");
    successMessage.classList.add("d-none");

}

// ==========================================
// 5. Update Dashboard Statistics
// ==========================================

function updateStatistics() {

    totalStudentsElement.textContent = studentsList.length;

    if (studentsList.length === 0) {

        candidateCountElement.textContent = "0";
        classAverageElement.textContent = "0%";

        return;

    }

    const totalAverage = studentsList.reduce(
        (sum, student) => sum + student.average,
        0
    );

    const average = totalAverage / studentsList.length;

    classAverageElement.textContent = average.toFixed(2) + "%";

}

// ==========================================
// 6. Display Students
// ==========================================

function displayStudents() {

    studentsTableBody.innerHTML = "";

    if (studentsList.length === 0) {

        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                    No students added yet.
                </td>
            </tr>
        `;

        updateStatistics();

        return;

    }

    studentsList.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(student.name)}</td>
            <td>${student.subject1}</td>
            <td>${student.subject2}</td>
            <td>${student.subject3}</td>
            <td>
                <span class="grade-badge">
                    ${student.average.toFixed(2)}%
                </span>
            </td>
            <td>${student.attendance}%</td>
        `;

        studentsTableBody.appendChild(row);

    });

    updateStatistics();

}

// ==========================================
// 7. Protect Student Names in HTML
// ==========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];

    });

}

// ==========================================
// 8. Add New Student - Try & Catch
// ==========================================

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearMessages();

    try {

        const name = studentNameInput.value;

        const subject1 = subject1Input.value;
        const subject2 = subject2Input.value;
        const subject3 = subject3Input.value;

        const attendance = attendanceInput.value;

        // Create New Student Object
        const newStudent = new Student(
            name,
            subject1,
            subject2,
            subject3,
            attendance
        );

        // Add Student to Array
        studentsList.push(newStudent);

        // Update Page
        displayStudents();

        // Success Message
        showSuccess("Student added successfully!");

        // Clear Form
        studentForm.reset();

    }

    catch (error) {

        showError(error.message);

    }

});

// ==========================================
// 9. Mercy Committee
// Filter + Map + Reduce
// ==========================================

function runMercyCommittee() {

    clearMessages();

    if (studentsList.length === 0) {

        showError("Please add students before running the committee.");

        reportArea.innerHTML = "";

        return;

    }

    // FILTER:
    // Find students whose average is between 40 and 49

    const candidates = studentsList.filter(student => {

        return student.average >= 40 && student.average <= 49;

    });

    // MAP:
    // Add 5 bonus marks to each candidate

    const updatedCandidates = candidates.map(student => {

        return {

            name: student.name,

            originalAverage: student.average,

            newAverage: Math.min(student.average + 5, 100)

        };

    });

    // REDUCE:
    // Calculate the total average of all students

    const totalAverage = studentsList.reduce(
        (sum, student) => sum + student.average,
        0
    );

    const classAverage = totalAverage / studentsList.length;

    // Display Report

    let candidatesHTML = "";

    if (updatedCandidates.length === 0) {

        candidatesHTML = `
            <p>
                No students qualified for the Mercy Committee.
            </p>
        `;

    } else {

        candidatesHTML = updatedCandidates.map(student => {

            return `
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 border-bottom border-secondary">
                    <div>
                        <strong>${escapeHTML(student.name)}</strong>
                        <small class="d-block text-secondary">
                            Original: ${student.originalAverage.toFixed(2)}%
                        </small>
                    </div>

                    <span class="grade-badge">
                        ${student.newAverage.toFixed(2)}%
                    </span>
                </div>
            `;

        }).join("");

    }

    reportArea.innerHTML = `
        <div class="report-result">

            <h4>
                <i class="bi bi-clipboard2-check me-2"></i>
                Mercy Committee Report
            </h4>

            <p>
                <strong>Total Students:</strong>
                ${studentsList.length}
            </p>

            <p>
                <strong>Eligible Candidates:</strong>
                ${updatedCandidates.length}
            </p>

            <p>
                <strong>Class Average:</strong>
                ${classAverage.toFixed(2)}%
            </p>

            <hr class="border-secondary">

            <h5 class="text-light fs-6 mb-3">
                Candidates Results
            </h5>

            ${candidatesHTML}

        </div>
    `;

    // Update Candidate Counter
    candidateCountElement.textContent = updatedCandidates.length;

    showSuccess("Mercy Committee report generated successfully!");

}

// ==========================================
// 10. Mercy Committee Button
// ==========================================

runCommitteeBtn.addEventListener("click", runMercyCommittee);

// ==========================================
// 11. Initial Page Setup
// ==========================================

displayStudents();

console.log("GradeFlow Student Results System is ready!");
console.log("Student Class loaded successfully.");
