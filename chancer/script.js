let mean;
let stdev;
let schoolloc;

const schoolDropdown = document.getElementById('schoolSelect');
const programDropdown = document.getElementById('programSelect');
const resultParagraph = document.getElementById('result');
const imageElement = document.getElementById("displayedImage");
const schoolLocation = document.getElementById('schoollocation');

// Updated schoolPrograms with prerequisites
const schoolPrograms = {
    utsg: {
        name: "University of Toronto",
        location: "Toronto, ON",
        image: "./logo/UniversityOfToronto.jpg",
        header: "./header/utsg.jpg",
        campus: "Urban",
        programs: {
            "Social Sciences": {
                mean: 91.8, 
                stdev: 4.65, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            },
            "Physical and Mathematical Sciences": {
                mean: 93.4, 
                stdev: 4.112, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            },
            "Humanities": {
                mean: 91.5, 
                stdev: 5.1, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            },
            "Life Sciences": {
                mean: 94.1, 
                stdev: 4.08, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            },
            "Rotman Commerce": {
                mean: 95.2, 
                stdev: 3.248, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            },
            "Computer Science": {
                mean: 96.9, 
                stdev: 3.05, 
                prerequisites: ["ENG4U", "MCV4U", "Course 3", "Course 4", "Course 5", "Course 6"]
            }
        },
    },
    uw: {
        name: "University of Waterloo",
        location: "Waterloo, ON",
        programs: {
            "School of Architecture": {
                mean: 91.3, 
                stdev: 4.77, 
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "SPH4U", "Course 5", "Course 6"]
            },
            "School of Computer Science": {
                mean: 97.8, 
                stdev: 3.9, 
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Course 4", "Course 5", "Course 6"]
            },
            "Faculty of Engineering": {
                mean: 95.6, 
                stdev: 3.43, 
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "SPH4U", "SCH4U", "Course 6"]
            },
            "Faculty of Mathematics": {
                mean: 95.1, 
                stdev: 3.37, 
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Course 4", "Course 5", "Course 6"]
            },
            "Faculty of Health": {
                mean: 90.7, 
                stdev: 3.82, 
                prerequisites: ["ENG4U", "Math 4U", "SCH4U", "SBI4U", "Course 5", "Course 6"]
            },
            "Faculty of Science": {
                mean: 91.4, 
                stdev: 4.91, 
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Science/Math 4U", "Science/Math 4U", "Course 6"]
            }
        },
        image: "./logo/UniversityOfWaterloo.svg"
    },
    mac: {
        name: "McMaster University",
        location: "Hamilton, ON",
        programs: {
            "Life Sciences": {
                mean: 95.1,
                stdev: 3.29,
                prerequisites: ["ENG4U", "MHF4U/MCV4U", "SBI4U", "MHF/MCV/SCH/SPH", "Course 5", "Course 6"]
            },
            "Business": {
                mean: 91,
                stdev: 4.16,
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Course 4", "Course 5", "Course 6"]
            },
            "Computer Science": {
                mean: 96.9,
                stdev: 2.47,
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Science/ICS4U/TEJ4M", "Course 5", "Course 6"]
            },
            "Health Sciences": {
                mean: 98, 
                stdev: 2.0, 
                prerequisites: ["ENG4U", "Math 4U", "SCH4U", "SBI4U", "Course 5", "Course 6"]
            },
            "Engineering": {
                mean: 92, 
                stdev: 3.8, 
                prerequisites: ["ENG4U", "MCV4U", "SPH4U", "SCH4U", "Course 5", "Course 6"]
            },
            "Mathematics and Statistics": {
                mean: 90.7,
                stdev: 4.31,
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "Course 4", "Course 5", "Course 6"]
            },
            "Chemical and Physical Sciences": {
                mean: 91.6,
                stdev: 4.48,
                prerequisites: ["ENG4U", "MHF4U", "MCV4U", "SPH4U", "SCH4U", "Course 6"]
            }
        },
        image: "./logo/McMaster_University_Logo.svg"
    }
};

function populatePrograms() {
    // Clear the current options in the program dropdown
    programDropdown.innerHTML = '';

    const selectedSchool = schoolDropdown.value;
    const programs = schoolPrograms[selectedSchool]?.programs;

    if (programs) {
        // Add new program options dynamically
        Object.keys(programs).forEach(program => {
            const option = document.createElement('option');
            option.value = program;
            option.textContent = program;
            programDropdown.appendChild(option);
        });

        // Automatically update labels and calculate probability after programs are populated
        updateLabels();
        calculateProb();
    }
}

