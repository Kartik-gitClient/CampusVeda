import axios from 'axios';

// Llama 3.3 70B Integration via Groq or generic OpenAI-compatible endpoint.
// For hackathon purposes, falls back to intelligent mocks if API key is missing.

const generateChatCompletion = async (prompt, systemMessage) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.LLAMA_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ No Llama API Key found. Returning mock AI response.");
    return null;
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error?.response?.data || error.message);
    return null;
  }
};

export const suggestConflictResolution = async (conflictDetails) => {
  const systemMessage = "You are an expert campus operations administrator. Provide exactly ONE short, practical sentence suggesting how to resolve a scheduling or resource conflict.";
  const prompt = `Conflict Details: ${JSON.stringify(conflictDetails)}\nSuggest a resolution.`;
  
  const aiResponse = await generateChatCompletion(prompt, systemMessage);
  
  return aiResponse || "💡 AI Suggestion: Consider moving the request to an alternative room with similar capacity or adjusting the time block.";
};

export const generateResourceDocument = async (requestData) => {
  const systemMessage = "You are a professional administrative assistant. Generate a formal, brief Resource Request Document based on the provided data.";
  const prompt = `Request Data: ${JSON.stringify(requestData)}`;
  
  const aiResponse = await generateChatCompletion(prompt, systemMessage);
  
  if (aiResponse) return aiResponse;

  // Fallback: fill template with actual faculty/request data
  const startDate = requestData.startDate ? new Date(requestData.startDate) : null;
  const endDate = requestData.endDate ? new Date(requestData.endDate) : null;
  const startTime = startDate ? startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const endTime = endDate ? endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const startDateStr = startDate ? startDate.toLocaleDateString('en-IN') : 'N/A';
  const duration = (startDate && endDate) ? `${Math.round((endDate - startDate) / (1000 * 60 * 60))} hour(s)` : 'N/A';

  return `
RESOURCE REQUEST FORM
--------------------------------------------

Date: ${new Date().toLocaleDateString('en-IN')}

Applicant Details
--------------------------------------------
Name: ${requestData.userName || 'N/A'}
Department/Class: ${requestData.userDepartment || 'N/A'}
Contact Information: ${requestData.userEmail || 'N/A'}

Request Details
--------------------------------------------
Resource Requested: ${requestData.resourceName || 'Specified Resource'}

Purpose of Request:
${requestData.purpose || 'Academic / Operational Purpose'}

Requested Schedule:
Start Date: ${startDateStr}
Time: ${startTime} to ${endTime}

Duration: ${duration}

Priority: ${requestData.priority || 'Normal'}

Additional Requirements: ${requestData.notes || 'None'}

Declaration
--------------------------------------------
I hereby declare that the requested resource will be used responsibly
and strictly for the purpose mentioned above. I agree to comply with
all institutional rules and guidelines.

Signature of Applicant: ${requestData.userName || '_______________'}

Approval Section (For Office Use Only)
--------------------------------------------
Status: [ ] Approved   [ ] Rejected

Remarks:
_____________________________________

Authorized Signature: _______________
Date: _______________________________

--------------------------------------------
This document serves as an official request for the usage of
institutional resources.
  `.trim();
};

export const getManagementAdvice = async (scenario) => {
  const systemMessage = "You are a senior facility manager advising a Head of Department. Give brief, actionable advice (max 2 sentences) for the scenario.";
  const prompt = `Scenario: ${scenario}`;
  
  const aiResponse = await generateChatCompletion(prompt, systemMessage);
  
  return aiResponse || "Ensure all departmental policies regarding resource utilization are communicated clearly to avoid friction.";
};
