$(document).ready(function() {
    const $form = $('#scholarshipForm');
    const $addSubjectBtn = $('#addSubjectBtn');
    const $subjectsTable = $('#subjectsTable');
    const $errorAlert = $('#errorAlert');
    const $successAlert = $('#successAlert');

    // Add subject button event listener
    $addSubjectBtn.on('click', function() {
        const $rows = $subjectsTable.find('tr');

        // Validate the last row before adding a new one
        if ($rows.length > 0) {
            const $lastRow = $rows.last();
            const subjectName = $lastRow.find('.subject-name').val().trim();
            const totalMarks = $lastRow.find('.total-marks').val().trim();
            const score = $lastRow.find('.score').val().trim();

            if (!subjectName || !totalMarks || !score) {
                showError('subjectsError', 'Fill the fields in the current row before adding a new one');
                return;
            }
        }

        // Check maximum rows
        if ($rows.length >= 5) {
            showError('subjectsError', 'Maximum 5 subjects allowed');
            $addSubjectBtn.addClass('disabled');
        } else {
            addSubjectRow();
            if ($rows.length >= 5) {
                $addSubjectBtn.addClass('disabled');
            }
        }
    });

    // Form submission event listener
    $form.on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showSuccess('Form submitted successfully!');
            // Normally you would submit the form here
            // $form.submit();
        }
    });

    // Function to add a new subject row
    function addSubjectRow() {
        const $rows = $subjectsTable.find('tr');
        const rowCount = $rows.length;
        const $newRow = $(`
            <tr>
                <td>${rowCount + 1}</td>
                <td><input type="text" class="subject-input subject-name" placeholder="Subject name" required></td>
                <td><input type="number" class="subject-input total-marks" placeholder="Total" required></td>
                <td><input type="number" class="subject-input score" placeholder="Score" required></td>
                <td class="percentage">-</td>
                <td><button type="button" class="remove-btn">×</button></td>
            </tr>
        `);

        $subjectsTable.append($newRow);

        // Add event listeners to the new row
        setupRowEventListeners($newRow);
    }

    // Setup event listeners for a row
    function setupRowEventListeners($row) {
        const $removeBtn = $row.find('.remove-btn');
        const $totalInput = $row.find('.total-marks');
        const $scoreInput = $row.find('.score');
        const $subjectInput = $row.find('.subject-name');

        // Remove button event listener
        $removeBtn.on('click', function() {
            $row.remove();
            updateRowNumbers();
            // Enable the add button if needed
            if ($subjectsTable.find('tr').length < 5) {
                $addSubjectBtn.removeClass('disabled');
            }
        });

        // Calculate percentage when total or score changes
        $totalInput.add($scoreInput).on('input', function() {
            calculatePercentage($row);
        });

        // Clear error when inputs change
        $totalInput.add($scoreInput).add($subjectInput).on('input', function() {
            clearError('subjectsError');
        });
    }

    // Calculate percentage for a row
    function calculatePercentage($row) {
        const $totalInput = $row.find('.total-marks');
        const $scoreInput = $row.find('.score');
        const $percentageCell = $row.find('.percentage');

        const total = parseFloat($totalInput.val()) || 0;
        const score = parseFloat($scoreInput.val()) || 0;

        if (total > 0 && score <= total) {
            const percentage = (score / total * 100).toFixed(1);
            $percentageCell.text(percentage + '%');
        } else if (score > total) {
            $percentageCell.text('Error');
            showError('', 'Score cannot be greater than total');
        } else {
            $percentageCell.text('-');
        }
    }

    // Update row numbers after deletion
    function updateRowNumbers() {
        const $rows = $subjectsTable.find('tr');
        $rows.each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    }

    // Show error message
    function showError(fieldId, message) {
        if (fieldId) {
            const $errorElement = $('#' + fieldId);
            $errorElement.text(message).show();
            setTimeout(() => {
                $errorElement.hide();
            }, 3000);
        } else {
            $errorAlert.text(message).show();
            setTimeout(() => {
                $errorAlert.hide();
            }, 3000);
        }
    }

    // Clear error message
    function clearError(fieldId) {
        if (fieldId) {
            const $errorElement = $('#' + fieldId);
            $errorElement.hide();
        }
    }

    // Show success message
    function showSuccess(message) {
        $successAlert.text(message).show();
        setTimeout(() => {
            $successAlert.hide();
        }, 3000);
    }

    // Validate the entire form
    function validateForm() {
        let isValid = true;

        // Validate personal information
        const fullName = $('#fullName').val().trim();
        const age = $('#age').val().trim();
        const parentName = $('#parentName').val().trim();
        const occupation = $('#occupation').val().trim();
        const address = $('#address').val().trim();
        const relationship = $('#relationship').val().trim();

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
        const $rows = $subjectsTable.find('tr');
        if ($rows.length === 0) {
            showError('subjectsError', 'At least one subject is required');
            isValid = false;
        } else {
            $rows.each(function() {
                const subjectName = $(this).find('.subject-name').val().trim();
                const totalMarks = $(this).find('.total-marks').val().trim();
                const score = $(this).find('.score').val().trim();

                if (!subjectName || !totalMarks || !score) {
                    showError('subjectsError', 'All subject fields are required');
                    isValid = false;
                    return false; // Break out of the loop
                }

                if (parseFloat(score) > parseFloat(totalMarks)) {
                    showError('subjectsError', 'Score cannot be greater than total marks');
                    isValid = false;
                    return false; // Break out of the loop
                }
            });
        }

        // If subjects are invalid, stop further validation
        if (!isValid) {
            return false;
        }

        // Validate income details
        const annualIncome = $('#annualIncome').val().trim();
        const requisitionAmount = $('#requisitionAmount').val().trim();
        const natureRequisition = $('#natureRequisition').val().trim();
        const fundAmount = $('#fundAmount').val().trim();

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