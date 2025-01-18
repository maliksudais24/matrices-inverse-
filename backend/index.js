// console.log("Current directory:", __dirname);
import express from "express";
import bodyParser from "body-parser";
import * as math from "mathjs";
import cors from "cors"

const app = express();
const port = 3000;
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use(bodyParser.json());
app.use(express.static("public"));


app.post("/matrices", (req, res) => {
    const { matrics } = req.body;
    // Ensure this block is correctly configured to process requests

    // Input validation
    if (!Array.isArray(matrics) || matrics.length === 0 || matrics.some(row => row.length !== matrics.length)) {
        return res.status(400).json({ error: "Input must be a non-empty square matrix" });
    }

    try {
        const det = math.det(matrics);
        if (det === 0) {
            return res.json({
                determinant: det,
                message: "Determinant is 0. The matrix is singular and cannot be inverted."
            });
        }

        const inversematrix = math.round(math.inv(matrics).map(row => row.map(num => num * det)));
        const identitymatrix = math.round(math.multiply(matrics, math.inv(matrics)));

        return res.json({
            determinant: det,
            inversematrix,
            identitymatrix,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`);
});
