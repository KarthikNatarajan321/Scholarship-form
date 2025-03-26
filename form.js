$(document).ready(function() {
    const $form = $('#scholarshipForm');
    const $addSubjectBtn = $('#addSubjectBtn');
    const $subjectsTable = $('#subjectsTable tbody');

    // Add subject functionality (keeping existing logic)
    $addSubjectBtn.on('click', function() {
        const $rows = $subjectsTable.find('tr');

        // Validate the last row before adding a new one
        if ($rows.length > 0) {
            const $lastRow = $rows.last();
            const subjectName = $lastRow.find('.subject-name').val().trim();
            const totalMarks = $lastRow.find('.total-marks').val().trim();
            const score = $lastRow.find('.score').val().trim();

            if (!subjectName || !totalMarks || !score) {
                alert('Fill the fields in the current row before adding a new one');
                return;
            }
        }

        // Check maximum rows
        if ($rows.length >= 5) {
            alert('Maximum 5 subjects allowed');
            $addSubjectBtn.addClass('disabled');
        } else {
            addSubjectRow();
            if ($rows.length >= 4) {
                $addSubjectBtn.addClass('disabled');
            }
        }
    });

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

    // Update row numbers after deletion
    function updateRowNumbers() {
        const $rows = $subjectsTable.find('tr');
        $rows.each(function(index) {
            $(this).find('td:first').text(index + 1);
        });
    }

    // jQuery Validation Setup with Comprehensive Rules
    $("#scholarshipForm").validate({
        // Custom error placement
        errorPlacement: function(error, element) {
            // Place error messages next to the input
            error.insertAfter(element);
            $(error).addClass("error-message");
            // Also show error in the designated error message div
            var errorId = "#" + element.attr("id") + "Error";
            $(errorId).text(error.text()).show();
        },

        // Custom highlight and unhighlight
        highlight: function(element) {
            $(element).addClass("error");
            var errorId = "#" + $(element).attr("id") + "Error";
            // $(errorId).addClass("error-message");
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

        // Form submission handler
        submitHandler: function(form) {
            // Check subjects table validation
            const $rows = $subjectsTable.find('tr');
            if ($rows.length === 0) {
                alert('At least one subject is required');
                return false;
            }

            $rows.each(function() {
                const subjectName = $(this).find('.subject-name').val().trim();
                const totalMarks = $(this).find('.total-marks').val().trim();
                const score = $(this).find('.score').val().trim();

                if (!subjectName || !totalMarks || !score) {
                    alert('All subject fields are required');
                    return false;
                }

                if (parseFloat(score) > parseFloat(totalMarks)) {
                    alert('Score cannot be greater than total marks');
                    return false;
                }
            });

            // If all validations pass
            alert("Form submitted successfully!");
            form.submit();
        }
    });

    // Add custom validation method for letters only
    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    });
});