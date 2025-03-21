document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scholarshipForm');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const subjectsTable = document.getElementById('subjectsTable');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    // Add first subject row by default
    // addSubjectRow();
    
    // Add subject button event listener
    addSubjectBtn.addEventListener('click', function() {
        // Check if existing rows are properly filled before adding a new one
        const rows = subjectsTable.getElementsByTagName('tr');
        
        // If there are rows, validate the last row before adding a new one
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const subjectName = lastRow.querySelector('.subject-name').value.trim();
            const totalMarks = lastRow.querySelector('.total-marks').value.trim();
            const score = lastRow.querySelector('.score').value.trim();
            
            if (!subjectName || !totalMarks || !score) {
                showError('subjectsError', 'Fill the fields in the current row before adding a new one');
                return;
            }
        }
        
        // Check maximum rows
        if (rows.length >= 5) {
            showError('subjectsError', 'Maximum 5 subjects allowed');
            addSubjectBtn.classList.add('disabled');
        } else {
            addSubjectRow();
            if (rows.length >= 5) {
                addSubjectBtn.classList.add('disabled');
            }
        }
    });
    
    // Form submission event listener
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Form is valid, show success message
            showSuccess('Form submitted successfully!');
            // Normally you would submit the form here
            // form.submit();
        }
    });
    
    // Function to add a new subject row
    function addSubjectRow() {
        const rows = subjectsTable.getElementsByTagName('tr');
        const rowCount = rows.length;
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td>${rowCount + 1}</td>
            <td><input type="text" class="subject-input subject-name" placeholder="Subject name" required></td>
            <td><input type="number" class="subject-input total-marks" placeholder="Total" required></td>
            <td><input type="number" class="subject-input score" placeholder="Score" required></td>
            <td class="percentage">-</td>
            <td><button type="button" class="remove-btn">×</button></td>
        `;
        
        subjectsTable.appendChild(newRow);
        
        // Add event listeners to the new row
        setupRowEventListeners(newRow);
    }
    
    // Setup event listeners for a row
    function setupRowEventListeners(row) {
        const removeBtn = row.querySelector('.remove-btn');
        const totalInput = row.querySelector('.total-marks');
        const scoreInput = row.querySelector('.score');
        const subjectInput = row.querySelector('.subject-name');
        
        // Remove button event listener
        removeBtn.addEventListener('click', function() {
            subjectsTable.removeChild(row);
            updateRowNumbers();
            // Enable the add button if needed
            if (subjectsTable.getElementsByTagName('tr').length < 5) {
                addSubjectBtn.classList.remove('disabled');
            }
        });
        
        // Calculate percentage when total or score changes
        [totalInput, scoreInput].forEach(input => {
            input.addEventListener('input', function() {
                calculatePercentage(row);
            });
        });
        
        // Clear error when inputs change
        [totalInput, scoreInput, subjectInput].forEach(input => {
            input.addEventListener('input', function() {
                clearError('subjectsError');
            });
        });
    }
    
    // Calculate percentage for a row
    function calculatePercentage(row) {
        const totalInput = row.querySelector('.total-marks');
        const scoreInput = row.querySelector('.score');
        const percentageCell = row.querySelector('.percentage');
        
        const total = parseFloat(totalInput.value) || 0;
        const score = parseFloat(scoreInput.value) || 0;
        
        if (total > 0 && score <= total) {
            const percentage = (score / total * 100).toFixed(1);
            percentageCell.textContent = percentage + '%';
        } else if (score > total) {
            percentageCell.textContent = 'Error';
            showError('', 'Score cannot be greater than total');
        } else {
            percentageCell.textContent = '-';
        }
    }
    
    // Update row numbers after deletion
    function updateRowNumbers() {
        const rows = subjectsTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].textContent = i + 1;
        }
    }
    
    // Show error message
    function showError(fieldId, message) {
        if (fieldId) {
            const errorElement = document.getElementById(fieldId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        } else {
            errorAlert.textContent = message;
            errorAlert.style.display = 'block';
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 3000);
        }
    }
    
    // Clear error message
    function clearError(fieldId) {
        if (fieldId) {
            const errorElement = document.getElementById(fieldId);
            errorElement.style.display = 'none';
        }
    }
    
    // Show success message
    function showSuccess(message) {
        successAlert.textContent = message;
        successAlert.style.display = 'block';
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    }
    
    // Validate the entire form
    function validateForm() {
        let isValid = true;

        // Validate personal information
        const fullName = document.getElementById('fullName').value.trim();
        const age = document.getElementById('age').value.trim();
        const parentName = document.getElementById('parentName').value.trim();
        const occupation = document.getElementById('occupation').value.trim();
        const address = document.getElementById('address').value.trim();
        const relationship = document.getElementById('relationship').value.trim();

        if (!fullName) {
            showError('fullNameError', 'Full name is required');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
            showError('fullNameError', 'Only alphabets are allowed');
            isValid = false;
        }

        if (!age) {
            showError('ageError', 'Age is required');
            isValid = false;
        } else if (age < 15 || age > 35) {
            showError('ageError', 'Age must be between 15 and 35');
            isValid = false;
        }

        if (!parentName) {
            showError('parentNameError', 'Parent name is required');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(parentName)) {
            showError('parentNameError', 'Only alphabets are allowed');
            isValid = false;
        }

        if (!occupation) {
            showError('occupationError', 'Occupation is required');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(occupation)) {
            showError('occupationError', 'Only alphabets are allowed');
            isValid = false;
        }

        if (!address) {
            showError('addressError', 'Address is required');
            isValid = false;
        }

        if (!relationship) {
            showError('relationshipError', 'Relationship is required');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(relationship)) {
            showError('relationshipError', 'Only alphabets are allowed');
            isValid = false;
        }

        // If personal information is invalid, stop further validation
        if (!isValid) {
            return false;
        }

        // Validate subjects
        const rows = subjectsTable.getElementsByTagName('tr');
        if (rows.length === 0) {
            showError('subjectsError', 'At least one subject is required');
            isValid = false;
        } else {
            for (let i = 0; i < rows.length; i++) {
                const subjectName = rows[i].querySelector('.subject-name').value.trim();
                const totalMarks = rows[i].querySelector('.total-marks').value.trim();
                const score = rows[i].querySelector('.score').value.trim();

                if (!subjectName || !totalMarks || !score) {
                    showError('subjectsError', 'All subject fields are required');
                    isValid = false;
                    break;
                }

                if (parseFloat(score) > parseFloat(totalMarks)) {
                    showError('subjectsError', 'Score cannot be greater than total marks');
                    isValid = false;
                    break;
                }
            }
        }

        // If subjects are invalid, stop further validation
        if (!isValid) {
            return false;
        }

        // Validate income details
        const annualIncome = document.getElementById('annualIncome').value.trim();
        const requisitionAmount = document.getElementById('requisitionAmount').value.trim();
        const natureRequisition = document.getElementById('natureRequisition').value.trim();
        const fundAmount = document.getElementById('fundAmount').value.trim();

        if (!annualIncome) {
            showError('annualIncomeError', 'Annual income is required');
            isValid = false;
        }

        if (!requisitionAmount) {
            showError('requisitionAmountError', 'Requisition amount is required');
            isValid = false;
        } else if (!/^[0-9]+$/.test(requisitionAmount)) {
            showError('requisitionAmountError', 'Only numbers are allowed');
            isValid = false;
        }

        if (!natureRequisition) {
            showError('natureRequisitionError', 'Nature of requisition is required');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(natureRequisition)) {
            showError('natureRequisitionError', 'Only alphabets are allowed');
            isValid = false;
        }

        if (!fundAmount) {
            showError('fundAmountError', 'Fund amount is required');
            isValid = false;
        } else if (parseFloat(fundAmount) > parseFloat(requisitionAmount)) {
            showError('fundAmountError', 'Fund amount cannot be greater than requisition amount');
            isValid = false;
        } else if (!/^[0-9]+$/.test(fundAmount)) {
            showError('fundAmountError', 'Only numbers are allowed');
            isValid = false;
        }

        return isValid;
    }
});