function updateLabels() {
    const selectedSchool = schoolDropdown.value;
    const selectedProgram = programDropdown.value;
    const prerequisites = schoolPrograms[selectedSchool]?.programs[selectedProgram]?.prerequisites;

    if (prerequisites) {
        // Update labels for each input based on prerequisites
        for (let i = 0; i < 6; i++) {
            const label = document.getElementById(`label${i + 1}`);
            label.textContent = prerequisites[i] || `Course ${i + 1}`;
        }
    }
}

function calculateProb() {
    const values = [
        document.getElementById('course1').value,
        document.getElementById('course2').value,
        document.getElementById('course3').value,
        document.getElementById('course4').value,
        document.getElementById('course5').value,
        document.getElementById('course6').value
    ];

    const numbers = values.map(value => parseFloat(value)).filter(value => !isNaN(value));

    if (numbers.length === 0) {
        document.getElementById('result').textContent = '';
        return;
    }

    const selectedSchool = schoolDropdown.value;
    const selectedProgram = programDropdown.value;

    if (schoolPrograms[selectedSchool] && schoolPrograms[selectedSchool].programs[selectedProgram]) {
        mean = schoolPrograms[selectedSchool].programs[selectedProgram].mean;
        stdev = schoolPrograms[selectedSchool].programs[selectedProgram].stdev;
        schoolloc = schoolPrograms[selectedSchool].location;
        
        // Check if the school has an image and display/hide accordingly
        const imageSrc = schoolPrograms[selectedSchool].image;
        if (imageSrc) {
            imageElement.src = imageSrc;
            imageElement.style.display = 'block'; // Show the image
        } else {
            imageElement.style.display = 'none'; // Hide the image
        }
        
    } else {
        mean = 0;
        stdev = 1;
        imageElement.style.display = 'none'; // Hide the image if no school/program selected
    }

    let sum = numbers.reduce((acc, num) => acc + num, 0);
    let top6 = sum / numbers.length;
    let zscnum = top6 - mean;
    let zscore = zscnum / (Math.sqrt(2) * stdev);
    let probabilitor = 100 * (0.5 + 0.5 * (math.erf(zscore)));
    
    schoolLocation.textContent = schoolloc;
    document.getElementById('result').textContent = `${probabilitor.toFixed(2)}%`;
}

// Event listener for school selection to populate programs
schoolDropdown.addEventListener('change', populatePrograms);

// Event listener for program selection to update labels and calculate probability
programDropdown.addEventListener('change', () => {
    updateLabels();
    calculateProb();
});

// Initialize the program dropdown based on the first selected school
populatePrograms();

const schools = [
    {
        name: 'University of Toronto',
        location: 'Toronto, ON',
        meanAdmission: 96.9,
        stdev: 3.05,
        logo: './logo/UniversityOfToronto.jpg',
        header: './header/utsg.jpg',
    },
    {
        name: 'University of Waterloo',
        location: 'Waterloo, ON',
        meanAdmission: 97.8,
        stdev: 3.9,
        logo: './logo/UniversityOfWaterloo.svg'
    },
    {
        name: 'Queen\'s University',
        location: 'Kingston, ON',
        meanAdmission: 93.3,
        stdev: 3.96,
        logo: './logo/QueensU.svg'
    },
    {
        name: 'McMaster University',
        location: 'Hamilton, ON',
        meanAdmission: 96.9,
        stdev: 2.47,
        logo: './logo/McMaster_University_Logo.svg'
    }
];

function displaySchoolCards(schoolsToDisplay) {
    const schoolCardsContainer = document.getElementById('school-cards');
    schoolCardsContainer.innerHTML = ''; // Clear existing cards

    schoolsToDisplay.forEach(school => {
        const card = document.createElement('div');
        card.classList.add('school-card');

        card.innerHTML = 
      `<img src="${school.logo}" alt="${school.name} Logo" class="school-logo">
      <h3>${school.name}</h3>
      <p>Location: ${school.location}</p>`;

        // Add click event to each card to redirect to the school info page
        card.addEventListener('click', () => {
            // Save the selected school data in localStorage
            localStorage.setItem('selectedSchool', JSON.stringify(school));

            // Redirect to the info page
            window.location.href = 'school-info.html';
        });

        schoolCardsContainer.appendChild(card);
    });
}

displaySchoolCards(schools);

function filterSchools() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredSchools = schools.filter(school => school.name.toLowerCase().includes(searchInput));
    displaySchoolCards(filteredSchools);
}
function filterSchools() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredSchools = schools.filter(school => school.name.toLowerCase().includes(searchInput));
    displaySchoolCards(filteredSchools);
}

// Add an event listener for the search input to call the filterSchools function
document.getElementById('search-input').addEventListener('input', filterSchools);