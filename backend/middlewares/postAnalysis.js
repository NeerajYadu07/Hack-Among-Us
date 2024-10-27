const express = require("express");
const multer = require("multer");
const {
	GoogleGenerativeAI,
	GoogleAIFileManager,
} = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: "uploads/" });

// Replace with your actual API key
const apiKey = "YOUR_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(filePath, mimeType) {
	const uploadResult = await fileManager.uploadFile(filePath, {
		mimeType,
		displayName: filePath,
	});
	const file = uploadResult.file;
	console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
	return file;
}

async function waitForFilesActive(files) {
	console.log("Waiting for file processing...");
	for (const name of files.map((file) => file.name)) {
		let file = await fileManager.getFile(name);
		while (file.state === "PROCESSING") {
			process.stdout.write(".");
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			file = await fileManager.getFile(name);
		}
		if (file.state !== "ACTIVE") {
			throw Error(`File ${file.name} failed to process`);
		}
	}
	console.log("...all files ready\n");
}

async function analyzeData(textInput, file) {
	const model = genAI.getGenerativeModel({
		model: "gemini-1.5-flash",
	});

	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 8192,
		responseMimeType: "application/json",
	};

	const chatSession = model.startChat({
		generationConfig,
		history: [
			{
				role: "user",
				parts: [
					{
						text: textInput,
					},
				],
			},
		],
	});

	if (file) {
		const uploadedFile = await uploadToGemini(file.path, file.mimetype);
		await waitForFilesActive([uploadedFile]);

		chatSession.addMessage({
			role: "user",
			parts: [
				{
					fileData: {
						mimeType: uploadedFile.mimeType,
						fileUri: uploadedFile.uri,
					},
				},
				{
					text: "Analyze this image/video for drug-related content.",
				},
			],
		});
	}

	const result = await chatSession.sendMessage();
	return result.response.text();
}
