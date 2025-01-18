
document.querySelector(".hamburger").addEventListener("click",()=>{
    console.log("hamburger is woring ")
    const navLinks = document.querySelector(".nav-links");
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
    }
});
document.getElementById('size').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('generate-matrix').click();
    }
});
document.getElementById('generate-matrix').addEventListener('click', () => {
    const size = parseInt(document.getElementById('size').value);
    const matrixContainer = document.getElementById('matrix-inputs');

    // Clear previous inputs
    matrixContainer.innerHTML = '';

    // Use a grid layout for matrix input
    matrixContainer.style.display = 'grid';
    matrixContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    matrixContainer.style.gap = '10px';

    // Create input fields for the matrix
    for (let i = 0; i < size * size; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.classList.add('matrix-cell');
        input.setAttribute('data-index', i);

        // Move focus to the next cell or calculate result on "Enter"
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = parseInt(input.getAttribute('data-index')) + 1;
                const inputs = document.querySelectorAll('.matrix-cell');

                if (nextIndex < size * size) {
                    inputs[nextIndex].focus();
                } else {
                    document.getElementById('matrix-form').dispatchEvent(new Event('submit'));
                }
            }
        });

        matrixContainer.appendChild(input);
    }

    // Set focus to the first input field
    document.querySelector('.matrix-cell').focus();
});

document.getElementById('matrix-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const size = parseInt(document.getElementById('size').value);
    const matrix = [];
    const inputs = document.querySelectorAll('#matrix-inputs .matrix-cell');

    // Extract values from input fields and construct the matrix
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const index = i * size + j;
            row.push(parseFloat(inputs[index].value) || 0); // Handle empty inputs as 0
        }
        matrix.push(row);
    }
   const response = await fetch('http://127.0.0.1:3000/matrices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matrics: matrix }) // Ensure "matrics" matches the backend key
});

        if (!response.ok) {
            console.log("frontend conneted shows error")
            const error = await response.json();
            throw new Error(error.error || 'An unknown error occurred');
        }

        // Process the response
        const result = await response.json();

        document.getElementById('determinant').textContent = `Determinant: ${result.determinant}`;

        if (result.inversematrix) {
            document.getElementById('inverse-container').style.display = 'block';
            document.getElementById('inverse-matrix').textContent = formatMatrix(result.inversematrix);
        } else {
            document.getElementById('inverse-container').style.display = 'none';
        }

        document.getElementById('identity-container').style.display = 'block';
        document.getElementById('identity-matrix').textContent = formatMatrix(result.identitymatrix);
        document.getElementById('results').classList.remove('hidden');
    // } catch (error) {
    //     alert('Error: ' + error.message);
    // }
});

// Helper function to format matrices for display
function formatMatrix(matrix) {
    return matrix.map(row => row.join('\t')).join('\n');
}
