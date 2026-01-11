'use server'

import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function scanReceipt(formData: FormData) {
    try{
        const file = formData.get("file") as File;

        if(!file) {
            return {error: "No file uploaded"};
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          Analyze this receipt image. Extract the following details in strictly JSON format:
          - title: The name of the merchant (e.g., Walmart, Starbucks)
          - amount: The total amount paid (number only)
          - category: One of these [Food, Transport, Entertainment, Bills, Other]
          - date: The date of transaction (ISO format YYYY-MM-DD)
    
          If you are unsure about the category, guess based on the merchant.
          Do not include "json" markdown tags. Just return the raw JSON object.
        `;
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("AI Scan Error:", error);
        return { error: "Failed to scan receipt" };
    }
}