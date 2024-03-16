const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateSinglePdf(questionSet, index) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        const question = questionSet;

        // Create HTML content for the question
        let htmlContent = `<h1>Physics Question ${index + 1}</h1>`;
        htmlContent += `<p><strong>Question:</strong> ${question.question}</p>`;
        htmlContent += '<ul>';
        htmlContent += `<li>A. ${question.optionA}</li>`;
        htmlContent += `<li>B. ${question.optionB}</li>`;
        htmlContent += `<li>C. ${question.optionC}</li>`;
        htmlContent += `<li>D. ${question.optionD}</li>`;
        htmlContent += '</ul>';

        // Set the HTML content
        await page.setContent(htmlContent);

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Save PDF to file
        fs.writeFileSync(`physics_question_${index + 1}.pdf`, pdfBuffer);

        console.log(`PDF ${index + 1} generated successfully.`);
    } catch (error) {
        console.error(`Error generating PDF ${index + 1}:`, error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}


async function generatePdf() {
    try {
        // Read JSON data from the file
        const jsonData = JSON.parse(fs.readFileSync('questions.json', 'utf8')).data;
        
        if (!jsonData || !jsonData.questions || !Array.isArray(jsonData.questions)) {
            throw new Error('Invalid JSON structure: Questions array not found or not an array.');
        }

        const questions = jsonData.questions;

        // Generate 100 PDFs by repeating the questions
        const pdfPromises = Array.from({ length: 100 }, (_, i) => generateSinglePdf(questions[i % questions.length], i));
        await Promise.all(pdfPromises);
        
        console.log('All PDFs generated successfully.');
    } catch (error) {
        console.error('Error generating PDFs:', error);
    }
}

generatePdf();
