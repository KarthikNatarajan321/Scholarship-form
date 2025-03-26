$(document).ready(function() {
    const $form = $('#scholarshipForm');
    const $addSubjectBtn = $('#addSubjectBtn');
    const $subjectsTable = $('#subjectsTable tbody');
    
    // Updated form fields in the exact order of the form
    const formFields = [
        'fullName', 
        'age', 
        'parentName', 
        'occupation', 
        'address', 
        'relationship', 
        'subjectsTable', 
        'annualIncome', 
        'requisitionAmount', 
        'natureRequisition', 
        'fundAmount'
    ];

    // Initialize first subject row
    function initializeSubjectsTable() {
        // Add the first row by default
        addSubjectRow();
    }

    // Function to add a new subject row
    function addSubjectRow() {
        const $rows = $subjectsTable.find('tr');
        const rowCount = $rows.length;
        const $newRow = $(`
            <tr>
                <td>${rowCount + 1}</td>
                <td><input type="text" name="subject_${rowCount}" class="subject-input subject-name" placeholder="Subject name" required></td>
                <td><input type="number" name="totalMarks_${rowCount}" class="subject-input total-marks" placeholder="Total" required min="0"></td>
                <td><input type="number" name="score_${rowCount}" class="subject-input score" placeholder="Score" required min="0"></td>
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
            if ($subjectsTable.find('tr').length > 1) {
                $row.remove();
                updateRowNumbers();
                // Enable the add button if needed
                if ($subjectsTable.find('tr').length < 5) {
                    $addSubjectBtn.removeClass('disabled');
                }
                
                // Validate subjects table
                validateSubjectsTable();
            }
        });

        // Calculate percentage when total or score changes
        $totalInput.add($scoreInput).on('input', function() {
            calculatePercentage($row);
            validateSubjectsTable();
        });

        // Validate on subject input
        $subjectInput.on('input', validateSubjectsTable);
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
        } else {
            $percentageCell.text('-');
        }
    }

    // Validate subjects table
    function validateSubjectsTable() {
        const $rows = $subjectsTable.find('tr');
        let isValid = true;
        let hasContent = false;

        $rows.each(function() {
            const $row = $(this);
            const subjectName = $row.find('.subject-name').val().trim();
            const totalMarks = $row.find('.total-marks').val().trim();
            const score = $row.find('.score').val().trim();

            if (subjectName || totalMarks || score) {
                hasContent = true;
            }

            if (subjectName && totalMarks && score) {
                const totalMarksNum = parseFloat(totalMarks);
                const scoreNum = parseFloat(score);

                if (scoreNum > totalMarksNum) {
                    isValid = false;
                    return false;
                }
            } else if (subjectName || totalMarks || score) {
                // Partially filled row
                isValid = false;
                return false;
            }
        });

        if (!hasContent) {
            isValid = false;
        }

        // Update error message
        if (!isValid) {
            $('#subjectsError')
                .show()
                .addClass('error-message')
                .text('Please fill all subject fields correctly or remove empty rows');
        } else {
            $('#subjectsError').hide();
        }

        return isValid;
    }

    // Update row numbers after deletion
    function updateRowNumbers() {
        const $rows = $subjectsTable.find('tr');
        $rows.each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    }

    // Add subject button event listener
    $addSubjectBtn.on('click', function() {
        // Validate existing rows first
        if (validateSubjectsTable()) {
            const $rows = $subjectsTable.find('tr');

            // Check maximum rows
            if ($rows.length >= 5) {
                $('#subjectsError')
                    .show()
                    .addClass('error-message')
                    .text('Maximum 5 subjects allowed');
                $addSubjectBtn.addClass('disabled');
            } else {
                addSubjectRow();
                if ($rows.length >= 4) {
                    $addSubjectBtn.addClass('disabled');
                }
            }
        }
    });

    // Setup progressive validation
    function setupProgressiveValidation() {
        let currentFieldIndex = 0;
    
        // Disable all fields initially
        formFields.slice(1).forEach(field => {
            if (field === 'subjectsTable') {
                // Disable add subject button
                $('#addSubjectBtn').prop('disabled', true);
            } else {
                $(`#${field}`).prop('disabled', true);
            }
        });
    
        // Function to check if all previous fields are valid
        function areAllPreviousFieldsValid(currentIndex) {
            for (let i = 0; i < currentIndex; i++) {
                const field = formFields[i];
                
                // Skip checking subjectsTable
                if (field === 'subjectsTable') continue;
                
                const $input = $(`#${field}`);
                
                // If any previous field is not valid, return false
                if (!$input.valid()) {
                    return false;
                }
            }
            return true;
        }
    
        // Custom validation function
        function validateCurrentField() {
            const currentField = formFields[currentFieldIndex];
            
            // Special handling for subjects table
            if (currentField === 'subjectsTable') {
                // Only proceed if all previous fields are valid
                if (!areAllPreviousFieldsValid(currentFieldIndex)) {
                    $('#addSubjectBtn').prop('disabled', true);
                    $('#subjectsError')
                        .show()
                        .addClass('error-message')
                        .text('Please complete all previous fields first');
                    return false;
                }
    
                const isValid = validateSubjectsTable();
    
                if (isValid) {
                    $('#subjectsError').hide();
                    // Move to next field
                    if (currentFieldIndex < formFields.length - 1) {
                        currentFieldIndex++;
                        const nextField = formFields[currentFieldIndex];
                        
                        if (nextField === 'subjectsTable') {
                            $('#addSubjectBtn').prop('disabled', false);
                        } else {
                            $(`#${nextField}`).prop('disabled', false);
                            $(`#${nextField}`).focus();
                        }
                    }
                    return true;
                }
                return false;
            }
    
            // Regular field validation
            const $currentInput = $(`#${currentField}`);
            const errorId = `#${currentField}Error`;
            
            // Remove any previous error styling
            $currentInput.removeClass('error');
            $(errorId).hide();
    
            // Validate the current field
            if ($currentInput.valid()) {
                // Current field is valid
                $currentInput.addClass('valid');
                $(errorId).hide();
                
                // Move to next field if it exists
                if (currentFieldIndex < formFields.length - 1) {
                    currentFieldIndex++;
                    const nextField = formFields[currentFieldIndex];
                    
                    if (nextField === 'subjectsTable') {
                        // Only enable if all previous fields are valid
                        if (areAllPreviousFieldsValid(currentFieldIndex)) {
                            $('#addSubjectBtn').prop('disabled', false);
                        } else {
                            $('#addSubjectBtn').prop('disabled', true);
                        }
                    } else {
                        $(`#${nextField}`).prop('disabled', false);
                        $(`#${nextField}`).focus();
                    }
                }
                return true;
            } else {
                // Field is invalid
                $currentInput.addClass('error');
                $(errorId).show();
                $currentInput.focus();
                return false;
            }
        }
    
        // Add onChange validation for each field
        formFields.forEach(field => {
            if (field === 'subjectsTable') {
                // Special handling for subjects table
                $subjectsTable.on('change', 'input', validateCurrentField);
            } else {
                $(`#${field}`).on('change', validateCurrentField);
            }
        });
    
        // Initial setup of first field (full name)
        $(`#${formFields[0]}`).prop('disabled', false);
    } 

    // Setup the form with progressive validation
    $("#scholarshipForm").validate({
        errorPlacement: function(error, element) {
            error.insertAfter(element);
            $(error).addClass("error-message");
            var errorId = "#" + element.attr("id") + "Error";
            $(errorId).text(error.text()).show();
        },

        highlight: function(element) {
            $(element).addClass("error");
            var errorId = "#" + $(element).attr("id") + "Error";
            $(errorId).show();
        },
        unhighlight: function(element) {
            $(element).removeClass("error");
            var errorId = "#" + $(element).attr("id") + "Error";
            $(errorId).hide();
        },

        // Validation Rules
        rules: {
            fullName: {
                required: true,
                lettersonly: true
            },
            age: {
                required: true,
                range: [15, 35]
            },
            parentName: {
                required: true,
                lettersonly: true
            },
            occupation: {
                required: true,
                lettersonly: true
            },
            address: {
                required: true
            },
            relationship: {
                required: true,
                lettersonly: true
            },
            annualIncome: {
                required: true
            },
            requisitionAmount: {
                required: true,
                digits: true
            },
            natureRequisition: {
                required: true,
                lettersonly: true
            },
            fundAmount: {
                required: true,
                digits: true,
                max: function() {
                    return parseFloat($("#requisitionAmount").val()) || 0;
                }
            }
        },

        // Custom Validation Messages
        messages: {
            fullName: {
                required: "Full name is required",
                lettersonly: "Only alphabets are allowed"
            },
            age: {
                required: "Age is required",
                range: "Age must be between 15 and 35"
            },
            parentName: {
                required: "Parent name is required",
                lettersonly: "Only alphabets are allowed"
            },
            occupation: {
                required: "Occupation is required",
                lettersonly: "Only alphabets are allowed"
            },
            address: {
                required: "Address is required"
            },
            relationship: {
                required: "Relationship is required",
                lettersonly: "Only alphabets are allowed"
            },
            requisitionAmount: {
                required: "Requisition amount is required",
                digits: "Only numbers are allowed"
            },
            fundAmount: {
                required: "Fund amount is required",
                digits: "Only numbers are allowed",
                max: "Fund amount cannot be greater than requisition amount"
            }
        },

        submitHandler: function(form) {
            // Final validation of subjects table
            if (!validateSubjectsTable()) {
                return false;
            }
            
            alert("Form submitted successfully!");
            form.submit();
        }
    });

    // Add custom validation method for letters only
    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    });

    // Initialize the subjects table with first row
    initializeSubjectsTable();

    // Initialize progressive validation
    setupProgressiveValidation();
});