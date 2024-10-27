import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)
const fileManager = new GoogleAIFileManager(apiKey)
// const sharp = require("sharp");
// const cloudinary = require("cloudinary").v2;

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { log } from 'console'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// const cloudinary = require("cloudinary").v2;

// Helper function to upload media to Gemini
async function uploadToGemini(filePath, mimeType) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath),
  })
  const file = uploadResult.file
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`)
  return file
}

// Function to wait until files are active
async function waitForFilesActive(files) {
  console.log('Waiting for file processing...')
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name)
    while (file.state === 'PROCESSING') {
      process.stdout.write('.')
      await new Promise((resolve) => setTimeout(resolve, 10_000))
      file = await fileManager.getFile(name)
    }
    if (file.state !== 'ACTIVE') {
      throw Error(`File ${file.name} failed to process`)
    }
  }
  console.log('...all files ready\n')
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  // {
  // 	category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
  // 	threshold: HarmBlockThreshold.BLOCK_NONE,
  // },
]
// Function to analyze data using Gemini
async function analyzeData(mediaFiles, caption) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: safetySettings,
  })

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  }

  await waitForFilesActive(mediaFiles)

  const chatSession = model.startChat({
    generationConfig,
    history: mediaFiles.map((file) => ({
      role: 'user',
      parts: [
        {
          fileData: {
            mimeType: file.mimeType,
            fileUri: file.uri,
          },
        },
        {
          text: caption,
        },
      ],
    })),
  })

  const result = await chatSession.sendMessage(
    'Analyze the provided data (image, text, or video) to detect content related specifically to illegal drugs, ignoring safe or prescribed medications. For images and videos, look for visual indicators such as identifiable pills, powders, capsules, or paraphernalia often linked to illicit drugs. In text, consider potential slang, abbreviations, or encrypted terms commonly used to refer to drugs on social media or in chats. Return a probability score between 0 (no likelihood) and 1 (high likelihood) for each data type, with an explanation that identifies specific words, symbols, or items that contribute to the flagged assessment.Return the result in the following JSON format:{image: {probability: <number>, description: <string>},text: {probability: <number>, description: <string>}}'
  )
  return JSON.parse(result.response.text())
}
async function analyzeText(caption) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: safetySettings,
  })

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: caption,
          },
        ],
      },
    ],
  })

  const result = await chatSession.sendMessage(
    'Analyze the provided text to detect content related specifically to illegal drugs, ignoring safe or prescribed medications. For images and videos, look for visual indicators such as identifiable pills, powders, capsules, or paraphernalia often linked to illicit drugs. In text, consider potential slang, abbreviations, or encrypted terms commonly used to refer to drugs on social media or in chats. Return a probability score between 0 (no likelihood) and 1 (high likelihood) for each data type, with an explanation that identifies specific words, symbols, or items that contribute to the flagged assessment.Return the result in the following JSON format:{image: {probability: 0, description: no image},text: {probability: <number>, description: <string>}}'
  )
  return JSON.parse(result.response.text())
}

export { analyzeData, analyzeText, uploadToGemini }
